import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { jobs, applications } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "employer") {
    redirect("/");
  }

  // Get job with applications
  const job = await db.query.jobs.findFirst({
    where: eq(jobs.id, id),
    with: {
      company: true,
    },
  });

  if (!job) {
    notFound();
  }

  // Verify ownership
  if (job.userId !== session.user.id) {
    redirect("/dashboard");
  }

  // Get applications for this job
  const jobApplications = await db.query.applications.findMany({
    where: eq(applications.jobId, id),
    with: {
      user: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {job.company.name} • {job.location} • {job.type}
              </p>
              {job.salary && (
                <p className="text-lg text-blue-600 dark:text-blue-400 mt-2">
                  {job.salary}
                </p>
              )}
            </div>
            <span
              className={`px-3 py-1 rounded text-sm ${
                job.isActive
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {job.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {job.requirements}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500">
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">
              Applications ({jobApplications.length})
            </h2>
          </div>

          {jobApplications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No applications yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {jobApplications.map((application) => (
                <div key={application.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{application.user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {application.user.email}
                      </p>
                      {application.coverLetter && (
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          {application.coverLetter.substring(0, 150)}
                          {application.coverLetter.length > 150 ? "..." : ""}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <a
                          href={application.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          View CV
                        </a>
                        <span className="text-xs text-gray-500">
                          Applied {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        application.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : application.status === "reviewing"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : application.status === "accepted"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
