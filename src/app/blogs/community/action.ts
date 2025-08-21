'use server';
import formatBlogFilters from '@/components/blog/blogFilterFormat';
import { redirect } from 'next/navigation';

export default async function fetchBlogs(formData: FormData): Promise<void> {
  const params = formatBlogFilters(formData);

  redirect(`/blogs/community/?${params.toString()}`);
}
