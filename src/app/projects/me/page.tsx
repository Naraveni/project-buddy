import { getProjects } from '@/app/projects/me/action';
import ProjectsIndexPage from '@/components/projects/projectIndex';
export default async function MyProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; name?: string }>;
}) {
const searchParamsResolved = await searchParams;
  const page = Math.max(1, parseInt(searchParamsResolved.page ?? '1', 10));
  const perPage = 10;
  const params = await searchParams;
  const searchName = params.name ?? '';

  const { projects, errors, count } = await getProjects(page, perPage, searchName);

  return (
    <ProjectsIndexPage searchParams={searchParamsResolved} projects={projects} errors={errors} count={count} />
  );
}