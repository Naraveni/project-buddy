import { Project } from "@/lib/types";
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LOGO_NAME, EDIT_ICON } from '@/utils/constants';
import { FaGithub } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { formatSlugToTitle } from '@/lib/utils';
import { GrView } from "react-icons/gr";

export default function ProjectsIndexPage({
  searchParams, projects, errors, count, title = 'My Projects', isPersonal = true
}: {
  searchParams: { page?: string; name?: string };
  projects: Project[],
  errors:  Record<string, string[]> | undefined;
  count: number,
  title?: string
  isPersonal?: boolean
}) {

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const perPage = 10;
  const searchName = searchParams.name ?? '';
  const totalPages = Math.ceil(count / perPage);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6 mt-8">
      <h1 className="text-3xl font-bold mb-2 text-black ">{title}</h1>

      {/* 🔍 Search by name */}
      <form method="get" className="mb-6">
        <input
          type="text"
          name="name"
          defaultValue={searchName}
          placeholder="Search by project name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </form>

      {/* 🔥 Error */}
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
  isPersonal ? (
    <p className="text-gray-400">You haven’t added any projects yet.</p>
  ) : (
    <p className="text-gray-400">No community projects found.</p>
  )
)}

      {/* ✅ Project Cards */}
      <div className="space-y-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={
              `flex flex-col sm:flex-row gap-4 shadow-sm hover:shadow-2xl overflow-hidden p-4 rounded-2xl transition backdrop-blur-sm ` +
              (project.status === 'archived'
                ? 'bg-neutral-100'
                : project.status === 'draft'
                ? 'bg-yellow-100'
                : 'bg-white')
            }
          >
            {/* Image and links */}
            <div className="flex-none w-full sm:w-48 flex flex-col items-center">
              <div className="h-48 w-full rounded-md overflow-hidden">
                <Image
                  src={project.display_image_url || LOGO_NAME}
                  alt={project.name}
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex gap-3 mt-2 text-gray-600">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black"
                    title="View on GitHub"
                  >
                    <FaGithub size={20} />
                  </a>
                )}
                {project.website_url && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black"
                    title="Visit Website"
                  >
                    <FiLink size={20} />
                  </a>
                )}
              </div>
            </div>

            <CardContent className="flex-1 p-0 flex flex-col min-w-0">
              <div>
                { !isPersonal ? 
                <div className="flex flex-row gap-2 ">
                <span className="font-2xl font-semibold">{project.name}</span>

                <div className="ml-auto">
                  <Link href={`${project.id}`} className="flex items-center gap-1 text-blue-600 ">
                  <span>View</span>
                  < GrView/>
                  </Link>
                </div>
                </div> :
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="text-xl font-semibold hover:underline block"
                >
                  {project.name}
                  <Image
                    src={EDIT_ICON}
                    alt="Edit project"
                    width={16}
                    height={16}
                    className="inline-block ml-2 align-text-bottom"
                  />
                </Link>
}
              </div>

              {/* Description */}
              <p className="mt-2 text-gray-700 text-sm line-clamp-3">
                {project.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {project.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    className="text-xs px-2 py-1 rounded-full bg-opacity-90"
                    style={{ backgroundColor: stringToColor(skill.name) }}
                  >
                    {formatSlugToTitle(skill.name)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-6">
        {page > 1 ? (
          <Link
            href={`?page=${page - 1}&name=${encodeURIComponent(searchName)}`}
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
            href={`?page=${page + 1}&name=${encodeURIComponent(searchName)}`}
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