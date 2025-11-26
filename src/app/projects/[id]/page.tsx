import { getProjectById } from "@/lib/queries";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { GrGithub } from "react-icons/gr";
import { Database } from "@/lib/database.types";
import { getSignedImageUrl } from "@/lib/storage";
import { formatSlugToTitle, stringToColor } from "@/lib/utils";
type Project = Database['public']['Tables']['projects']['Row'] & {
  skills: { id: string; name: string }[];
};

type Params = {
    id: string
}


export default async  function ViewProjectPage({params}: {params: Params}){
    const { id } = await params;
    const project: Project | null = await getProjectById(id, false);
    const signedImageUrl  = await getSignedImageUrl(project?.image_url || '');
    return(<div className="max-w-4xl mx-auto p-6 text-black mt-12">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 flex justify-center">
          <Image
            src={signedImageUrl || ""}
            alt={project?.name ?? ""}
            width={350}
            height={260}
            className="rounded-lg shadow-md object-cover w-full h-auto"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{project?.name}</h1>
          <p className="text-gray-600 mb-4">{project?.slug}</p>
          <Badge
            variant={
              project?.status === "published"
                ? "default"
                : project?.status === "draft"
                ? "secondary"
                : "destructive"
            }
            className="mb-4"
          >
            {project?.status.toUpperCase()}
          </Badge>
          <div className="flex gap-3">
            {project?.github_url && (
              <Button asChild variant="outline">
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <GrGithub className="w-4 h-4 mr-2" /> GitHub
                </a>
              </Button>
            )}

            {project?.website_url && (
              <Button asChild>
                <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" /> Website
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2 ">Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line wrap-break-word">
          {project?.description}
        </p>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Skills Used</h2>
        <div className="flex flex-wrap gap-2">
          {project?.skills?.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="text-sm py-1 px-3 text-white"  style={{ backgroundColor: stringToColor(skill.name) }} >
              {formatSlugToTitle(skill.name)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}