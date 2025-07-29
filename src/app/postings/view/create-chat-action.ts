'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server-client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createChatForPosting(formData: FormData) {
  const postingId = formData.get('postingId') as string;
  if (!postingId) {
    return { success: false, errors: ['Posting ID is required'] };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, errors: ['Not authenticated'] };
  }

  
    // Step 1: Check if chat already exists
    const { data: existingChat, error: existingChatError } = await supabase
      .from('chats')
      .select('id')
      .eq('post_id', postingId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingChatError) {
      return { success: false, errors: [existingChatError.message] };
    }

    if (existingChat) {
      redirect(`/chats?chat_id=${existingChat.id}`);
    }

    // Step 2: Fetch posting info
    const { data: posting, error: postingError } = await supabase
      .from('postings')
      .select('id, role_name, user_id, status')
      .eq('id', postingId)
      .single();

    if (postingError || !posting) {
      return {
        success: false,
        errors: [postingError?.message || 'Posting not found'],
      };
    }

    // 🚫 Prevent chat creation if user is the owner of the posting
    if (posting.user_id === user.id) {
      return {
        success: false,
        errors: ['Cannot create chat for your own posting'],
      };
    }

    // 🚫 Prevent chat creation if posting status is not 'open'
    if (posting.status !== 'open') {
      return {
        success: false,
        errors: ['Cannot create chat for a closed or paused posting'],
      };
    }

    // Step 3: Create new chat
    const { data: newChat, error: insertError } = await supabase
      .from('chats')
      .insert({
        user_id: user.id,
        user_owner_id: posting.user_id,
        post_id: posting.id,
        name: posting.role_name,
      })
      .select()
      .single();

    console.log('New chat created:', insertError, newChat);

    if (insertError) {
      return { success: false, errors: [insertError.message] };
    }

    
    revalidatePath('/chat');
    redirect(`/chats?chat_id=${newChat.id}`);
  
}
