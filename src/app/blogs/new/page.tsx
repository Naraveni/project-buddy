
import BlogMetadataForm from "@/components/blog/blogMetaDataForm";


export default function BlogMetaData({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}){
  return(
    <BlogMetadataForm searchParams={searchParams}/>
  )
}