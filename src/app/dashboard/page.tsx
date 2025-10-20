import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "employer") {
    redirect("/");
  }

  // Fetch user's jobs
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/jobs?userId=${session.user.id}`,
    { cache: "no-store" }
  );
  const { jobs } = await response.json();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Employer Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your job postings
            </p>
          </div>
          <Link
            href="/dashboard/jobs/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Your Job Postings</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {jobs.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No jobs posted yet. Create your first job posting!
                </p>
              </div>
            ) : (
              jobs.map((job: any) => (
                <div key={job.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {job.company.name} • {job.location} • {job.type}
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            job.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {job.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Posted{" "}
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
