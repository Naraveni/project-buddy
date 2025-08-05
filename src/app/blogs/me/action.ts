import { createSupabaseServerClient } from "@/utils/supabase/server-client"
import { getBlogs } from "@/lib/queries";

export default async function getPersonalBlogs(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const { data: {user}} = await  supabase.auth.getUser();
    if(!user?.id){
        const msg = JSON.stringify(encodeURIComponent('Session Expired Please Login Again..'))
        redirect(`/login?flash=${msg}`)
    }
    const category = formData.get('category')?.toString();
    const title = formData.get('title')?.toString();
    const status = formData.get('status')?.toString();
    const tagsRaw = formData.getAll('tags');
    const tags = tagsRaw
        .filter((tag): tag is string => typeof tag === 'string')
        .map(tag => tag);
    const isPersonal = formData.get('isPersonal') ? true : false
    
    const result = await getBlogs({isPersonal,status, category, title, tags})
    const { success, data, error } = result;
    if(success){
        return data;
    }
    if(error){
        const msg = JSON.stringify(encodeURIComponent(error.message))
        redirect(`/blogs?flash=${msg}`)
    }
}
