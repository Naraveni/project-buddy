import dynamic from 'next/dynamic';

const BlockNoteEditor = dynamic(() => import('./blockNoteEditorWrapper'), {
  ssr: false,
});

export default BlockNoteEditor;
