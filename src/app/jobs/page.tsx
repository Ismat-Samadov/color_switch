import Link from "next/link";
import { Briefcase, MapPin } from "lucide-react";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

async function getJobs() {
  try {
    const jobsList = await db.query.jobs.findMany({
      where: eq(jobs.isActive, true),
      with: {
        company: true,
      },
      orderBy: [desc(jobs.createdAt)],
    });
    return jobsList;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Next Job</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse {jobs.length} available positions
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No jobs available yet</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new opportunities!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job: any) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    {job.company.name}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {job.type}
                  </div>
                </div>

                {job.salary && (
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">
                    {job.salary}
                  </p>
                )}

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {job.description}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
