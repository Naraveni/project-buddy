import DOMPurify from 'isomorphic-dompurify';
import { getBlogById, getCurUserReactions, getReactions } from '@/lib/queries';
import { stringToColor } from '@/lib/utils';
import { iconMap, formatLabel } from '@/lib/blog_reactions';

import BlogReactionsSection from '@/components/blog/blogReactionSelectorWrapper';
interface ViewBlogProps {
  params: { id: string };
  searchParams: {
    error: string
  }
}

export default async function ViewBlog({ params, searchParams }: ViewBlogProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const blog = id && id?.length ? await getBlogById(id) : null;
  const reactions = await getReactions(id);
  const curUserReactions = await getCurUserReactions(id);

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-60px)] text-3xl font-bold text-gray-300">
        Blog not Found
      </div>
    );
  }

  const safeHTML = DOMPurify.sanitize(blog.content);

  return (
    <div className="w-3/4 mx-auto pt-8">
      <header className="mb-8 border-b border-gray-300 dark:border-gray-700 pb-6">
  <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
    {blog?.title}
  </h1>
  <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{blog?.summary}</p>
  <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
      people found this article helpful
    </span>
  <div className="flex flex-wrap gap-2 mb-4">
    {reactions &&
      Object.entries(reactions).map(([reaction, count]) => (
        <div
          key={reaction}
          className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200"
        >
          {formatLabel(reaction)}
          {iconMap[reaction]()}
          <span>{count}</span>
        </div>
      ))}
    
  </div>

  {/* Author / date / category */}
  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
    <span className="font-medium text-gray-800 dark:text-gray-200">{blog?.profiles?.username}</span>
    <span>•</span>
    <span>{new Date(blog?.created_at).toLocaleDateString()}</span>
    <span>•</span>
    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
      {blog?.category}
    </span>
  </div>

  {/* Tags */}
  <div className="flex flex-wrap gap-2">
    {blog?.tags?.map((tag) => (
      <span
        key={tag?.id}
        className="px-3 py-1 text-sm font-medium rounded-full"
        style={{
          backgroundColor: stringToColor(tag?.name),
          color: 'white',
        }}
      >
        {tag?.name}
      </span>
    ))}
  </div>
</header>

      {error && <p className="text-sm text-red-800"> {error}</p>}

      
      <article
        className="prose prose-lg dark:prose-invert max-w-none break-words"
        dangerouslySetInnerHTML={{ __html: safeHTML }}
      />
      <div className="py-3">
      <BlogReactionsSection blogId={id} initialSelected={curUserReactions}/>
      </div>
    </div>
  );
}
