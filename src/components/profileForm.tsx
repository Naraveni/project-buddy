'use client';

import React, { useRef, useEffect } from 'react';
import { useActionState } from 'react';
import { useToast } from '@/components/useToast';
import { submitProfile } from '@/app/signup/action';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ExpEdu } from '@/components/dynamicExpAndEducationForm';
import { ProfileFormState, ProfileFormPageProps } from '@/lib/types';
import SkillsInput from './skills-input';

export default function ProfileFormPage({ initialData, errors }: ProfileFormPageProps) {
  const [formState, formAction] = useActionState<ProfileFormState, FormData>(
    submitProfile,
    { errors: errors ?? {}, values: initialData ?? {} }
  );
  const { toast } = useToast();
  const topRef = useRef<HTMLDivElement>(null);
  console.log(formState)

  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0) {
      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const messages = Object.entries(formState.errors).map(
        ([field, msgs]) => `${capitalize(field)}: ${msgs.join(', ')}`
      );
      toast({
        title: 'Profile cannot be saved',
        description: messages.join('\n'),
        variant: 'destructive',
      });
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formState.errors, toast]);

  // Force remount on values change so defaultValue updates
  const formKey = JSON.stringify(formState.values);

  return (
    <div className="relative text-black max-w-3xl mx-auto py-12 px-4" ref={topRef}>
      <h1 className="mb-4 text-4xl font-extrabold">Complete Your Profile</h1>
      <form key={formKey} action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="first_name"
            placeholder="First Name"
            defaultValue={formState.values?.first_name}
            required
          />
          <Input
            name="last_name"
            placeholder="Last Name"
            defaultValue={formState.values?.last_name}
            required
          />
        </div>

        <Input
          name="username"
          placeholder="Username"
          defaultValue={formState.values?.username}
          required
        />

        <Textarea
          name="bio"
          placeholder="Tell us about yourself..."
          defaultValue={formState.values?.bio}
          required
        />

        <ExpEdu
          defaultExperience={formState.values?.experience || []}
          defaultEducation={formState.values?.education || []}
        />

        <SkillsInput name ="skills" defaultSkills={formState.values?.skills || []} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="linkedin"
            placeholder="LinkedIn URL"
            defaultValue={formState.values?.linkedin}
          />
          <Input
            name="github"
            placeholder="GitHub URL"
            defaultValue={formState.values?.github}
          />
          <Input
            name="website"
            placeholder="Personal Website"
            defaultValue={formState.values?.website}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select name="status" defaultValue={formState.values?.status} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your current status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Employed">Employed</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Looking For Employment">Looking For Employment</SelectItem>
              <SelectItem value="Upskilling">Upskilling</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="country"
            placeholder="Country"
            defaultValue={formState.values?.country}
            required
          />
          <Input
            name="pincode"
            placeholder="Pincode"
            maxLength={6}
            defaultValue={formState.values?.pincode}
          />
        </div>

        <Button className="w-full md:w-auto" type="submit">
          Submit Profile
        </Button>
      </form>
    </div>
  );
}