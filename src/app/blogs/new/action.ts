"use server";

import { blogMetadataSchema } from "@/lib/validations/blog";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

type TagInput = { id: string | null; name: string };

export default async function createBlog(formData: FormData) {
  const raw = {
    title: formData.get("title")?.toString()?.trim(),
    category: formData.get("category")?.toString()?.trim(),
    tags: formData.getAll("tags") as string[] | undefined,
    summary: formData.get("summary")?.toString()?.trim(),
  };
  console.log(raw,"Raw")


  const formattedTags: TagInput[] = raw.tags
    ? raw.tags.map((tagStr) => JSON.parse(tagStr))
    : [];
    console.log("formatted Tags", formattedTags)

  const parsed = blogMetadataSchema.safeParse({
    ...raw,
    tags: formattedTags,
  });

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const draftId = uuidv4();

  if (!parsed.success) {
    const zodErrors = parsed.error.flatten().fieldErrors;
    console.log("❌ Zod validation failed:", zodErrors);

    await supabase.from("form_drafts").insert({
      id: draftId,
      user_id: userId,
      form_type: "blog",
      data: raw,
      errors: zodErrors,
    });

    console.log("↪️ Redirecting due to Zod validation failure");
    return redirect(`/blogs/new?draftId=${draftId}`);
  }

  const blogId = uuidv4();
  const slug = parsed.data.title.toLowerCase().replace(/\s+/g, "-");

  for (let i = 0; i < formattedTags.length; i++) {
    if (!formattedTags[i].id) {
      const { data: insertedTag, error: tagError } = await supabase
        .from("tags")
        .insert({ name: formattedTags[i].name })
        .select("id")
        .single();

      if (tagError) {
        console.log(`❌ Tag insert error (tag: ${formattedTags[i].name}):`, tagError.message);

        await supabase.from("form_drafts").insert({
          id: draftId,
          user_id: userId,
          form_type: "blog",
          data: raw,
          errors: { database: [tagError.message] },
        });

        console.log("↪️ Redirecting due to tag insert failure");
        return redirect(`/blogs/new?draftId=${draftId}`);
      }

      formattedTags[i].id = insertedTag.id;
    }
  }

  const { error: blogError } = await supabase.from("blogs").insert({
    id: blogId,
    user_id: userId,
    title: parsed.data.title,
    slug,
    category: parsed.data.category,
    summary: parsed.data.summary,
    status: "draft",
  });

  if (blogError) {
    console.log("❌ Blog insert error:", blogError.message);

    await supabase.from("form_drafts").insert({
      id: draftId,
      user_id: userId,
      form_type: "blog",
      data: raw,
      errors: { database: [blogError.message] },
    });

    console.log("↪️ Redirecting due to blog insert failure");
    return redirect(`/blogs/new?draftId=${draftId}`);
  }

  const blogTagsRows = formattedTags.map((tag) => ({
    blog_id: blogId,
    tag_id: tag.id,
  }));

  const { error: blogTagsError } = await supabase.from("blog_tags").insert(blogTagsRows);

  if (blogTagsError) {
    console.log("❌ Blog tag relation insert error:", blogTagsError.message);

    await supabase.from("form_drafts").insert({
      id: draftId,
      user_id: userId,
      form_type: "blog",
      data: raw,
      errors: { database: [blogTagsError.message] },
    });

    console.log("↪️ Redirecting due to blog tag relation insert failure");
    return redirect(`/blogs/new?draftId=${draftId}`);
  }

  console.log("✅ Blog creation successful. Redirecting to edit page");
  redirect(`/blogs/${blogId}`);
}
