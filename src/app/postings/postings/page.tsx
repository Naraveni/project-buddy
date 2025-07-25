"use server";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { formatSlugToTitle } from "@/lib/utils";
import PostingsFilter from "@/components/postings/filter";
import { getUserPostings } from "./action";
import { getUserProjectsList, getUser } from "@/lib/queries";
import ChatFormClient from "@/components/postings/chatForm";

import {
  CalendarDays,
  CalendarCheck,
  Briefcase,
  Hourglass,
  Tag,
  Building,
} from "lucide-react";

interface SearchParams {
  page?: string;
  project_id?: string;
  status?: string;
  mode?: string;
  start_date?: string;
  end_date?: string;
  view_mode?: string;
}

export default async function MyPostingsPage({
  searchParams,
  errors,
}: {
  searchParams: SearchParams;
  errors?: string[];
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const perPage = 10;

  const { postings, count } = await getUserPostings(page, perPage, {
    project_id: searchParams.project_id,
    status: searchParams.status,
    mode_of_meeting: searchParams.mode,
    start_date: searchParams.start_date,
    end_date: searchParams.end_date,
    view_mode: searchParams.view_mode,
  });

  const projects = await getUserProjectsList();
  const totalPages = Math.ceil((count ?? 0) / perPage);

  const user = await getUser();

  return (
    <main className="w-full h-[calc(100vh-3rem)] grid lg:grid-cols-[20%_1fr] pt-2">
      <div className="px-4 border-r border-gray-300 overflow-y-auto">
        <PostingsFilter
          projects={projects}
          currentValues={{
            project_id: searchParams.project_id,
            status: searchParams.status,
            mode: searchParams.mode,
            start_date: searchParams.start_date,
            end_date: searchParams.end_date,
          }}
          viewMode={searchParams.view_mode || "my_postings"}
        />
      </div>

      <div className="px-6 py-6 space-y-6 overflow-y-auto h-full">
        <h1 className="text-3xl font-bold text-black">
          {searchParams.view_mode === "my_postings"
            ? "My Postings"
            : "Community Postings"}
        </h1>

        {postings.length === 0 && (
          <p className="text-gray-400">No postings yet.</p>
        )}

        {postings.map((posting) => (
          <Card
            key={posting.id}
            className={`p-4 rounded-2xl transition shadow-sm hover:shadow-2xl relative ${
              posting.status === "paused"
                ? "bg-neutral-100"
                : posting.status === "closed"
                ? "bg-red-100 text-black"
                : "bg-white"
            }`}
          >
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <Link
                  href={`/postings/${posting.id}/edit`}
                  className="text-xl font-semibold hover:underline block"
                >
                  {posting.role_name}
                </Link>
                <Badge
                  variant="outline"
                  className={`text-xs capitalize flex items-center gap-1 ${
                    posting.status === "open"
                      ? "border-green-500 text-green-700"
                      : posting.status === "paused"
                      ? "border-yellow-500 text-yellow-700"
                      : "border-red-500 text-red-700"
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  {posting.status}
                </Badge>
                {posting.user_id != user?.id && posting.status === "open" && (
                  <ChatFormClient postingId={posting.id} />
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {posting.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {posting.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    className="text-xs px-2 py-1 rounded-full bg-opacity-90"
                    style={{ backgroundColor: stringToColor(skill.name) }}
                  >
                    {formatSlugToTitle(skill.name)}
                  </Badge>
                ))}
              </div>

              {/* Date and Type Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm mt-2">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  Start: {formatDate(posting.start_date)}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  End: {formatDate(posting.end_date)}
                </span>
                {posting.application_deadline && (
                  <span className="flex items-center gap-1">
                    <CalendarCheck className="w-4 h-4 text-gray-500" />
                    Deadline: {formatDate(posting.application_deadline)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4 text-gray-500" />
                  Type: {formatSlugToTitle(posting.mode_of_meeting)}
                </span>
              </div>

              {/* Hours */}
              <div className="text-sm font-medium mt-1 flex items-center gap-1">
                <Hourglass className="w-4 h-4 text-gray-500" />
                Weekly Hours Required: {posting.hours_required}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Pagination */}
        <div className="flex justify-between items-center pt-6">
          {page > 1 ? (
            <Link
              href={`?page=${page - 1}`}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </Link>
          ) : (
            <span className="px-4 py-2 text-gray-400">Previous</span>
          )}

          <span className="text-gray-700">
            Page {page} of {totalPages || 1}
          </span>

          {page < totalPages ? (
            <Link
              href={`?page=${page + 1}`}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </Link>
          ) : (
            <span className="px-4 py-2 text-gray-400">Next</span>
          )}
        </div>
      </div>
    </main>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 40%)`;
}
