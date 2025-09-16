
import BlogMetadataForm from "@/components/blog/blogMetaDataForm";


export default async function BlogMetaData({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string>>;
}){
  const awaitedSearchParams =  await searchParams;
  return(
    <BlogMetadataForm searchParams={awaitedSearchParams}/>
  )
}