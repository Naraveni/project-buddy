import { Blog } from "@/lib/types";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { BlogFilters } from "./blogFilter";
import fetchBlogs from "@/app/blogs/me/action";
import { GrEdit } from "react-icons/gr";
import { Pagination, PaginationItem } from "../ui/pagination";
import { SearchParams } from "next/dist/server/request/search-params";
import { BlogPagination } from "./blogPagination";

type BlogListProps = {
  blogs: Blog[];
  id?: string;
  searchParams: SearchParams;
  count: number;
  perPage?: number;
};

export default function BlogsIndex({
  blogs,
  id,
  searchParams = {},
  count,
  perPage = 20,
}: BlogListProps) {
  const { page } = searchParams;
  const currentPage = Number(page) || 1;
  const totalPages = Math.ceil(count / perPage);

  return (
    <div className="max-w-5xl mx-auto pt-8">
      <h1 className="text-3xl font-bold mb-8">Latest Blogs</h1>

      <div className="flex flex-col gap-5">
        <div>
          <BlogFilters onSubmit={fetchBlogs} searchParams={searchParams} />
        </div>

        <div className="flex flex-col gap-y-5">
          {blogs.map((blog) => (
            <Card key={blog.id} className="h-full hover:shadow-xl transition">
              <CardHeader>
                <div className="flex items-baseline gap-2">
                  <Link href={`/blogs/${blog.id}`} className="block">
                    <CardTitle className="text-xl hover:underline">
                      {blog.title}
                    </CardTitle>
                  </Link>

                  {id && blog?.profiles?.id && blog?.profiles?.id === id && (
                    <Link href={`/blogs/${blog.id}/editContent`}>
                      <GrEdit />
                    </Link>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-black line-clamp-3 mb-4 break-words">
                  {blog.summary}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {blog.tags?.map((tag) => (
                    <Badge
                      key={JSON.stringify(tag.id)}
                      variant="outline"
                      className="text-xs"
                    >
                      {tag?.name}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  By {blog.profiles?.username || "Anonymous"} on{" "}
                  {format(new Date(blog.created_at), "MMM dd, yyyy")}
                </div>
              </CardContent>
            </Card>
          ))}
          
        </div>
      </div>
      {totalPages && (
            
            <BlogPagination totalPages={totalPages} currentPage={currentPage} searchParams={searchParams}/>
          )}
    </div>
  );
}
