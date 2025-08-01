'use client';

import React from 'react';
import DOMPurify from 'dompurify';

export default function PreviewPane({ html }: { html: string }) {
  const cleanHtml = DOMPurify.sanitize(html);

  return (
    <div
      className="prose prose-lg max-w-full p-4 overflow-y-auto h-full border border-gray-200 rounded-xl shadow-inner bg-white"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
