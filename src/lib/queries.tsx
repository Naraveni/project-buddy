'use server';
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

import { Blog, ChatMessage } from "./types";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";

import { ReactionRow } from "./types";
import { redirect } from "next/navigation";
import { Database } from "./database.types";
type Tag = Pick<
  Database['public']['Tables']['tags']['Row'],
  'id' | 'name'
>;

export async function getProjectById(id: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("projects")
    .select("*, skills(id, name)")
    .eq("id", id)
    .eq("user_id", user?.id)
    .single();

  if (error) return null;
  return data;
}

export async function getPostingById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("postings")
    .select("*, skills(id, name)")
    .eq("id", id)
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

export async function getUserById(
  userId: string
): Promise<{ id: string; username: string } | null> {
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

export async function getBlogById(
  id: string,
  type: string = "server"
): Promise<Blog | null> {
  const supabase =
    type === "server"
      ? await createSupabaseServerClient()
      : await createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*, profiles(id, username), tags(id, name)")
    .eq("id", id)
    .single();

  const { data: _data, error: _error } = await supabase
    .from("blog_tags")
    .select("*")
    .eq("blog_id", id);

  if (error || !data) return null;
  return data;
}

export async function getBlogs({
  isPersonal,
  status = null,
  category = null,
  title = null,
  page = 1,
  perPage = 20,
  tags = [],
}: {
  isPersonal: boolean;
  status?: string | null;
  category?: string | null;
  title?: string | null;
  page?: number;
  perPage?: number;
  tags?: string[];
}) {
  const supabase = await createSupabaseServerClient();

  const userRes = await supabase.auth.getUser();
  const userId = userRes.data.user?.id ?? null;

  const tagIds = tags.length > 0 ? tags : null;

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error } = await supabase
    .rpc("get_blogs_filtered", {
      p_user_id: userId,
      p_is_personal: isPersonal,
      p_status: status || null,
      p_category: category || null,
      p_title: title || null,
      p_tag_ids: tagIds,
    })
    .range(from, to);
  

  if (error) {
    return { success: false, error };
  }
  const count = data && data.length ?  data[0].total_count : 0;

  return { success: true, data, count: count };
}

export async function getTagsByIds(ids: string[]): Promise<Tag[]>{
  const supabase = await createSupabaseBrowserClient();
  const { data } = await supabase.from('tags').select('id, name').in("id", ids);
  if(data){
    return data;
  }
  return []
}


export async function getTags(
  search: string
): Promise<Tag[]> {
  const supabase = await createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id, name")
    .filter("name", "ilike", `%${search}%`)
    .limit(10);
  console.log("Fetched tags:", data, error);
  if (error) {
    return [];
  }
  return data;
}

export async function setBlogReaction(
  response: string[],
  blog_id: string
): Promise<void> {
  const supabase = await createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("reactions")
    .select("id")
    .eq("user_id", user?.id)
    .eq("blog_id", blog_id);
  if (data && data.length && data[0].id) {
    const { error } = await supabase
      .from("reactions")
      .update({ response: response })
      .eq("id", data[0]?.id);
    if (error) {
      const message = encodeURIComponent(
        "Failed to save reactions please try again"
      );
      redirect(`${blog_id}?error=${message}`);
    }
    redirect(`${blog_id}`);
  } else {
    const payload = {
      response: response,
      blog_id: blog_id,
      user_id: user?.id,
    };
    const { error } = await supabase.from("reactions").insert(payload);
    if (error) {
      const message = encodeURIComponent(
        "Failed to save reactions please try again"
      );
      redirect(`${blog_id}?error=${message}`);
    }
    redirect(`${blog_id}`);
  }
}

export async function getCurUserReactions(
  blog_id: string
): Promise<ReactionRow["response"]> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("reactions")
    .select("response")
    .eq("user_id", user?.id)
    .eq("blog_id", blog_id)
    .limit(1);
  if (error) {
    return [];
  }
  if (data && data.length && data[0].response) {
    return data[0].response;
  }
}

export async function getReactions(blog_id: string): Promise<JSON> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_reaction_counts", {
    blog_id_param: blog_id,
  });
  if (error) {
    return JSON.parse("");
  }
  return data;
}




export async function getMessagesOnScroll({
  chatId,
  oldestMessageCreatedAt,
  limit = 25,
}: {
  chatId: string;
  oldestMessageCreatedAt?: string; // ISO timestamp of oldest loaded message
  limit?: number;
}):Promise<ChatMessage[] > {
  if (!chatId) return [];
  const supabase = await createSupabaseBrowserClient()

  let query =  supabase
    .from('messages')
    .select('id, text, sender_id, chat_id, created_at')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (oldestMessageCreatedAt) {
    query = query.lt('created_at', oldestMessageCreatedAt);
  }

  const { data, error } = await query;

  if (error) return [];

  return data;
}
