import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { jobSchema } from "@/lib/validations";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let jobsList;

    if (userId) {
      // Get jobs for a specific user (employer's dashboard)
      jobsList = await db.query.jobs.findMany({
        where: eq(jobs.userId, userId),
        with: {
          company: true,
        },
        orderBy: [desc(jobs.createdAt)],
      });
    } else {
      // Get all active jobs (public listing)
      jobsList = await db.query.jobs.findMany({
        where: eq(jobs.isActive, true),
        with: {
          company: true,
        },
        orderBy: [desc(jobs.createdAt)],
      });
    }

    return NextResponse.json({ jobs: jobsList });
  } catch (error) {
    console.error("Get jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
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
        { error: "Only employers can create jobs" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = jobSchema.parse(body);

    const [newJob] = await db
      .insert(jobs)
      .values({
        ...validatedData,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json({ job: newJob }, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
