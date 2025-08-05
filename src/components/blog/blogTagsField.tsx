'use client';

import { useState, useEffect } from 'react';
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
};

export function TagsAutocomplete({ initialSelected = [] }: TagsAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Tag[]>(initialSelected || []);
  const [fetchedTags, setFetchedTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

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
  };

  const removeTag = (name: string) => {
    setSelected((prev)=>prev.filter(t => t.name !== name));
  };

  const handleCreateNewTag = () => {
    if (query.trim().length > 0) {
      addTag({ id: null, name: query.trim() });
    }
  };

  return (
    <div className="w-full">
      <Label className="mb-1 block">Tags</Label>

      {selected.map(tag => (
        <Input
          key={tag.name + tag.id}
          type="hidden"
          name="tags"
          value={JSON.stringify(tag)}
        />
      ))}

      <div className="flex flex-wrap gap-2 mb-2 items-center">
        {selected.map(tag => (
            <>
          <Badge key={tag.name + tag.id} variant="secondary" className="flex items-center gap-1 bg-zinc-100 border border-gray-600 shadow-2xl p-1"  onClick={(e) => {e.stopPropagation();removeTag(tag.name)}} >
            {tag.name}
            <IoMdClose key={tag.name + tag.id} className="w-3 h-3 cursor-pointer"/>
          </Badge>
          
            </>
        ))}
      </div>

      <div className="relative">
        <Command className="border rounded-md shadow-sm">
          <CommandInput
            placeholder="Search or create tag..."
            value={query}
            onValueChange={setQuery}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 200)}
          />
          {inputFocused && (
            <CommandList>
              {filteredTags.map(tag => (
                <CommandItem key={tag.id+tag.name} onSelect={() => addTag(tag)} className="cursor-pointer">
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

        {query.length > 4 && filteredTags.length === 0 && (
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
    </div>
  );
}
