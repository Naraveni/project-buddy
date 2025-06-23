'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Experience, Education } from '@/lib/types';

type ExpEduFormProps = {
  defaultExperience: Experience[];
  defaultEducation: Education[];
};

export function ExpEdu({
  defaultExperience,
  defaultEducation,
}: ExpEduFormProps) {
  const [experience, setExperience] = useState<Experience[]>(defaultExperience);
  const [education, setEducation] = useState<Education[]>(defaultEducation);

  useEffect(() => setExperience(defaultExperience), [defaultExperience]);
  useEffect(() => setEducation(defaultEducation), [defaultEducation]);

  const updateExperienceField = (
    idx: number,
    field: keyof Experience,
    value: string
  ) => {
    setExperience((prev) =>
      prev.map((exp, i) => (i === idx ? { ...exp, [field]: value } : exp))
    );
  };

  const updateEducationField = (
    idx: number,
    field: keyof Education,
    value: string
  ) => {
    setEducation((prev) =>
      prev.map((edu, i) => (i === idx ? { ...edu, [field]: value } : edu))
    );
  };

  const addExperience = () =>
    setExperience((prev) => [
      ...prev,
      { employer: '', role: '', startDate: '', endDate: '', description: '' },
    ]);

  const removeExperience = (idx: number) =>
    setExperience((prev) => prev.filter((_, i) => i !== idx));

  const addEducation = () =>
    setEducation((prev) => [
      ...prev,
      { university: '', major: '', startDate: '', endDate: '', description: '' },
    ]);

  const removeEducation = (idx: number) =>
    setEducation((prev) => prev.filter((_, i) => i !== idx));

  return (
    <>
      {/* Experience Section */}
      <div className="mt-6 text-black">
        <h3 className="text-lg font-semibold mb-2">Experience</h3>
        {experience.map((exp, idx) => (
          <div key={idx} className="mb-6">
            <div className="border rounded p-4">
              <Input
                name={`experience[${idx}].employer`}
                placeholder="Employer"
                className="w-full mb-2"
                value={exp.employer}
                onChange={(e) =>
                  updateExperienceField(idx, 'employer', e.target.value)
                }
                required
              />
              <Input
                name={`experience[${idx}].role`}
                placeholder="Role"
                className="w-full mb-2"
                value={exp.role}
                onChange={(e) => updateExperienceField(idx, 'role', e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  type="date"
                  name={`experience[${idx}].startDate`}
                  className="w-full"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperienceField(idx, 'startDate', e.target.value)
                  }
                  required
                />
                <Input
                  type="date"
                  name={`experience[${idx}].endDate`}
                  className="w-full"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateExperienceField(idx, 'endDate', e.target.value)
                  }
                  required
                />
              </div>
              <Textarea
                name={`experience[${idx}].description`}
                placeholder="Description"
                rows={3}
                className="w-full mt-2"
                value={exp.description}
                onChange={(e) =>
                  updateExperienceField(idx, 'description', e.target.value)
                }
                required
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="mt-2"
              onClick={() => removeExperience(idx)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addExperience}>
          + Add Experience
        </Button>
      </div>

      {/* Education Section */}
      <div className="mt-6 text-black">
        <h3 className="text-lg font-semibold mb-2">Education</h3>
        {education.map((edu, idx) => (
          <div key={idx} className="mb-6">
            <div className="border rounded p-4">
              <Input
                name={`education[${idx}].university`}
                placeholder="University"
                className="w-full mb-2"
                value={edu.university}
                onChange={(e) =>
                  updateEducationField(idx, 'university', e.target.value)
                }
                required
              />
              <Input
                name={`education[${idx}].major`}
                placeholder="Major"
                className="w-full mb-2"
                value={edu.major}
                onChange={(e) =>
                  updateEducationField(idx, 'major', e.target.value)
                }
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  type="date"
                  name={`education[${idx}].startDate`}
                  className="w-full"
                  value={edu.startDate}
                  onChange={(e) =>
                    updateEducationField(idx, 'startDate', e.target.value)
                  }
                  required
                />
                <Input
                  type="date"
                  name={`education[${idx}].endDate`}
                  className="w-full"
                  value={edu.endDate}
                  onChange={(e) =>
                    updateEducationField(idx, 'endDate', e.target.value)
                  }
                  required
                />
              </div>
              <Textarea
                name={`education[${idx}].description`}
                placeholder="Description"
                rows={3}
                className="w-full mt-2"
                value={edu.description}
                onChange={(e) =>
                  updateEducationField(idx, 'description', e.target.value)
                }
                required
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="mt-2"
              onClick={() => removeEducation(idx)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addEducation}>
          + Add Education
        </Button>
      </div>
    </>
  );
}
