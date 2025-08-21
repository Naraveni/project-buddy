'use client';

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Tag } from "@/lib/types";

type AsyncMultiSelectProps = {
  initialSelected?: Tag[];
  placeholder?: string;
  fetchData: (query: string) => Promise<Tag[]>;
  onChange?: (selectedIds: string[]) => void;
  maxSelected?: number; // zero or undefined means no limit
  name?: string; // form field name
};

export function AsyncMultiSelect({
  initialSelected = [],
  placeholder = "Select tags...",
  fetchData,
  onChange,
  maxSelected = 0,
  name = "tags",
}: AsyncMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Tag[]>(initialSelected);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<Tag[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleUnselect = React.useCallback(
    (tag: Tag) => {
      setSelected((prev) => {
        const newSelected = prev.filter((s) => s.id !== tag.id);
        onChange?.(newSelected.map((t) => t.id!));
        return newSelected;
      });
    },
    [onChange]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            onChange?.(newSelected.map((t) => t.id!));
            return newSelected;
          });
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    },
    [onChange]
  );

  const selectables = options.filter(
    (tag) => !selected.some((s) => s.id === tag.id)
  );

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (!inputValue.trim()) {
        setOptions([]);
        return;
      }

      setLoading(true);
      fetchData(inputValue)
        .then((res) => setOptions(res || []))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue, fetchData]);

  const handleSelect = (tag: Tag) => {
    if (maxSelected > 0 && selected.length >= maxSelected) return;

    setSelected((prev) => {
      const newSelected = [...prev, tag];
      onChange?.(newSelected.map((t) => t.id!));
      return newSelected;
    });
    setInputValue("");
  };

  const shouldShowDropdown = open && (loading || selectables.length > 0);

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent w-auto">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
        <div className="flex flex-nowrap items-center gap-1 overflow-x-auto max-h-[40px]">
          {selected.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="flex-shrink-0">
              {tag.name}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(tag)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}

          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[60px] bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Single hidden input for all selected IDs */}
      <input type="hidden" name={name} value={selected.map((t) => t.id).join(",")} />

      {shouldShowDropdown && (
        <div className="relative mt-2">
          <CommandList>
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in max-h-60 overflow-auto">
              <CommandGroup>
                {loading && <CommandItem value="">Loading...</CommandItem>}
                {!loading &&
                  selectables.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => handleSelect(tag)}
                      className="cursor-pointer"
                    >
                      {tag.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </div>
          </CommandList>
        </div>
      )}
    </Command>
  );
}
