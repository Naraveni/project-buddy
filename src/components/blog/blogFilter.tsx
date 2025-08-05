import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const blogCategories = [
  'frontend',
  'backend',
  'devops',
  'deployment',
  'design',
  'ai',
  'product',
  'collaboration',
  'career',
  'other',
] as const;

const statuses = ['draft', 'published'] as const;

const tags = ['React', 'Next.js', 'Rails', 'TypeScript', 'AI', 'Design'];

type BlogFiltersProps = {
  searchParams?: {
    title?: string;
    category?: (typeof blogCategories)[number];
    status?: (typeof statuses)[number];
    tags?: string[];
    me?: string;
  };
  onSubmit: (formData: FormData) => Promise<void>;
};

export function BlogFilters({ searchParams = {}, onSubmit }: BlogFiltersProps) {
  const selectedTags = Array.isArray(searchParams.tags)
    ? searchParams.tags
    : searchParams.tags
    ? [searchParams.tags]
    : [];

  const showStatus = searchParams.me === 'true';

  return (
    <form action={onSubmit} method="post" className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex flex-col gap-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={searchParams.title || ''} />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={searchParams.category || ''}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {blogCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showStatus && (
        <div className="flex flex-col gap-1">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={searchParams.status || ''}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="sm:col-span-2 lg:col-span-3">
        <Label className="mb-2 block">Tags</Label>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                name="tags"
                value={tag}
                defaultChecked={selectedTags.includes(tag)}
                aria-checked={selectedTags.includes(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  );
}
