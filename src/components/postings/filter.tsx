// components/postings/postings-filter.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as RadioGroup from "@radix-ui/react-radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const options = [
  {
    label: "My Postings",
    value: "my_postings",
  },
  {
    label: "Community",
    value: "community_postings",
  },
];

interface Project {
  id: string;
  name: string;
}

interface PostingsFilterProps {
  currentValues: {
    project_id?: string;
    status?: string;
    mode?: string;
    start_date?: string;
    end_date?: string;
    view_mode? : string;
  };
  projects: Project[];
  viewMode?: string;
}

export default function PostingsFilter({
  currentValues,
  projects, viewMode
}: PostingsFilterProps) {
  return (
    <form method="get" className="flex flex-col  sm:flex-row gap-6 mb-6 pt-4">
      <div className="w-full sm:w-64 flex flex-col gap-4">
        <div className="w-full">
          <RadioGroup.Root
          name="view_mode"
      defaultValue={ viewMode || "my_postings" }
      className="max-w-sm w-full grid grid-cols-2 gap-3"
    >
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className="ring-[1px] ring-border rounded py-1 px-3 data-[state=checked]:ring-2 data-[state=checked]:ring-teal-950"
        >
          <span className="font-semibold tracking-tight">{option.label}</span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
        </div>
        <div className="w-full">
          <Label htmlFor="project_id">Project</Label>
          <Select
            name="project_id"
            defaultValue={currentValues.project_id ?? "all"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={currentValues.status ?? "all"}>
            <SelectTrigger className="w-full pb-1">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mode Filter */}
        <div className="w-full">
          <Label htmlFor="mode">Type</Label>
          <Select name="mode" defaultValue={currentValues.mode ?? "all"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in-person">In-Person</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div className="w-full">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            type="date"
            name="start_date"
            className="w-full"
            defaultValue={currentValues.start_date || ""}
          />
        </div>

        {/* End Date */}
        <div className="w-full">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            type="date"
            name="end_date"
            className="w-full"
            defaultValue={currentValues.end_date || ""}
          />
        </div>

        {/* Submit Button */}
        <div className="w-full">
          <button
            type="submit"
            className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Filter
          </button>
        </div>
      </div>
    </form>
  );
}
