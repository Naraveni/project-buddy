import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatSlugToTitle(slug: string): string {
  return slug
    .split(/[_\-]/) // Split on underscore or hyphen
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getPublicImageUrl(path: string): string {
  const projectRef = '<your-project-ref>';
  return `https://${projectRef}.supabase.co/storage/v1/object/public/projectbuddy/${path}`;
}