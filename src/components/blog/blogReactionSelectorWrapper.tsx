
'use client';

import dynamic from 'next/dynamic';
import { BlogReactionsSelectorProps } from '@/lib/types';

const BlogReactionsSelector = dynamic(
  () => import('@/components/blog/blogReactionSelector'),
  { ssr: false }
);
export default function BlogReactionsSection( {blogId, initialSelected}: BlogReactionsSelectorProps ){
  return <BlogReactionsSelector blogId={blogId} initialSelected={initialSelected} />;
}
