import { getProfileData } from './action';
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEdit,
  FaUser,
  FaMapMarkerAlt,
  FaIdBadge,
  FaInfoCircle,
  FaRegAddressCard,
  FaGraduationCap,
  FaBriefcase,
  FaProjectDiagram
} from 'react-icons/fa';
import { Experience, Education } from '@/lib/types';
import { formatSlugToTitle } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 40%)`;
}

export default async  function ProfilePage() {
  const { profile, skills, projects, error } = await getProfileData();

  if (error || !profile) {
    return <p className="text-center mt-10 text-gray-600">{error || 'Profile not found.'}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaUser /> {profile.first_name} {profile.last_name}
        </h1>
        <a href="/signup" className="text-gray-600 hover:text-black">
          <FaEdit />
        </a>
      </div>

      <div className="text-gray-700 space-y-2">
        <p className="flex items-center gap-2"><FaIdBadge className="text-blue-500" /><strong>Username:</strong> {profile.username}</p>
        <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-green-500" /><strong>Country:</strong> {profile.country}</p>
        <p className="flex items-center gap-2"><FaRegAddressCard className="text-purple-500" /><strong>Pincode:</strong> {profile.pincode}</p>
        <p className="flex items-center gap-2"><FaInfoCircle className="text-orange-500" /><strong>Status:</strong> {profile.status}</p>
        <p><strong>Bio:</strong> {profile.bio}</p>
      </div>

      {(profile.personal_profiles?.github || profile.personal_profiles?.linkedin || profile.personal_profiles?.website) && (
        <div className="flex gap-4 text-xl mt-4">
          {profile.personal_profiles.github && (
            <a href={profile.personal_profiles.github} target="_blank" className="text-gray-700 hover:text-black"><FaGithub /></a>
          )}
          {profile.personal_profiles.linkedin && (
            <a href={profile.personal_profiles.linkedin} target="_blank" className="text-blue-700 hover:text-black"><FaLinkedin /></a>
          )}
          {profile.personal_profiles.website && (
            <a href={profile.personal_profiles.website} target="_blank" className="text-green-600 hover:text-black"><FaGlobe /></a>
          )}
        </div>
      )}

      { skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full text-white shadow"
              style={{ backgroundColor: stringToColor(skill?.name || '') }}
            >
              {formatSlugToTitle(skill?.name)}
            </span>
          ))}
        </div>
      )}

      {Array.isArray(projects) && projects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6 flex items-center gap-2 text-gray-800">
            <FaProjectDiagram className="text-teal-600" /> Projects
          </h2>
          <div className="grid gap-4 mt-2 grid-cols-1 overflow-auto">
            {projects.map((proj, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition  w-full max-w-full border-gray-100 border-2">
                <p className="font-semibold text-lg text-gray-900 truncate">Project Name: {proj.name}</p>
                Description
                <p className="text-sm text-gray-600 wrap-break-word">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(profile.experience) && profile.experience.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6 flex items-center gap-2 text-gray-800">
            <FaBriefcase className="text-indigo-600" /> Experience
          </h2>
          <div className="grid gap-4 mt-2">
            {profile.experience.map((exp: Experience, idx: number) => (
              <div key={idx} className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
                <p><strong>Employer:</strong> {exp.employer}</p>
                <p><strong>Role:</strong> {exp.role}</p>
                <p><strong>Period:</strong> {exp.start_date || exp.startDate} – {exp.endDate || exp.end_date}</p>
                <p><strong>Description:</strong> {exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(profile.education) && profile.education.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6 flex items-center gap-2 text-gray-800">
            <FaGraduationCap className="text-pink-600" /> Education
          </h2>
          <div className="space-y-4 mt-2">
            {profile.education.map((edu: Education, idx: number) => (
              <div key={idx} className="border-l-4 border-pink-500 p-4 bg-gray-50 rounded-md shadow">
                <p><strong>University:</strong> {edu.university}</p>
                <p><strong>Major:</strong> {edu.major}</p>
                <p><strong>Period:</strong> {edu.start_date} – {edu.end_date}</p>
                <p><strong>Description:</strong> {edu.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
