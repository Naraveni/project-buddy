import { getProjects } from '@/app/projects/me/action';
import ProjectsIndexPage from '@/components/projects/projectIndex';
export default async function CommunityProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; name?: string }>;
}) {
  const searchParamsResolved = await searchParams;
  const page = Math.max(1, parseInt(searchParamsResolved.page ?? '1', 10));
  const perPage = 10;
  const searchName = searchParamsResolved.name ?? '';

  const { projects, errors, count } = await getProjects(page, perPage, searchName, true);

  return (
    <ProjectsIndexPage searchParams={searchParamsResolved} projects={projects} errors={errors} count={count} title={'Community Projects'} isPersonal={false} />
  );
}