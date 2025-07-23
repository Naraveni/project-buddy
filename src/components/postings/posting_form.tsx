'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/useToast';
import SkillsInput from '@/components/skills-input';
import { submitPosting } from '@/app/postings/new/action';
import { formatSlugToTitle } from '@/lib/utils';
import { PostingFormPageProps, PostingFormState } from '@/lib/types';


export default function PostingFormPage({ initialData, errors, projects }: PostingFormPageProps) {
  const [formState, formAction] = useActionState<PostingFormState, FormData>(submitPosting, {
    errors: errors ?? {},
    values: initialData ?? {},
  });
  const { toast } = useToast();
  const topRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0) {
      Object.entries(formState.errors).map(([field, msgs]) =>
        toast({
          title: 'Error Saving Posting',
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
      <h1 className="text-3xl font-bold mb-6">Create New Posting</h1>
      <form key={formKey} action={formAction} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Project</label>
          <select
            name="project_id"
            defaultValue={formState.values?.project_id || ''}
            required
            className="w-full border rounded px-3 py-2 text-black"
          >
            <option value="">Select Project</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          name="role_name"
          placeholder="Role Name"
          defaultValue={formState.values?.role_name}
          required
        />
        <Textarea
          name="description"
          placeholder="Role Description"
          defaultValue={formState.values?.description}
        />
        <div>
        <label className="block mb-1 text-sm font-medium">Start Date</label>
        <Input
          name="start_date"
          type="date"
          placeholder='Start date'
          defaultValue={formState.values?.start_date?.split('T')[0]}
          required
        />
        </div>
        <div>
        <label className="block mb-1 text-sm font-medium">End Date</label>
        <Input
          name="end_date"
          type="date"
          defaultValue={formState.values?.end_date?.split('T')[0]}
          required
        />
        </div>
        <Input
          name="hours_required"
          type="number"
          min="1"
          placeholder="Hours Required"
          defaultValue={formState.values?.hours_required}
          required
        />
        <div>
          <label className="block mb-1 text-sm font-medium">Mode of Meeting</label>
          <select
            name="mode_of_meeting"
            defaultValue={formState.values?.mode_of_meeting || ''}
            required
            className="w-full border rounded px-3 py-2 text-black"
          >
            <option value="">Select Mode</option>
            <option value="remote">Remote</option>
            <option value="in-person">In Person</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Status</label>
          <select
            name="status"
            defaultValue={formState.values?.status || ''}
            required
            className="w-full border rounded px-3 py-2 text-black"
          >
            <option value="">Select Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        <div>
        <label className="block mb-1 text-sm font-medium">Deadline</label>
        <Input
          name="application_deadline"
          type="date"
          defaultValue={formState.values?.application_deadline?.split('T')[0]}
        />
        </div>
        
        <SkillsInput
          name="skills"
          defaultSkills={
            Array.isArray(formState.values?.skills) &&
            typeof formState.values.skills[0] === 'object'
              ? (formState.values.skills as { id: string; name: string }[])
              : []
          }
        />
        {formState.values?.id && (
          <input type="hidden" name="id" value={formState.values.id} />
        )}
        <Button type="submit">Save Posting</Button>
      </form>
    </div>
  );
}