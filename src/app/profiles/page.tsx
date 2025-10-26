import Link from "next/link";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { MapPin, Briefcase, ExternalLink, User } from "lucide-react";
import { auth } from "@/lib/auth";

async function getPublicProfiles() {
  try {
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
    return publicProfiles;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }
}

export default async function ProfilesPage() {
  const session = await auth();
  const publicProfiles = await getPublicProfiles();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Browse Candidate Profiles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover talented professionals looking for opportunities
          </p>
        </div>

        {publicProfiles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No profiles yet</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to create a profile!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicProfiles.map((profile: any) => (
              <Link
                key={profile.id}
                href={`/profiles/${profile.userId}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">
                      {profile.user.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {profile.title}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                {profile.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {profile.bio}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {profile.location && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {profile.location}
                    </div>
                  )}
                </div>

                {profile.skills && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.skills
                        .split(",")
                        .slice(0, 3)
                        .map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      {profile.skills.split(",").length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          +{profile.skills.split(",").length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500">
                    Updated{" "}
                    {new Date(profile.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Profile
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
