'use client';

import { useRef, useEffect, useState } from 'react';
import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SkillsInput from '@/components/skills-input';
import { useToast } from '@/components/useToast';
import { submitProject } from '@/app/projects/new/action';
import { ProjectFormState, ProjectFormPageProps } from '@/lib/types';
import FileUploader from '@/components/fileUploader';
import { PROJECT_BUCKET_IMAGE_PATH } from '@/utils/constants';
import { formatSlugToTitle } from '@/lib/utils';

export default function ProjectFormPage({
  initialData,
  errors,
}: ProjectFormPageProps) {
  const [formState, formAction] = useActionState<ProjectFormState, FormData>(
    submitProject,
    {
      errors: errors ?? {},
      values: initialData ?? {},
    }
  );

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    formState.values?.image_url || ''
  );
  const [isPublic, setIsPublic] = useState<boolean>(
    formState.values?.is_public ?? false
  );

  const { toast } = useToast();
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0) {
      Object.entries(formState.errors).map(([field, msgs]) =>
        toast({
          title: 'Error Saving Project',
          description: `${formatSlugToTitle(field)}:  ${msgs.join(', ')}`,
          variant: 'destructive',
        })
      );
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formState.errors, toast]);

  const formKey = JSON.stringify(formState.values);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-black" ref={topRef}>
      <h1 className="text-3xl font-bold mb-6">Add New Project</h1>
      <form key={formKey} action={formAction} className="space-y-6">
        
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <Input
            name="name"
            placeholder="Project Name"
            defaultValue={formState.values?.name}
            required
          />
        </div>

        {/* Project ID - hidden */}
        {formState.values?.id && (
          <input type="hidden" name="id" value={formState.values.id} />
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Description</label>
          <Textarea
            name="description"
            placeholder="Project Description"
            defaultValue={formState.values?.description}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Upload Image</label>
          <FileUploader
            imageUrl={uploadedImageUrl || ''}
            folder={PROJECT_BUCKET_IMAGE_PATH}
            onUpload={(url) => setUploadedImageUrl(url)}
          />
          <input type="hidden" name="image_url" value={uploadedImageUrl ?? ''} />
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block text-sm font-medium mb-1">GitHub URL</label>
          <Input
            name="github_url"
            placeholder="GitHub URL"
            defaultValue={formState.values?.github_url}
          />
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Website URL</label>
          <Input
            name="website_url"
            placeholder="Website URL"
            defaultValue={formState.values?.website_url}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input
            name="category"
            placeholder="Category"
            defaultValue={formState.values?.category}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={formState.values?.status || ''}
            required
            className="w-full border rounded px-3 py-2 text-black"
          >
            <option value="">Select Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Is Public */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_public"
            checked={isPublic}
            onCheckedChange={(value) => setIsPublic(Boolean(value))}
          />
          <label htmlFor="is_public" className="text-sm font-medium leading-none">
            Is Public
          </label>
          <input type="hidden" name="is_public" value={isPublic ? 'true' : 'false'} />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <SkillsInput
            name="skills"
            defaultSkills={
              Array.isArray(formState.values?.skills) &&
              typeof formState.values.skills[0] === 'object'
                ? (formState.values.skills as { id: string; name: string }[])
                : []
            }
          />
        </div>

        {/* Submit Button */}
        <Button type="submit">Save Project</Button>
      </form>
    </div>
  );
}
