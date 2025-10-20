import Link from "next/link";
import { Briefcase, Users, FileText } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to GoToJob</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Your platform for finding the perfect job or hiring the best talent
            </p>
            <div className="flex gap-4 justify-center">
              {session?.user ? (
                <>
                  <Link
                    href="/jobs"
                    className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium"
                  >
                    Browse Jobs
                  </Link>
                  {session.user.role === "employer" ? (
                    <Link
                      href="/dashboard"
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                    >
                      My Jobs
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard/applications"
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                    >
                      My Applications
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 font-medium"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/jobs"
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-8 py-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                  >
                    Browse Jobs
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse Jobs</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Explore thousands of job opportunities from top companies
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Applications</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Apply to jobs quickly with your resume and cover letter
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Employers</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Post jobs and find the perfect candidates for your team
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
