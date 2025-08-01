"use server";

import { blogMetadataSchema } from "@/lib/validations/blog";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

//TODO ActionDialog and action in this folder should be havinf a common form component

export default async function updateBlogMetaData(formData: FormData) {
  const id = formData.get("id")?.toString();
  
  if (!id) {
    return redirect(`/blogs/${id}?errors=${encodeURIComponent(JSON.stringify({ id: ["Missing blog ID"] }))}&dialogOpen=true`);
  }
  

  const raw = {
    title: formData.get("title"),
    category: formData.get("category"),
    tags: formData.get("tags")?.toString() || "",
    summary: formData.get("summary"),
  };
  

  const parsed = blogMetadataSchema.safeParse(raw);
  const formDataParams = encodeURIComponent(JSON.stringify({ ...raw, id }));

  if (!parsed.success) {
    const errorParams = encodeURIComponent(
      JSON.stringify(parsed.error.flatten().fieldErrors)
    );
    return redirect(`/blogs/${id}?dialogErrors=${errorParams}&formData=${formDataParams}&dialogOpen=true`);
  }

  const tagsArray = parsed.data.tags
    ? parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const slug = parsed.data.title.toLowerCase().replace(/\s+/g, "-");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;
  const { data, error } = await supabase.from("blogs").update({
    title: parsed.data.title,
    slug,
    category: parsed.data.category,
    tags: tagsArray,
    summary: parsed.data.summary,
  }).eq("id", id).eq("user_id", userId);
console.log("Blog update error:", data, error, id, userId);

  if (error) {
    const errorParams = encodeURIComponent(
      JSON.stringify({ database: [error.message] })
    );
    return redirect(`/blogs/${id}?dialogErrors=${errorParams}&formData=${formDataParams}&dialogOpen=true`);
  }

  redirect(`/blogs/${id}`);
}
