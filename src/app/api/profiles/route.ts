import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { uploadToR2, generateUniqueFileName } from "@/lib/r2";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      // Get specific user's profile
      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userId),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ profile });
    } else {
      // Get all public profiles (for employers to browse)
      const publicProfiles = await db.query.profiles.findMany({
        where: eq(profiles.isPublic, true),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [desc(profiles.updatedAt)],
      });

      return NextResponse.json({ profiles: publicProfiles });
    }
  } catch (error) {
    console.error("Get profiles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
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
        { error: "Only applicants can create profiles" },
        { status: 403 }
      );
    }

    // Check if user already has a profile
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists. Use PATCH to update." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const portfolioUrl = formData.get("portfolioUrl") as string;
    const skills = formData.get("skills") as string;
    const experience = formData.get("experience") as string;
    const education = formData.get("education") as string;
    const isPublic = formData.get("isPublic") === "true";
    const cvFile = formData.get("cvFile") as File | null;

    let cvUrl: string | null = null;
    let cvFileName: string | null = null;

    // Upload CV if provided
    if (cvFile && cvFile.size > 0) {
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      const fileName = generateUniqueFileName(cvFile.name);
      cvUrl = await uploadToR2(buffer, fileName, cvFile.type);
      cvFileName = cvFile.name;
    }

    // Create profile
    const [newProfile] = await db
      .insert(profiles)
      .values({
        userId: session.user.id,
        title,
        bio: bio || null,
        location: location || null,
        phoneNumber: phoneNumber || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        portfolioUrl: portfolioUrl || null,
        skills: skills || null,
        experience: experience || null,
        education: education || null,
        cvUrl,
        cvFileName,
        isPublic,
      })
      .returning();

    return NextResponse.json({ profile: newProfile }, { status: 201 });
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
