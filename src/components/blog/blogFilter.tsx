import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getTags } from '@/lib/queries';

import { AsyncMultiSelect } from '../ui/multiselect';


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
    tags?: string[] | string;
  };
  onSubmit: (formData: FormData) => Promise<void>;
};

export function BlogFilters({ searchParams = {}, onSubmit }: BlogFiltersProps) {
  const initialTags = Array.isArray(searchParams.tags)
    ? searchParams.tags
    : searchParams.tags
    ? [searchParams.tags]
    : [];

  return (
    <form action={onSubmit} className="mb-4 flex gap-2 items-stretch flex-wrap">

      <div className="flex flex-col gap-1 items-center">
        <Input
          id="title"
          name="title"
          defaultValue={searchParams.title ?? ''}
          placeholder="Filter by title"
          className='w-48'
        />
      </div>
      <div className="flex flex-col gap-1">
        
        <Select
          key="category"
          name="category"
          defaultValue={searchParams.category ?? undefined}
        >
          <SelectTrigger>
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
      <div className="flex flex-col gap-1">
        
        <Select
          key="status"
          name="status"
          defaultValue={searchParams.status ?? undefined}
        >
          <SelectTrigger>
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
      <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-1">
        <AsyncMultiSelect fetchData={getTags} maxSelected={4} />
        {4 > 0 && (
    <p className="text-xs text-muted-foreground mt-1">
      You can select up to 4 tags
    </p>
  )}
      </div>
      <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  );
}
