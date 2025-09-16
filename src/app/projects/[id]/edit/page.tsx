import { notFound } from 'next/navigation';
import ProjectFormPage from '@/app/projects/new/page';
import { getProjectById } from '@/lib/queries';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  return <ProjectFormPage initialData={project} errors={{}} />;
}
