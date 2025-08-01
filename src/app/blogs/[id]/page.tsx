'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BlockNoteEditor from '@/components/Editor/blackNoteEditor';
import { getBlogById } from '@/lib/queries';
import { Blog } from '@/lib/types';

export default function Page() {
  const { id  } = useParams();
  const blogId = id as string;
  const [blog, setBlog] = useState<Blog | null>(null);

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
   console.log('Editor content:', html, status);
  };

  return (
    <div className='max-w-8xl  pt-3 space-y-4 gap-2 flex'>
    <div className='w-1/4 break-words col pt-2 border border-gray-300 rounded-lg pl-5'>
      <h1 className='text-2xl font-bold'>{blog?.title}</h1>
      <p>{blog?.summary}</p>

    </div>
    <div  className='w-3/4'>
      <BlockNoteEditor handleArticleSubmit={handleArticleSubmit} id={blogId} intialContent={content}  />
    </div>
    </div>
  );
}
