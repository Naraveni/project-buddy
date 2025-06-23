'use client';

import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skill, SkillFieldStateType } from '@/lib/types';
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

export default function SkillsInput({
  name = 'skills',
  defaultSkills = [],
}: {
  name?: string;
  defaultSkills?: Skill[];
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  const [fieldState, setFieldState] = useState<SkillFieldStateType>({
    selected: defaultSkills,
    error: undefined,
  });

useEffect(() => {
  console.log("Incoming defaultSkills", defaultSkills);
  setFieldState((prev) => ({
    ...prev,
    selected: defaultSkills,
  }));
}, [defaultSkills]);

  const fetchId = useRef(0);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setFieldState((prev) => ({ ...prev, error: undefined }));
      return;
    }

    const id = ++fetchId.current;
    const timer = setTimeout(() => {
      fetch(`/api/skills?search=${encodeURIComponent(query)}`)
        .then((res) => {
          if (!res.ok) {
            return res.status === 404
              ? Promise.reject('You are not authorized to fetch skills.')
              : Promise.reject('Error fetching skills.');
          }
          return res.json();
        })
        .then((data: Skill[]) => {
          if (fetchId.current === id) {
            setSuggestions(data);
          }
        })
        .catch((errMsg) => {
          if (fetchId.current === id) {
            setFieldState((prev) => ({ ...prev, error: errMsg }));
          }
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const formatSkill = (name: string) => {
    if (!name) return '';
    return name
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const addSkill = (skill: Skill) => {
    if (!fieldState.selected.find((s) => s.id === skill.id)) {
      setFieldState((prev) => ({
        ...prev,
        selected: [...prev.selected, skill],
      }));
    }
    setQuery('');
  };

  const removeSkill = (id: string) =>
    setFieldState((prev) => ({
      ...prev,
      selected: prev.selected.filter((s) => s.id !== id),
    }));

  return (
    <div>
      <label className="text-lg font-semibold mb-2 block">Skills</label>
      <Command>
        <div className="flex flex-wrap gap-1 border border-gray-300 p-3 rounded-md bg-white shadow-sm dark:bg-black dark:border-gray-600">
          {fieldState.selected.map((s) => (
            <Badge
              key={s.id}
              variant="secondary"
              onClick={() => removeSkill(s.id)}
              className="cursor-pointer"
            >
              {formatSkill(s.name)} ×
            </Badge>
          ))}
          <CommandInput
            placeholder="Type to search…"
            value={query}
            onValueChange={setQuery}
            className="flex-1 border-none focus:ring-0"
          />
        </div>
        {fieldState.error && (
          <p className="mt-1 text-sm text-red-500">{fieldState.error}</p>
        )}
        {suggestions.length > 0 && !fieldState.error && (
          <CommandList>
            <CommandGroup>
              {suggestions.map((skill) => (
                <CommandItem key={skill.id} onSelect={() => addSkill(skill)}>
                  {formatSkill(skill.name)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>

      <input
  type="hidden"
  name={name}
  value={JSON.stringify(fieldState.selected.map(s => ({
    id: s.id,
    name: s.name,
})))}
/>
    </div>
  );
}
