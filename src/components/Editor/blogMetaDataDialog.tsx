'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Blog } from "@/lib/types";
import React, { useState } from "react";
import updateBlogMetaData from "@/app/blogs/new/actionDialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TagsAutocomplete } from "@/components/blog/blogTagsField";
import { URLSearchParams } from "next/dist/compiled/@edge-runtime/primitives/url";

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

export default function BlogMetaData({
  blog,
  searchParams,
  dialogOpen = false,
}: {
  blog: Blog,
  searchParams?: URLSearchParams,
  dialogOpen: boolean,
}): React.JSX.Element {
  const dialogErrorsStr = searchParams?.get('dialogErrors');
  let errors: Record<string, string[]> = {};
  try {
    errors = dialogErrorsStr ? JSON.parse(dialogErrorsStr) : {};
  } catch {
    errors = {};
  }

  const [dialogOpenState, setDialogOpenState] = useState(dialogOpen);
  let formData = searchParams?.get('formData')
    ? JSON.parse(decodeURIComponent(searchParams.get('formData') || ''))
    : {};
  if (Object.keys(formData).length === 0 && blog) {
    formData = {
      title: blog?.title || "",
      category: blog?.category || "",
      tags: blog?.tags || [],
      summary: blog?.summary || "",
      id: blog?.id || ""
    };
  }

  const renderErrors = (field: string) => {
    if (errors[field]?.length) {
      return (
        <p className="text-sm text-red-600 mt-1">
          {errors[field].join(", ")}
        </p>
      );
    }
    return null;
  };

  return (
    <Dialog open={dialogOpenState} onOpenChange={setDialogOpenState}>
      <Button variant="outline" onClick={() => setDialogOpenState(true)}>Edit Title / Summary</Button>
      <DialogContent className="sm:max-w-[425px]">
        <form action={updateBlogMetaData}>
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogDescription>
              Make changes to your blog metadata here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Input type="hidden" name="id" defaultValue={formData?.id} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={formData?.title} />
              {renderErrors("title")}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="summary">Summary</Label>
              <Input id="summary" name="summary" defaultValue={formData?.summary} />
              {renderErrors("summary")}
            </div>
            <div className="grid gap-3">
              <TagsAutocomplete initialSelected={formData?.tags || []} />
              {renderErrors("tags")}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" required defaultValue={formData?.category || ""}>
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
              {renderErrors("category")}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
