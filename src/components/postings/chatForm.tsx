'use client';

import { useActionState } from 'react';
import { createChatForPosting } from '@/app/postings/view/create-chat-action';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import { ChatState } from '@/lib/types';

export default function ChatFormClient({ postingId }: { postingId: string }) {
  const [state, formAction] = useActionState(
    async (state: ChatState, formData: FormData) => await createChatForPosting(formData),
    {
      success: false,
      errors: [],
    }
  );

  return (
    <form action={formAction}>
      
<div className=' top-4 right-4 flex gap-2 items-center'>
      {state?.errors && state.errors.length > 0 && (
        <div className="text-red-500">Something Went Wrong Please Try Again</div>
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
