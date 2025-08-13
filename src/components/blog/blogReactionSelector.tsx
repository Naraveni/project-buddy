'use client';

import { useState } from 'react';
import { blog_reactions } from '@/utils/constants';
import { Button } from '../ui/button';
import { setBlogReaction } from '@/lib/queries';
import { ReactionRow } from '@/lib/types';
import { iconMap, formatLabel } from '@/lib/blog_reactions';
import { BlogReactionsSelectorProps } from '@/lib/types';

export default function BlogReactionsSelector({
  initialSelected = [],
  blogId
}: BlogReactionsSelectorProps) {
  const [selected, setSelected] = useState<ReactionRow['response']>(initialSelected);

  const toggle = (reaction: ReactionRow['response'][number]) => {
    let updated: ReactionRow['response'];
    if (selected.includes(reaction)) {
      updated = selected.filter((r : ReactionRow['response'][number]) => r !== reaction);
    } else {
      updated = [...selected, reaction];
    }
    setSelected(updated);
  };

  const handleReactionUpdate = async () => {
      await setBlogReaction(selected, blogId);
      
  };

  

  return (
    <div>
      <p className="text-sm">How did this article help you?</p>
      <div className="flex flex-wrap gap-3 pt-2">
        {blog_reactions.map((reaction) => {
          const isSelected = selected.includes(reaction);
          return (
            <button
              key={reaction}
              type="button"
              onClick={() => toggle(reaction)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border transition-colors
                ${
                  isSelected
                    ? 'bg-gray-600 border-gray-900 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200'
                } }`}
            >
              {iconMap[reaction]()}
              <span>{formatLabel(reaction)}</span>
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      <div className="py-4">
        <Button onClick={handleReactionUpdate} >
          Submit Reactions
        </Button>
      </div>
    </div>
  );
}
