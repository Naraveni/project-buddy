import { getBlogs } from '@/lib/queries';

import BlogsIndex from '@/components/blog/blogIndex';

export default async function CommunityBlogsPage({ searchParams }: { searchParams: Record<string, string | string[]> }) {
    const params = await searchParams;
  const response = await getBlogs({
    isPersonal: false,
    title: params?.title as string || '',
    category: params?.category as string || '',
    status: params?.status as string || '',
    tags: Array.isArray(params?.tags)
      ? params?.tags
      : params?.tags
      ? [params?.tags]
      : [],
  });

  if (!response.success) {
    console.error(response.error.message);
    return <div className="text-red-500 p-4">Failed to load blogs.</div>;
  }


  return (
    <BlogsIndex blogs={response?.data}/>
  );
}
