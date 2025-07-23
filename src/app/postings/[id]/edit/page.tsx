import { notFound } from 'next/navigation';
import { getUserProjectsList, getPostingById } from '@/lib/queries';
import PostingFormPage from '@/components/postings/posting_form';

export default async function EditPostingPage({ params }: { params: { id: string } }) {
  const [posting, projects] = await Promise.all([
    getPostingById(params.id),
    getUserProjectsList(),
  ]);

  if (!posting) notFound();

  return (
    <PostingFormPage
      initialData={posting}
      errors={{}}
      projects={projects}
    />
  );
}
