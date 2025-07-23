'use client';

import { useActionState } from 'react';
import { createChatForPosting } from '@/app/postings/postings/create-chat-action';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/button';

export default function ChatFormClient({ postingId }: { postingId: string }) {
  const [state, formAction] = useActionState(
    async (state, formData: FormData) => await createChatForPosting(formData),
    {
      success: false,
      errors: [],
      chatId: undefined,
      message: undefined,
    }
  );

  return (
    <form action={formAction}>
      
<div className='absolute top-4 right-4 flex gap-2 items-center'>
      {state?.errors && state.errors.length > 0 && (
        <div className="text-red-500">{state.errors.join(', ')}</div>
      )}
      {state.success && (
        <p className="text-green-600">{state.message}</p>
      )}
      <input type="hidden" name="postingId" value={postingId} />
       <Button
         className="  bg-white text-black border border-gray-200 hover:bg-white p-2 rounded-full hover:shadow-xl"
         title="Start Chat"
         type="submit"
       >
         <IoChatboxEllipsesOutline className="w-5 h-5" />
         Start Chat
       </Button>
       </div>
    </form>
  );
}
