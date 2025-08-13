import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { Blog } from "./types";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { PostgrestError } from "@supabase/supabase-js";
import { ReactionRow } from "./types";
import { redirect } from "next/navigation";






export async function getProjectById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('projects')
    .select('*, skills(id, name)')
    .eq('id', id)
    .eq('user_id', user?.id)
    .single();

  if (error) return null;
  return data;
}

export async function getPostingById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('postings')
    .select('*, skills(id, name)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}





export async function getUserProjectsList(): Promise<
  { id: string; name: string }[]
> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data;



}

export async function getUserById(userId: string): Promise<{ id: string; username: string } | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return { id: data.id, username: data.username };
}

export async function getUser(): Promise<{ id: string; name: string } | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("id", user.id)
    .single();

  if (error || !profile) return null;

  return { id: user.id, name: `${profile.first_name} ${profile.last_name}` };
}

export async function getBlogById(id: string, type: string = 'server'): Promise<Blog | null>{
  
  const supabase =  type === 'server' ? await createSupabaseServerClient() : await createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from('blogs')
    .select('*, profiles(id, username), tags(id, name)')
    .eq('id', id)
    .single();

    const { data: _data, error: _error} = await supabase.from('blog_tags').select('*').eq('blog_id', id);


  if (error || !data) return null;
  return data;
}


export async function getBlogs({
  isPersonal,
  status,
  category,
  title,
  tags,
}: {
  isPersonal: boolean;
  status?: string;
  category?: string;
  title?: string;
  tags?: string[];
}): Promise<
  | { success: true; data: Blog[] }
  | { success: false; error: PostgrestError }
> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from('blogs').select('id, title,category, created_at, status, summary,tags(id,name), profiles(id, username)').limit(20);

  if (isPersonal) {
    const { data: { user } } = await supabase.auth.getUser();
    query = query.eq('user_id', user?.id);
    if (status) {
      query = query.eq('status', status);
    }
  } else {
    query = query.eq('status', 'published')
    if (tags && tags.length > 0) {
      const formattedTags = `{${tags.join(',')}}`;
      query = query.filter('tags', 'cs', formattedTags);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (title) {
      query = query.textSearch('title', title, {
        type: 'plain',
        config: 'english',
      });
    }
  }


  const { data, error } = await query;

  if (error) {
    return { success: false, error };
  }

  return { success: true, data };
}



export async function getTags(search: string): Promise<{id: string, name: string}[]> {
  const supabase = await createSupabaseBrowserClient();
  const { data, error } = await supabase.from('tags').select('id, name').filter('name', 'ilike', `%${search}%`).limit(10);
  console.log("Fetched tags:", data, error);
  if (error){
    return [];
  }
  return data 
}

export async function setBlogReaction(response: string[], blog_id: string):Promise<void>{
  const supabase = await createSupabaseBrowserClient();
  const { data : { user }} = await supabase.auth.getUser();
  const { data} = await supabase.from('reactions').select('id').eq('user_id', user?.id).eq('blog_id', blog_id)
  if(data && data.length && data[0].id){
     const { error } = await supabase.from('reactions').update({response: response}).eq('id', data[0]?.id)
     if(error){
      const message = encodeURIComponent('Failed to save reactions please try again')
      redirect(`${blog_id}?error=${message}`)
    }
    redirect(`${blog_id}`)
    
  }
  else{

    const payload = {
      response: response,
      blog_id: blog_id,
      user_id: user?.id

    }
    const { error } = await supabase.from('reactions').insert(payload)
    if(error){
      const message = encodeURIComponent('Failed to save reactions please try again')
      redirect(`${blog_id}?error=${message}`)
    }
    redirect(`${blog_id}`)
  }
   
}

export async function getCurUserReactions(blog_id: string):Promise<ReactionRow['response']>{
  const supabase = await createSupabaseServerClient();
  const { data: { user }} = await supabase.auth.getUser();
  const { data, error } = await supabase.from('reactions').select('response').eq('user_id', user?.id).eq('blog_id', blog_id).limit(1)
  if(error){
    return []
  }
  if(data && data.length && data[0].response){
    return data[0].response
  }
}



export async function getReactions(blog_id: string): Promise<JSON>{
  const supabase= await createSupabaseServerClient();
  const {data, error} = await supabase.rpc('get_reaction_counts', { blog_id_param: blog_id });
  if (error){
    return JSON.parse('')
  }
  return data ;
}