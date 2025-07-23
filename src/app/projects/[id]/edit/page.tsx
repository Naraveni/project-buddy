import { notFound } from 'next/navigation';
import ProjectFormPage from '@/app/projects/new/page';
import { getProjectById } from '@/lib/queries';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);

  if (!project) notFound();

  return <ProjectFormPage initialData={project} errors={{}} />;
}
