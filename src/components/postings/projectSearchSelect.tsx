"use client";

import { useState, useEffect } from "react";
import { Command, CommandInput, CommandItem, CommandList, CommandGroup, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { searchPojectsByName } from "@/lib/queries";

interface Project {
  id: string;
  name: string;
}

interface ProjectSearchSelectProps {
  defaultValue?: string;
}

export default function ProjectSearchSelect({ defaultValue }: ProjectSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");



  useEffect(() => {
    const fetchProjects = async (q: string) => {
    try {
      const data = await searchPojectsByName(q);
      setProjects(data);
      console.log(data)
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  }
  fetchProjects(query);
  }, [query]);

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {value === "all"
              ? "All Projects"
              : projects.find((p) => p.id === value)?.name || "Select project"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search projects..."
              onValueChange={(val) => setQuery(val)}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key="all"
                  onSelect={() => {
                    setValue("all");
                    setOpen(false);
                  }}
                >
                  All Projects
                </CommandItem>
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => {
                      setValue(project.id);
                      setOpen(false);
                    }}
                  >
                    {project.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <input type="hidden" name="project_id" value={value} />
    </div>
  );
}
