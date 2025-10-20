import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "applicant") {
    redirect("/dashboard");
  }

  // Get user's applications
  const userApplications = await db.query.applications.findMany({
    where: eq(applications.userId, session.user.id),
    with: {
      job: {
        with: {
          company: true,
        },
      },
    },
    orderBy: [desc(applications.createdAt)],
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your job applications
          </p>
        </div>

        {userApplications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You haven't applied to any jobs yet
            </p>
            <Link
              href="/jobs"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {userApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">
                      {application.job.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {application.job.company.name} • {application.job.location}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      application.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : application.status === "reviewing"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        : application.status === "accepted"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium">Applied:</span>{" "}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">CV:</span>{" "}
                    <a
                      href={application.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {application.cvFileName}
                    </a>
                  </p>
                  {application.coverLetter && (
                    <p>
                      <span className="font-medium">Cover Letter:</span>{" "}
                      {application.coverLetter.substring(0, 100)}
                      {application.coverLetter.length > 100 ? "..." : ""}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Job Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
