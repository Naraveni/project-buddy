import { getUserProjectsList } from '@/lib/queries';
import PostingFormPage from '@/components/postings/posting_form';


export default async function PostingPageWrapper() {
  const projects = await getUserProjectsList();

  return <PostingFormPage projects={projects} />;
}