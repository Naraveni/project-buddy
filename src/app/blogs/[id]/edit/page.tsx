import BlogMetadataForm from "@/components/blog/blogMetaDataForm";
import { getBlogById } from "@/lib/queries";
export default async function BlogMetaData({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: Record<string, string>;
}): Promise<React.JSX.Element> {
  const blogId = (await params)?.id;
  const blog = await getBlogById(blogId);

  return <BlogMetadataForm searchParams={searchParams} blog={blog ?? undefined} />;
}
