
import { createSupabaseServerClient } from "@/utils/supabase/server-client";
import upsertBlog from "@/app/blogs/new/action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { TagsAutocomplete } from "@/components/blog/blogTagsField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Blog, blogFormData } from "@/lib/types";


const categoryOptions = [
  "frontend",
  "backend",
  "devops",
  "deployment",
  "design",
  "ai",
  "product",
  "collaboration",
  "career",
  "other",
];
type Errors = {
    title?: string;
    category?: string;
    summary?: string;
    tags?: string[];
    [key: string]: string | string[] | undefined;
  };



export default async function BlogMetadataForm({
  searchParams, blog
}: {
  searchParams?: Record<string, string>,
  blog?: Blog
}) {
  const params = await searchParams;
  let errors: Errors = {};
  let formData: blogFormData = {};

  const draftId =  params?.draftId;
  
  if (draftId) {
    const supabase = await createSupabaseServerClient();
    const { data: draft } = await supabase
      .from("form_drafts")
      .select("data, errors")
      .eq("id", draftId)
      .single();

    if (draft) {
      
      formData = {
        title: draft.data.title,
        category: draft.data.category,
        summary: draft.data.summary,
        tags: draft.data.tags.map((tag: string)=> JSON.parse(tag)),
        id: draft.data?.id || ''
      };
       errors = draft.errors;
    }
  }
  else if(blog){
    formData = {
      title: blog?.title || "",
      category: blog?.category || "",
      tags: blog?.tags || [],
      summary: blog?.summary || "",
      id: blog?.id || ""
    };
  }


  return (
    
    <form action={upsertBlog} className="max-w-2xl mx-auto p-6 space-y-6">
      
      <h1 className="text-2xl font-bold">📝 Create Blog Metadata</h1>
      {errors?.database && errors?.database?.length > 0 && (
  <p className="text-sm text-red-700">
    Something went wrong. Please try again.
  </p>
)}
      <input hidden name='id' defaultValue={formData?.id}>
      </input>

      <div className="space-y-1">
        <Label htmlFor="title">Title *</Label>
        <Input
          name="title"
          id="title"
          required
          defaultValue={formData.title || ""}
        />
        {errors?.title && <p className="text-sm text-red-600">{errors?.title}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="category">Category *</Label>
        <Select name="category" required defaultValue={formData.category || ""}>
          <SelectTrigger className="w-[20ch] max-w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat[0].toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.category && (
          <p className="text-sm text-red-600">{errors?.category}</p>
        )}
      </div>

      <div className="space-y-1">
        <TagsAutocomplete initialSelected={formData?.tags || []} />
        {errors?.tags && errors?.tags?.length>0 && <p className="text-sm text-red-600">{errors?.tags[0]}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="summary">Summary *</Label>
        <Textarea
          name="summary"
          id="summary"
          rows={3}
          required
          defaultValue={formData.summary || ""}
        />
        {errors?.summary && (
          <p className="text-sm text-red-600">{errors?.summary}</p>
        )}
      </div>

      <p className="inline-flex items-start gap-2 text-sm text-gray-500">
        <IoIosInformationCircleOutline className="w-8 h-8" />
        By submitting this form your blog will be created and moved to drafts.
        You will have 15 days to edit and publish it. In case of no action, it
        will be deleted automatically.
      </p>

      <Button type="submit">Continue to Editor →</Button>
    </form>
    
  );
}
