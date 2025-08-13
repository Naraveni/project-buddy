"use server";

import { blogMetadataSchema } from "@/lib/validations/blog";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

type TagInput = { id: string | null; name: string };

const redirectToBlogForm = (id: string | null, draftId: string) => {
  if (id) {
    return redirect(`/blogs/${id}/edit?draftId=${draftId}&dialogOpen=true`);
  } else {
    return redirect(`/blogs/new?draftId=${draftId}`);
  }
};

export default async function upsertBlog(formData: FormData) {
  const raw = {
    title: formData.get("title")?.toString()?.trim(),
    category: formData.get("category")?.toString()?.trim(),
    tags: formData.getAll("tags") as string[] | undefined,
    summary: formData.get("summary")?.toString()?.trim(),
  };

  const upsertBlogId = formData.get("id")?.toString() || null;
  const draftId = uuidv4();

  const formattedTags: TagInput[] = raw.tags
    ? raw.tags.map((tagStr) => {
        const parsed = JSON.parse(tagStr);
        const normalizedName = parsed.name?.toLowerCase().replace(/\s+/g, "_");
        return { id: parsed.id, name: normalizedName };
      })
    : [];

  const parsed = blogMetadataSchema.safeParse({
    ...raw,
    tags: formattedTags,
  });

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  console.log("USER ID:", userId);
  console.log("RAW FORM DATA:", raw);
  console.log("PARSED FORM DATA:", parsed);

  if (!parsed.success) {
    const zodErrors = parsed.error.flatten().fieldErrors;
    console.log("ZOD VALIDATION ERRORS:", zodErrors);

    await supabase.from("form_drafts").insert({
      id: draftId,
      user_id: userId,
      form_type: "blog",
      data: raw,
      errors: zodErrors,
    });

    return redirectToBlogForm(upsertBlogId, draftId);
  }

  const blogId = upsertBlogId || uuidv4();
  const slug = parsed.data.title.toLowerCase().replace(/\s+/g, "-");

  for (let i = 0; i < formattedTags.length; i++) {
    const tag = formattedTags[i];

    if (!tag.id) {
      const { data: existingTag, error: _existingTagError } = await supabase
        .from("tags")
        .select("id")
        .eq("name", tag.name)
        .single(); 
      if (existingTag) {
        formattedTags[i].id = existingTag.id;
        continue;
      }

      // If not found, insert
      const { data: insertedTag, error: tagError } = await supabase
        .from("tags")
        .insert({ name: tag.name })
        .select("id")
        .single();
      
      if (tagError || !insertedTag) {
        console.error("TAG INSERT ERROR:", tagError);

        await supabase.from("form_drafts").insert({
          id: draftId,
          user_id: userId,
          form_type: "blog",
          data: raw,
          errors: { database: [tagError.message] },
        });

        return redirectToBlogForm(upsertBlogId, draftId);
      }

      formattedTags[i].id = insertedTag.id;
    }
  }

  console.log("FINAL TAGS WITH IDs:", formattedTags);

  const { error: blogError } = await supabase
    .from("blogs")
    .upsert(
      {
        id: blogId,
        user_id: userId,
        title: parsed.data.title,
        slug,
        category: parsed.data.category,
        summary: parsed.data.summary,
        status: "draft",
      },
      { onConflict: "id" }
    );

  if (blogError) {
    console.error("BLOG UPSERT ERROR:", blogError);

    await supabase.from("form_drafts").insert({
      id: draftId,
      user_id: userId,
      form_type: "blog",
      data: raw,
      errors: { database: [blogError.message] },
    });

    return redirectToBlogForm(upsertBlogId, draftId);
  }

  const blogTagsRows = formattedTags.map((tag) => ({
    blog_id: blogId,
    tag_id: tag.id,
  }));

  const { error: blogTagsError } = await supabase
    .from("blog_tags")
    .upsert(blogTagsRows, {
      onConflict: "blog_id,tag_id",
    });

  if (blogTagsError) {
    console.error("BLOG_TAGS UPSERT ERROR:", blogTagsError, blogTagsRows);

    await supabase.from("form_drafts").insert({
      id: draftId,
      user_id: userId,
      form_type: "blog",
      data: raw,
      errors: { database: [blogTagsError.message] },
    });

    return redirectToBlogForm(upsertBlogId, draftId);
  }

  return redirect(`/blogs/${blogId}/editContent`);
}
