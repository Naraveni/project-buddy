import { redirect } from 'next/navigation';
import { getUserProjectsList, getPostingById } from '@/lib/queries';
import PostingFormPage from '@/components/postings/posting_form';

export default async function EditPostingPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [posting, projects] = await Promise.all([
    getPostingById(id),
    getUserProjectsList(),
  ]);

  if (!posting) {
    const errorMsg = encodeURIComponent(
      JSON.stringify(['This action is not permitted for this posting'])
    );
    redirect(`/postings/view?view_mode=community_postings&errors=${errorMsg}`);

  }

  return (
    <PostingFormPage
      initialData={posting}
      errors={{}}
      projects={projects}
    />
  );
}
