'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import BlockNoteEditor from '@/components/Editor/blackNoteEditor';
import { getBlogById } from '@/lib/queries';
import { Blog } from '@/lib/types';
import saveBlogContent from './action';


export default function Page() {
  const { id  } = useParams();
  const searchParams= useSearchParams();
  const rawErrors = searchParams.get('errors');
  const errors = rawErrors ? JSON.parse(decodeURIComponent(rawErrors)) : '';


  const blogId = id as string;
  const [blog, setBlog] = useState<Blog>();

  useEffect(()=>{
    const getBlog = async () => {
      if (!blogId) return;
      const blog = await getBlogById(blogId, 'client');
      if (blog) {
        setContent(blog.content);
        setBlog(blog);
      }
    }
    getBlog();

  },[blogId])
  const [content, setContent] = useState<string>('');

  const handleArticleSubmit = async ({status, html}: {status: string, html: string}) => {
   await saveBlogContent(html, status, blogId);
  };

  return (
    <div className='max-w-8xl  pt-3 space-y-4 '>
      {errors &&
      <p className = 'color-red text-sm'>{errors}</p> }
      {blog && (
        <BlockNoteEditor handleArticleSubmit={handleArticleSubmit} id={blogId} intialContent={content} blog={blog}  />
      )}
    </div>
  );
}
