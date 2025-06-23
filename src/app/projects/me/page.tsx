/* pages/projects/me/page.tsx */
import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getUserProjects } from '@/app/projects/me/action';
import { redirect } from 'next/navigation';
import { LOGO_NAME } from '@/utils/constants';


export const dynamic = 'force-dynamic';


export default async function MyProjectsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?flash=Please%20log%20in%20to%20view%20your%20projects');

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const perPage = 10;
  const { projects, errors, count } = await getUserProjects(page, perPage);
  const totalPages = Math.ceil(count / perPage);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-black">My Projects</h1>

      {errors && (
        <div className="bg-red-100 border-red-400 text-red-800 px-4 py-3 rounded">
          <ul>
            {Object.values(errors).flat().map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {!errors && projects.length === 0 && (
        <p className="text-gray-400">You haven’t added any projects yet.</p>
      )}

      <div className="space-y-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={
              `flex flex-col sm:flex-row gap-4 shadow-sm hover:shadow-2xl overflow-hidden p-4 rounded-md transition ` +
              (project.status === 'archived'
                ? 'bg-neutral-100'
                : project.status === 'draft'
                ? 'bg-yellow-100'
                : 'bg-white')
            }
          >
            {/* Image */}
            <div className="flex-none w-full sm:w-48 h-48 rounded-md overflow-hidden">
              <Image
                src={LOGO_NAME}
                alt={project.name}
                width={192}
                height={192}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Content: name, description, skills each no-grow no-shrink */}
            <CardContent className="flex-1 p-0 flex flex-col min-w-0">
              {/* Title */}
              <div className="flex-none">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-xl font-semibold hover:underline block"
                >
                  {project.name}
                </Link>
              </div>

              {/* Description: clamp to 3 lines */}
              <div className="flex-none mt-2">
                <p className="block w-full text-gray-700 text-sm break-words overflow-hidden line-clamp-3">
                  {project.description}
                </p>
              </div>

              {/* Skills */}
              <div className="flex-none mt-4">
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      className="text-xs px-2 py-1 rounded-full bg-opacity-90 flex-none"
                      style={{ backgroundColor: stringToColor(skill.name) }}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center pt-6">
        {page > 1 ? (
          <Link
            href={`?page=${page - 1}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </Link>
        ) : (
          <span className="px-4 py-2 text-gray-400">Previous</span>
        )}

        <span className="text-gray-700">
          Page {page} of {totalPages || 1}
        </span>

        {page < totalPages ? (
          <Link
            href={`?page=${page + 1}`}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </Link>
        ) : (
          <span className="px-4 py-2 text-gray-400">Next</span>
        )}
      </div>
    </main>
  );
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 4) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 40%)`;
}
