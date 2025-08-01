"use server";

import { blogMetadataSchema } from "@/lib/validations/blog";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

export default async function createBlog(formData: FormData) {
  const raw = {
    title: formData.get("title"),
    category: formData.get("category"),
    tags: formData.get("tags")?.toString() || "",
    summary: formData.get("summary"),
  };

  const parsed = blogMetadataSchema.safeParse(raw);
  const formDataParams = encodeURIComponent(
    JSON.stringify(raw)
  );

  if (!parsed.success) {
  const errorParams = encodeURIComponent(
    JSON.stringify(parsed.error.flatten().fieldErrors)
  );

  return redirect(`/blogs/new?errors=${errorParams}&formData=${formDataParams}`);
}


  const blogId = uuidv4();
  const slug = parsed.data.title.toLowerCase().replace(/\s+/g, "-");

  const tagsArray = parsed.data.tags
    ? parsed.data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  

  const supabase = await createSupabaseServerClient();
  
  const { data:{ user}} = await supabase.auth.getUser();
  const userId = user?.id;
  const {  error } = await supabase.from("blogs").insert({
    id: blogId,
    user_id: userId,
    title: parsed.data.title,
    slug,
    category: parsed.data.category,
    tags: tagsArray,
    summary: parsed.data.summary,
    status: "draft",
  });
  console.log("Blog creation error:", error);

  if (error) {
    const errorParams = encodeURIComponent(
      JSON.stringify({ database: [error.message] })
    );
    return redirect(`/blogs/new?errors=${errorParams}&formData=${formDataParams}`);
  }

  redirect(`/blogs/${blogId}/edit`);
}
