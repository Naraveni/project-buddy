"use client";

import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Blog } from "@/lib/types";
import { FaUserSecret } from "react-icons/fa";
//TODO: UI
export default function BlogHeader({ blog }: { blog: Blog }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl break-words">
        {blog.title}
      </h1>

      <p className="mt-4 text-lg text-gray-700">
        {blog.summary}
      </p>

      <div className="mt-6 flex items-center gap-4">
        { blog.user?.image ? (
          <Image
            src={blog.user.image}
            alt={blog.user.username || "Author"}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <FaUserSecret className="w-12 h-12 text-gray-500" />
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">
            {blog.user?.username || "Unknown Author"}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(blog.created_at), "MMM dd, yyyy")}
          </p>
        </div>
        <div className="ml-auto flex gap-4 text-sm text-gray-600">
          <span>📂 {blog.category}</span>
          {blog.tags && (
            <span>🏷️ {blog.tags}</span>
          )}
        </div>
      </div>
    </div>
  );
}
