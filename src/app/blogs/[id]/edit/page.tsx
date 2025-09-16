import BlogMetadataForm from "@/components/blog/blogMetaDataForm";
import { getBlogById } from "@/lib/queries";
export default async function BlogMetaData({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string>>;
}) {
  const blogId = await params.then((p) => p.id);
  const blog = await getBlogById(blogId);
  const awaitedSearchParams = await searchParams;

  return <BlogMetadataForm searchParams={awaitedSearchParams} blog={blog ?? undefined} />;
}
