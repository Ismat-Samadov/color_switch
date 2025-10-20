import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, DollarSign } from "lucide-react";
import { auth } from "@/lib/auth";

async function getJob(id: string) {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/jobs/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.job;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  const session = await auth();

  if (!job) {
    notFound();
  }

  const isApplicant = session?.user?.role === "applicant";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/jobs"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {job.company.name}
                </p>
              </div>
              {isApplicant && (
                <Link
                  href={`/jobs/${job.id}/apply`}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
                >
                  Apply Now
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mb-8 text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                {job.type}
              </div>
              {job.salary && (
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  {job.salary}
                </div>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">About the Role</h2>
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 mb-8">
                {job.description}
              </p>

              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 mb-8">
                {job.requirements}
              </p>

              {job.company.description && (
                <>
                  <h2 className="text-2xl font-bold mb-4">About {job.company.name}</h2>
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {job.company.description}
                  </p>
                </>
              )}
            </div>

            {isApplicant && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={`/jobs/${job.id}/apply`}
                  className="w-full sm:w-auto inline-block text-center bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium"
                >
                  Apply for this Position
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
