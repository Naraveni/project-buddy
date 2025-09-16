import { getBlogs } from '@/lib/queries';
import BlogsIndex from '@/components/blog/blogIndex';
import fetchBlogs from './action';

export default async function CommunityBlogsPage({ searchParams }: { searchParams: Promise<any> }) {
    const params = await searchParams;
      const pageParam = params.page;
    const page = Array.isArray(pageParam)
      ? parseInt(pageParam[0] ?? "1", 10)
      : parseInt(pageParam ?? "1", 10);
      const response = await getBlogs({
        isPersonal: false,
        page: page,
        title: params.title as string || '',
        category: params.category as string || '',
        status: params.status as string || '',
        tags: Array.isArray(params.tags)
          ? params.tags
          : params.tags
          ? [params.tags]
          : [],
      });

  if (!response.success) {
    console.error(response.error?.message);
    return <div className="text-red-500 p-4">Failed to load blogs.</div>;
  }


  return (
    <BlogsIndex blogs={response?.data} count={response?.count || 0} searchParams={params} onSubmit={fetchBlogs} showStatusField={false}/>
  );
}
