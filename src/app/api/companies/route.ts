import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { companySchema } from "@/lib/validations";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userCompanies = await db.query.companies.findMany({
      where: eq(companies.userId, session.user.id),
    });

    return NextResponse.json({ companies: userCompanies });
  } catch (error) {
    console.error("Get companies error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "employer") {
      return NextResponse.json(
        { error: "Only employers can create companies" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = companySchema.parse(body);

    const [newCompany] = await db
      .insert(companies)
      .values({
        ...validatedData,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json({ company: newCompany }, { status: 201 });
  } catch (error) {
    console.error("Create company error:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
