import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center font-sans text-gray-800">
      <h1 className="text-2xl font-semibold mb-4">We are still working on the Dashboard</h1>
      <p className="mb-6">Please explore our sections below:</p>

      <div className="space-y-3 text-lg">
        <Link
          href="/postings/view?view_mode=community_postings"
          className="text-blue-600 hover:text-blue-800 underline transition-colors"
        >
          Postings
        </Link>
        <br/>
        <Link
          href="/projects/community"
          className="text-blue-600 hover:text-blue-800 underline transition-colors"
        >
          Projects
        </Link>
        <br/>

        <Link
          href="/blogs/community"
          className="text-blue-600 hover:text-blue-800 underline transition-colors"
        >
          Blogs
        </Link>
      </div>
    </div>
  );
}
