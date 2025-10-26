import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { uploadToR2, generateUniqueFileName, deleteFromR2 } from "@/lib/r2";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
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
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    // Verify ownership
    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!existingProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
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
    const removeCv = formData.get("removeCv") === "true";

    let cvUrl = existingProfile.cvUrl;
    let cvFileName = existingProfile.cvFileName;

    // Handle CV removal
    if (removeCv && existingProfile.cvUrl) {
      try {
        const key = existingProfile.cvUrl.split('/').pop();
        if (key) {
          await deleteFromR2(`cvs/${key}`);
        }
      } catch (error) {
        console.error("Failed to delete old CV:", error);
      }
      cvUrl = null;
      cvFileName = null;
    }

    // Upload new CV if provided
    if (cvFile && cvFile.size > 0) {
      // Delete old CV if exists
      if (existingProfile.cvUrl) {
        try {
          const key = existingProfile.cvUrl.split('/').pop();
          if (key) {
            await deleteFromR2(`cvs/${key}`);
          }
        } catch (error) {
          console.error("Failed to delete old CV:", error);
        }
      }

      const buffer = Buffer.from(await cvFile.arrayBuffer());
      const fileName = generateUniqueFileName(cvFile.name);
      cvUrl = await uploadToR2(buffer, fileName, cvFile.type);
      cvFileName = cvFile.name;
    }

    // Update profile
    const [updatedProfile] = await db
      .update(profiles)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    // Verify ownership
    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!existingProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Delete CV from R2 if exists
    if (existingProfile.cvUrl) {
      try {
        const key = existingProfile.cvUrl.split('/').pop();
        if (key) {
          await deleteFromR2(`cvs/${key}`);
        }
      } catch (error) {
        console.error("Failed to delete CV:", error);
      }
    }

    await db.delete(profiles).where(eq(profiles.userId, userId));

    return NextResponse.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Delete profile error:", error);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
