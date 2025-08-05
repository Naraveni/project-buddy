'use server';
import { blogContentSchema } from "@/lib/validations/blog";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export default async function saveBlogContent(htmlContent: string,  status: string, id: string): Promise<void>{
    const raw = { content: htmlContent, status };
    const parsedData = blogContentSchema.safeParse(raw);
    if(!parsedData.success){
        const errors = encodeURIComponent(JSON.stringify(parsedData.error.flatten().fieldErrors))
        redirect(`/blogs/${id}?errors=${errors}`)
    }
    const supabase = await createSupabaseServerClient();
    const {data: { user }} = await supabase.auth.getUser();
    if(!user?.id){
        const loginError = encodeURIComponent(JSON.stringify('Session Expired, Please Login Again'))
        redirect(`/login?flash=${loginError}`)
    }

    const { error } = await supabase.from('blogs').update({
        content: parsedData.data.content,
        status: parsedData.data.status
    }).eq("id", id).eq("user_id", user?.id)
    if(error){
        const errors = encodeURIComponent(JSON.stringify(error.message))
        redirect(`/blogs/${id}?errors=${errors}`)
    }
    redirect('/blogs/me');
}