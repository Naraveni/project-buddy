'use client';

import { useRef, useEffect, useState } from 'react';
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
import { checkUsernameAvailability } from '@/app/signup/action';
import { AlertCircle } from 'lucide-react';

export default function ProfileFormPage({ initialData, errors }: ProfileFormPageProps) {
  const [formState, formAction] = useActionState<ProfileFormState, FormData>(
    submitProfile,
    { errors: errors ?? {}, values: initialData ?? {} },
  );
  

  const { toast } = useToast();
  const topRef = useRef<HTMLDivElement>(null);
  const [usernameAvailability, setUsernameAvailability] = useState<boolean>(true);

  useEffect(() => {
    if (formState.errors && Object.keys(formState.errors).length > 0) {
      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const messages = Object.entries(formState.errors).map(
        ([field, msgs]) => `${capitalize(field)}: ${msgs.join(', ')}`
      );

      const messagesToShow = messages.slice(0, 4);
      messagesToShow.forEach((message) => {
      toast({
        title: "Profile cannot be saved",
        description: message,
        variant: "destructive",
      });
    });
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [formState.errors, toast]);

  async function checkUsernameAvailabilityHandler(username: string): Promise<void> {
    const result = await checkUsernameAvailability(username);
    setUsernameAvailability(result);
  }

  const formKey = JSON.stringify(formState.values);

  return (
    <div className="relative text-black max-w-3xl mx-auto py-12 px-4" ref={topRef}>
      <h1 className="mb-4 text-4xl font-extrabold">Complete Your Profile</h1>

      <form  key={formKey} action={formAction} className="space-y-6">

        {/* FIRST + LAST NAME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input
              name="first_name"
              placeholder="First Name"
              defaultValue={formState.values?.first_name}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input
              name="last_name"
              placeholder="Last Name"
              defaultValue={formState.values?.last_name}
              required
            />
          </div>
        </div>

        {/* USERNAME */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <Input
            name="username"
            placeholder="Username"
            defaultValue={formState.values?.username}
            onChange={(e) => checkUsernameAvailabilityHandler(e.target.value)}
            required
          />

          {/* ERROR: Keep tight spacing under field */}
          {!usernameAvailability && (
            <div className="flex items-center gap-1 text-destructive text-sm mt-1">
              <AlertCircle className="h-4 w-4" />
              <span>Username not available</span>
            </div>
          )}
        </div>

        {/* BIO */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <Textarea
            name="bio"
            placeholder="Tell us about yourself..."
            defaultValue={formState.values?.bio}
            required
          />
        </div>

        {/* EXP + EDU (IGNORE AS REQUESTED) */}
        <ExpEdu
          defaultExperience={formState.values?.experience || []}
          defaultEducation={formState.values?.education || []}
        />

        {/* SKILLS */}
        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          
          <SkillsInput name="skills" defaultSkills={formState.values?.skills || []} />
        </div>

        {/* SOCIAL LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <Input
              name="linkedin"
              placeholder="LinkedIn URL"
              defaultValue={formState.values?.personal_profiles?.linkedin || formState.values?.linkedin}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <Input
              name="github"
              placeholder="GitHub URL"
              defaultValue={formState.values?.personal_profiles?.github ||  formState.values?.github}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Personal Website</label>
            <Input
              name="website"
              placeholder="Personal Website"
              defaultValue={formState.values?.personal_profiles?.website || formState.values?.website}
            />
          </div>
        </div>

        {/* STATUS */}
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

        {/* COUNTRY + PINCODE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <Input
              name="country"
              placeholder="Country"
              defaultValue={formState.values?.country}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <Input
              name="pincode"
              placeholder="Pincode"
              maxLength={6}
              defaultValue={formState.values?.pincode}
            />
          </div>
        </div>

        <Button className="w-full md:w-auto" type="submit">
          Submit Profile
        </Button>
      </form>
    </div>
  );
}
