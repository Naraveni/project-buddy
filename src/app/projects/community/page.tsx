import { getProjects } from '@/app/projects/me/action';
import ProjectsIndexPage from '@/components/projects/projectIndex';
export default async function CommunityProjectPage({
  searchParams,
}: {
  searchParams: { page?: string; name?: string };
}) {

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10));
  const perPage = 10;
  const searchName = searchParams.name ?? '';

  const { projects, errors, count } = await getProjects(page, perPage, searchName, true);

  return (
    <ProjectsIndexPage searchParams={searchParams} projects={projects} errors={errors} count={count} title={'Community Projects'} />
  );
}