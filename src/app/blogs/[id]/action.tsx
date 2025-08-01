import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { redirect } from 'next/navigation';

export async function saveBlogContent(blogId: string, content: string): Promise<string>{
    const supabase = await createSupabaseServerClient();
    const {data: {user}} = await supabase.auth.getUser();
    if(!user) redirect('/login?flash=' + encodeURIComponent('Session expired, please sign in again'));

    const { error } = await supabase.from('blogs')
    .upsert({content: content})
    .eq('id',blogId)
    .eq('user_id', user.id);

    if (error) {
        return `Error saving blog content: ${error.message}`;
    }
    redirect('/blogs/me');;
    return ''

}