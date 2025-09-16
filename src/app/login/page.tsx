"use client";
import { createClient } from "@/utils/supabase/supabase-client";
import { AUTH_PROVIDERS } from "@/utils/constants";
import type { Provider } from "@supabase/auth-js";
import Image from "next/image";
import googleIcon from "@/../public/LoginPage/google.png";
import githubIcon from "@/../public/LoginPage/github.jpeg";
import linkedinIcon from "@/../public/LoginPage/linkedin.webp";
import { useToast } from "@/components/useToast";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const supabaseClient = createClient();
const OAUTH_REDIRECT_URI = process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || "";

const ICONS: Record<string, React.ReactElement> = {
  google: (
    <Image
      src={googleIcon}
      alt="Google"
      width={24}
      height={24}
      style={{ backgroundColor: "white" }}
    />
  ),
  github: (
    <Image
      src={githubIcon}
      alt="GitHub"
      width={24}
      height={24}
      style={{ backgroundColor: "white" }}
    />
  ),
  linkedin: (
    <Image
      src={linkedinIcon}
      alt="LinkedIn"
      width={24}
      height={24}
      style={{ backgroundColor: "#0A66C2" }}
    />
  ),
};

const SignUpPage: React.FC = () => {
  const search = useSearchParams();
  const router = useRouter();
  const flash = search.get("flash");
  const { toast } = useToast();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (flash) {
      toast({
        title: flash,
        variant: "destructive",
      });
    }
  }, [flash, toast]);
  useEffect(() => {
    const checkProfile = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (user) {
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (profile) {
          router.replace("/dashboard");
        }
      }

      setChecking(false);
    };

    checkProfile();
  }, [router]);

  const handleOAuthLogin = async (provider: Provider) => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: OAUTH_REDIRECT_URI,
      },
    });

    if (error) {
      console.error("OAuth Login Error:", error.message);
    }
  };

  if (checking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-indigo-950 text-white flex flex-col items-center justify-center px-4 py-10 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-400">
          Sign up to get started
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
          Ideas are waiting to be implemented. This might be the first step of
          your billion-dollar journey.
        </p>
      </div>

      <div className="flex flex-col space-y-4 w-full max-w-sm">
        {AUTH_PROVIDERS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleOAuthLogin(p.id as Provider)}
            className="flex items-center justify-center space-x-3 text-black bg-amber-50 hover:bg-cyan-200 px-6 py-3 rounded text-sm sm:text-base"
          >
            {ICONS[p.id]}
            <span>Continue with {p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SignUpPage;
