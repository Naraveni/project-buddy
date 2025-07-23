import { createSupabaseServerClient } from "@/utils/supabase/server-client";


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
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('postings')
    .select('*, skills(id, name)')
    .eq('id', id)
    .eq('user_id', user?.id)
    .single();

  if (error) return null;
  return data;
}

export async function getSignedImageUrl(path: string): Promise<string | null> {
  if (!path) return null;

  const supabase = await createSupabaseServerClient();

  const bucketName = process.env.BUCKET_NAME;
  if (!bucketName) {
    console.error('BUCKET_NAME environment variable is not set.');
    return null;
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(path, 3600);

  if (error || !data) {
    console.error('Signed URL error:', error?.message);
    return null;
  }

  return data.signedUrl;
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
