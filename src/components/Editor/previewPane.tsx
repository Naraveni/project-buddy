'use client';

import React from 'react';
import DOMPurify from 'dompurify';
import { Blog } from '@/lib/types';
import { FaUserCircle } from "react-icons/fa";

function stringToColor(str: string): string {
  // simple hash to color function, returns a pastel color
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

export default function PreviewPane({ html, blog }: { html: string, blog?: Blog }): React.JSX.Element {
  const cleanHtml = DOMPurify.sanitize(html);
  console.log("blog data:", blog);

  if (!blog) {
    return <div>No blog data available</div>;
  }

  const createdDate = new Date(blog.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-3xl mx-auto bg-white rounded-xl p-8 shadow-md prose prose-lg">
      {/* Title */}
      <h1 className="font-extrabold mb-4">{blog.title}</h1>

      {/* Summary */}
      <p className="text-gray-600 mb-6">{blog.summary}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(blog.tags || []).map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: stringToColor(tag) }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* User info and category */}
      <div className="flex items-center gap-4 text-gray-500 mb-8">
        <FaUserCircle size={24} />
        <span className="font-medium">{blog.profiles?.username || "Unknown Author"}</span>
        <span className="text-sm px-2 py-0.5 bg-gray-200 rounded">{blog.category}</span>
        <span className="text-sm italic">· {createdDate}</span>
      </div>

      {/* Content */}
      <section
        className="prose max-w-full"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </article>
  );
}
