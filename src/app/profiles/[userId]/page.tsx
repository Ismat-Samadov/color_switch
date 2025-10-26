import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Github,
  ExternalLink,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getProfile(userId: string) {
  try {
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
    return profile || null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const profile = await getProfile(userId);
  const session = await auth();

  if (!profile) {
    notFound();
  }

  // Check if user can view this profile
  const isOwner = session?.user?.id === userId;
  if (!profile.isPublic && !isOwner) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Link
          href="/profiles"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profiles
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{profile.user.name}</h1>
                <p className="text-xl text-blue-100">{profile.title}</p>
              </div>
              {isOwner && (
                <Link
                  href="/dashboard/profile"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 font-medium"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>

          {/* Contact & Social Section */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-2 gap-4">
              {profile.location && (
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  {profile.location}
                </div>
              )}
              {profile.phoneNumber && (
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Phone className="w-5 h-5 mr-3 text-gray-500" />
                  {profile.phoneNumber}
                </div>
              )}
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 mr-3 text-gray-500" />
                {profile.user.email}
              </div>
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Linkedin className="w-5 h-5 mr-3" />
                  LinkedIn Profile
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Github className="w-5 h-5 mr-3" />
                  GitHub Profile
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-5 h-5 mr-3" />
                  Portfolio
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Skills Section */}
          {profile.skills && (
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-blue-600" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.split(",").map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {profile.experience && (
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
                Work Experience
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {profile.experience}
                </p>
              </div>
            </div>
          )}

          {/* Education Section */}
          {profile.education && (
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
                Education
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {profile.education}
                </p>
              </div>
            </div>
          )}

          {/* CV Download Section */}
          {profile.cvUrl && (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                Resume/CV
              </h2>
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                <FileText className="w-5 h-5 mr-2" />
                Download CV ({profile.cvFileName})
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
