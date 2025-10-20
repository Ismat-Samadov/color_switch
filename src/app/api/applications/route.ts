import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { uploadToR2, generateUniqueFileName } from "@/lib/r2";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    let userApplications;

    if (jobId) {
      // Get applications for a specific job (employer view)
      userApplications = await db.query.applications.findMany({
        where: eq(applications.jobId, jobId),
        with: {
          user: true,
        },
      });
    } else {
      // Get user's own applications (applicant view)
      userApplications = await db.query.applications.findMany({
        where: eq(applications.userId, session.user.id),
        with: {
          job: {
            with: {
              company: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ applications: userApplications });
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
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

    if (session.user.role !== "applicant") {
      return NextResponse.json(
        { error: "Only applicants can submit applications" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const jobId = formData.get("jobId") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const cvFile = formData.get("cvFile") as File;

    if (!cvFile) {
      return NextResponse.json(
        { error: "CV file is required" },
        { status: 400 }
      );
    }

    // Check if user already applied to this job
    const existingApplication = await db.query.applications.findFirst({
      where: (applications, { and, eq }) =>
        and(
          eq(applications.jobId, jobId),
          eq(applications.userId, session.user.id)
        ),
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 400 }
      );
    }

    // Upload CV to R2
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const fileName = generateUniqueFileName(cvFile.name);
    const cvUrl = await uploadToR2(buffer, fileName, cvFile.type);

    // Create application
    const [newApplication] = await db
      .insert(applications)
      .values({
        jobId,
        userId: session.user.id,
        coverLetter: coverLetter || null,
        cvUrl,
        cvFileName: cvFile.name,
      })
      .returning();

    return NextResponse.json(
      { application: newApplication },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
