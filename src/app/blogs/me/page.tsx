import { getBlogs,getUser } from '@/lib/queries';

import BlogsIndex from '@/components/blog/blogIndex';
import { SearchParams } from 'next/dist/server/request/search-params';
import fetchBlogs from './action';

export default async function BlogsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const user = await getUser();
  const id = user?.id;
  let tagIds: string[] = [];

if (typeof params?.tags === "string" && params.tags.trim() !== "") {
  tagIds = params.tags.split(",");
}
  const pageParam = params.page;
  console.log(params.tags)
const page = Array.isArray(pageParam)
  ? parseInt(pageParam[0] ?? "1", 10)
  : parseInt(pageParam ?? "1", 10);
  const response = await getBlogs({
    isPersonal: true,
    page: page,
    title: params.title as string || '',
    category: params.category as string || '',
    status: params.status as string || '',
    tags: tagIds
  });

  if (!response.success) {
    console.error(response.error.message);
    return <div className="text-red-500 p-4">Failed to load blogs.</div>;
  }


  return (
    <BlogsIndex blogs={response?.data} id={id} searchParams={params} count={response?.count || 0} onSubmit={fetchBlogs}/> 
  );
}
