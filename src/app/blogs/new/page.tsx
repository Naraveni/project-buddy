import createBlog from "./action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IoIosInformationCircleOutline } from "react-icons/io";
//TODO: THis form and blogmetadata dialog should be having a common compoenent for the form

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function BlogMetadataPage({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  const errors = searchParams?.errors ? JSON.parse(searchParams.errors) : {};
  const formData = searchParams?.formData
    ? JSON.parse(decodeURIComponent(searchParams.formData))
    : {};

  return (
    <form action={createBlog} className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">📝 Create Blog Metadata</h1>

      <div className="space-y-1">
        <Label htmlFor="title">Title *</Label>
        <Input
          name="title"
          id="title"
          required
          defaultValue={formData.title || ""}
        />
        {errors?.title && <p className="text-sm text-red-600">{errors.title}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="category">Category *</Label>
        <Select name="category" required defaultValue={formData.category || ""}>
          <SelectTrigger>
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
          <p className="text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="tags">Tags *</Label>
        <Input
          name="tags"
          id="tags"
          required
          placeholder="Comma-separated (e.g., react, nextjs)"
          defaultValue={formData.tags || ""}
        />
        {errors?.tags && <p className="text-sm text-red-600">{errors.tags}</p>}
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
          <p className="text-sm text-red-600">{errors.summary}</p>
        )}
      </div>

      <p className="inline-flex items-start gap-2 text-sm text-gray-500">
        <IoIosInformationCircleOutline className="w-8 h-8" />
        <div>
          By Submitting this form your blog will be created and moved to drafts.
          You will have 15 days to edit and publish it,
          In case of no action it will be deleted automatically.
        </div>
      </p>

      <Button type="submit">Continue to Editor →</Button>
    </form>
  );
}
