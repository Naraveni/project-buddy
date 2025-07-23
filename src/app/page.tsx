import { Button } from "@/components/ui/button";
import Image from "next/image";
import collabImage from "@/../public/LandingPage/Collab.png";
import Link from "next/link";
import {
  CodeIcon,
  StarIcon,
  MessageSquareIcon,
} from "lucide-react";

const features = [
  {
    icon: <CodeIcon className="w-8 h-8 text-blue-500" />,
    title: "Discover Projects",
    description: "Explore a variety of projects seeking collaborators",
  },
  {
    icon: <StarIcon className="w-8 h-8 text-blue-500" />,
    title: "Showcase Your Skills",
    description: "Highlight your expertise and find relevant projects",
  },
  {
    icon: <MessageSquareIcon className="w-8 h-8 text-blue-500" />,
    title: "Communicate & Collaborate",
    description: "Chat with other users and work together seamlessly",
  },
];

const welcome: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-black via-black to-indigo-950 text-white h-[calc(100vh-44px)] px-6 py-12 flex flex-col items-center justify-center">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1e3a8a_0%,transparent_30%)]" />
        
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 max-w-6xl w-full">
        
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-400">
            Find Collaborators for Your Projects
          </h1>
          <p className="text-gray-300 mb-6">
            Connect with people to work together on exciting ideas and build something great.
          </p>
          <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
          </Link>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src={collabImage}
            alt="People collaborating"
            width={500}
            height={400}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-center text-center"
          >
            {feature.icon}
            <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default welcome;
