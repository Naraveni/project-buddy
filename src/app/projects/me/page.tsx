import { getProjects } from '@/app/projects/me/action';
import ProjectsIndexPage from '@/components/projects/projectIndex';
export default async function MyProjectsPage({
  searchParams,
}: {
  searchParams: { page?: string; name?: string };
}) {

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const perPage = 10;
  const params = await searchParams;
  const searchName = params.name ?? '';

  const { projects, errors, count } = await getProjects(page, perPage, searchName);

  return (
    <ProjectsIndexPage searchParams={searchParams} projects={projects} errors={errors} count={count} />
  );
}