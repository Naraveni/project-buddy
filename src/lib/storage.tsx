import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { v4 as uuidv4 } from "uuid";

export async function getSignedImageUrl(path: string): Promise<string | null> {
  if (!path) return null;

  const supabase = await createSupabaseServerClient();

  const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME;
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



export async function imageHandler(id: string, file: File): Promise<string> {
  const supabase = await createSupabaseBrowserClient();

  const bucketName = process.env.NEXT_PUBLIC_PUBLIC_BUCKET_NAME || '';
  if (!bucketName) throw new Error("Bucket name not defined");

  const fileExt = file.name.split(".").pop();
  const filePath = `blogs/${id}/${uuidv4()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

  const { data } = await supabase.storage.from(bucketName).getPublicUrl(filePath);

  if (!data?.publicUrl) throw new Error("Failed to retrieve public URL.");

  return data.publicUrl;
}