import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ProjectSearchSelect from "./projectSearchSelect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";




interface PostingsFilterProps {
  currentValues: {
    project_id?: string;
    status?: string;
    mode?: string;
    start_date?: string;
    end_date?: string;
    view_mode? : string;
  };
  viewMode?: string;
}

export default function PostingsFilter({
  currentValues,
 viewMode
}: PostingsFilterProps) {
  return (
    <form method="get" className="flex flex-col sm:flex-row gap-6 mb-6 pt-4">
  <div className="w-full sm:w-64 flex flex-col gap-5">

    <div className="flex flex-col gap-1">
      <Label htmlFor="project">Project</Label>
      <ProjectSearchSelect defaultValue={currentValues.status}/>
    </div>
{viewMode !== 'community_postings' &&
    <div className="flex flex-col gap-1">
      <Label htmlFor="status">Status</Label>
      <Select name="status" defaultValue={currentValues.status ?? "all"}>
        <SelectTrigger className="w-full">
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
}
    <div className="flex flex-col gap-1">
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

    {/* Dates */}
    <div className="flex flex-col gap-1">
      <Label htmlFor="start_date">Start Date</Label>
      <Input
        type="date"
        name="start_date"
        defaultValue={currentValues.start_date || ""}
      />
    </div>

    <div className="flex flex-col gap-1">
      <Label htmlFor="end_date">End Date</Label>
      <Input
        type="date"
        name="end_date"
        defaultValue={currentValues.end_date || ""}
      />
    </div>

    {/* Submit */}
    <button
      type="submit"
      className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
    >
      Filter
    </button>
  </div>
</form>

  );
}
