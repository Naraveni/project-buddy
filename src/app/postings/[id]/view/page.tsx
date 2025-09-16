import { getPostingById, getProjectById, getUserById, getUser } from '@/lib/queries'; // add getUser here
import { Skill } from '@/lib/types';
import { formatSlugToTitle } from '@/lib/utils';
import Link from 'next/link';

import { MdEdit } from 'react-icons/md';

import ChatFormClient from '@/components/postings/chatForm';

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 40%)`;
}

export default async function PostingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const posting = await getPostingById(id);
  console.log("Posting data:", posting);

  const project = await getProjectById(posting.project_id);
  const user = await getUserById(posting.user_id);

  const currentUser = await getUser();

  const skills: Skill[] = posting.skills ?? [];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">💼 {posting.role_name}</h1>
        <div className="flex items-center gap-3">
          <Link
            href={`/postings/${posting.id}/view`}
            className="hover:scale-110 transition"
          >
          </Link>

          {currentUser?.id === posting.user_id && (
            <Link
              href={`/postings/${posting.id}/edit`}
              className="hover:scale-110 transition"
            >
              <MdEdit className="w-5 h-5 text-gray-500" />
            </Link>
          )}

          {currentUser?.id !== posting.user_id && posting.status === 'open' && (
            <div className="relative">
  <ChatFormClient
    postingId={posting.id}
  />
</div>
          )}
        </div>
      </div>

      <div className="text-gray-600">
        <p>
          📁 Project:{' '}
          <span className="font-medium text-black">
            {project?.name ?? 'Unknown Project'}
          </span>
        </p>
        <p>
          🧑 Posted by:{' '}
          <span className="font-medium text-black">
            {user?.username ?? 'Unknown User'}
          </span>
        </p>
      </div>

      <div className="border-t pt-6 space-y-4">
        <p className="text-lg text-gray-800 whitespace-pre-wrap">
          📝 Description:
        </p>
        <p className="text-gray-700 break-words whitespace-pre-wrap">
          {posting.description}
        </p>

        <div>
          <p className="text-lg mt-4 mb-2">🧠 Skills:</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="text-sm px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: stringToColor(skill.name) }}
              >
                {formatSlugToTitle(skill.name)}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-gray-800">
          <p>
            📍 Mode of Meeting:{' '}
            <span className="font-semibold">{posting.mode_of_meeting}</span>
          </p>
          <p>
            🕒 Hours Required:{' '}
            <span className="font-semibold">{posting.hours_required}</span>
          </p>
          <p>
            🟢 Status:{' '}
            <span className="font-semibold">{posting.status}</span>
          </p>
          <p>
            ⛳ Application Deadline:{' '}
            <span className="font-semibold">
              {new Date(posting.application_deadline).toDateString()}
            </span>
          </p>
          <p>
            📅 Start Date:{' '}
            <span className="font-semibold">
              {new Date(posting.start_date).toDateString()}
            </span>
          </p>
          <p>
            📅 End Date:{' '}
            <span className="font-semibold">
              {new Date(posting.end_date).toDateString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
