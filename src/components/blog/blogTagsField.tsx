'use client';

import { useState, useEffect, useRef } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getTags } from '@/lib/queries';
import { Tag } from '@/lib/types';
import { IoMdClose } from "react-icons/io";

type TagsAutocompleteProps = {
  initialSelected?: Tag[];
  showAddTags?: boolean
};

export function TagsAutocomplete({ initialSelected = [], showAddTags = true }: TagsAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Tag[]>(initialSelected || []);
  const [fetchedTags, setFetchedTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTags = fetchedTags.filter(
    tag => !selected.some(sel => sel.name.toLowerCase() === tag.name.toLowerCase())
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 0) {
        setLoading(true);
        getTags(query).then((res) => {
          if (Array.isArray(res)) {
            setFetchedTags(res);
          } else {
            setFetchedTags([]);
          }
          setLoading(false);
        });
      } else {
        setFetchedTags([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const addTag = (tag: Tag) => {
    if (!selected.some(t => t.name.toLowerCase() === tag.name.toLowerCase())) {
      setSelected([...selected, tag]);
    }
    setQuery('');
    inputRef.current?.focus();
  };

  const removeTag = (name: string) => {
    setSelected((prev) => prev.filter(t => t.name !== name));
  };

  const handleCreateNewTag = () => {
    if (query.trim().length > 0) {
      addTag({ id: null, name: query.trim() });
    }
  };

  return (
    <div className="w-full">
      {showAddTags && <Label className="mb-1 block">Tags</Label>}

      {/* Hidden inputs for form submission */}
      {selected.map(tag => (
        <Input
          key={`hidden-${tag.id ?? tag.name}`}
          type="hidden"
          name="tags"
          value={JSON.stringify(tag)}
        />
      ))}

      {/* Input field with tags inside */}
      <div className="relative border rounded-md flex items-center flex-wrap p-1 gap-1 max-h-12 overflow-x-auto overflow-y-hidden">
        {selected.map(tag => (
          <Badge
            key={`badge-${tag.id ?? tag.name}`}
            variant="secondary"
            className="flex items-center gap-1 bg-zinc-100 border border-gray-600 p-1 shrink-0"
          >
            {tag.name}
            <IoMdClose
              className="w-3 h-3 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); removeTag(tag.name); }}
            />
          </Badge>
        ))}

        <Command className="flex-1 min-w-[120px]">
          <CommandInput
            ref={inputRef}
            className="border-none focus:ring-0 p-1 w-full"
            placeholder="Search or create tag..."
            value={query}
            onValueChange={setQuery}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 200)}
          />
          {inputFocused && (
            <CommandList className="absolute z-10 left-0 right-0 top-full mt-1 bg-white shadow-lg border rounded-md">
              {filteredTags.map(tag => (
                <CommandItem
                  key={`option-${tag.id ?? tag.name}`}
                  onSelect={() => addTag(tag)}
                  className="cursor-pointer"
                >
                  {tag.name}
                </CommandItem>
              ))}
              {!loading && query.length > 0 && filteredTags.length === 0 && (
                <CommandEmpty>
                  <div className="p-2 text-sm text-muted-foreground">
                    No matching tags found.
                  </div>
                </CommandEmpty>
              )}
            </CommandList>
          )}
        </Command>
      </div>

      {showAddTags && query.length > 2 && filteredTags.length === 0 && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCreateNewTag}
          className="mt-2"
        >
          {`Add "${query}" as new tag`}
        </Button>
      )}
    </div>
  );
}
