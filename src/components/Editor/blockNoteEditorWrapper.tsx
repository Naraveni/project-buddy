'use client';

import React, { useState, useEffect } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import { MdEdit, MdVisibility } from 'react-icons/md';
import PreviewPane from './previewPane';
import { BlockNoteView } from '@blocknote/mantine';
import { imageHandler } from '@/lib/storage';



export default function BlockNoteEditorWrapperInner({
  handleArticleSubmit, id, intialContent = ''
}: {
  handleArticleSubmit: (data: { status: 'draft' | 'published'; html: string }) => void,
  id: string,
  intialContent?: string
}) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [htmlContent, setHtmlContent] = useState('');
  const uploadFile = async (file: File) => {
    return await imageHandler(id, file);
  };

  

  const editor = useCreateBlockNote({uploadFile: uploadFile});
  useEffect(() => {
    async function loadInitialHTML() {
      if(!intialContent) return;
      if (!editor) return;
      const blocks = await editor.tryParseHTMLToBlocks(intialContent);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [editor, intialContent]);

  useEffect(() => {
    if (mode === 'preview') {
      const fetchHtml = async () => {
        const blocks = await editor.document;
        const html = await editor.blocksToFullHTML(blocks);
        setHtmlContent(html);
      };
      fetchHtml();
    }
  }, [mode, editor]);

  const handleSubmit = async (status: 'draft' | 'published') => {
    const blocks = await editor.document;
    const html = await editor.blocksToFullHTML(blocks);
    handleArticleSubmit({ status, html });
  };

  return (
    <div className="max-w-6xl mx-auto pt-3 space-y-4 h-[88vh] flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button onClick={() => setMode('edit')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
            mode === 'edit' ? 'bg-gray-100 text-gray-900 border-gray-600 shadow' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
          }`}>
            <MdEdit className="text-lg" />
            Edit
          </button>
          <button onClick={() => setMode('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border-2 transition-all ${
            mode === 'preview' ? 'bg-gray-100 text-gray-900 border-gray-600 shadow' : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
          }`}>
            <MdVisibility className="text-lg" />
            Preview
          </button>
        </div>

        <div className="flex space-x-3">
          <button onClick={() => handleSubmit('draft')} className="px-4 py-2 rounded-md text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 transition">Save Draft</button>
          <button onClick={() => handleSubmit('published')} className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition">Publish</button>
        </div>
      </div>

      <div className={`flex-1 ${mode === 'edit' ? 'border-[3px] border-gray-400 rounded-xl shadow-xl' : ''}`} style={{ minHeight: 0 }}>
        {mode === 'edit' ? (
          <div className="h-full  rounded-xl p-2">
            <BlockNoteView editor={editor} style={{ height: '100%', overflowY: 'auto' }} />
          </div>
        ) : (
          <PreviewPane html={htmlContent} />
        )}
      </div>
    </div>
  );
}
