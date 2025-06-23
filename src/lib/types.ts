export interface Experience {
    employer: string;
    role: string;
    startDate: string;  // ISO date string
    endDate: string;    // ISO date string
    description: string;
  }
  
  /**
   * A single education entry
   */
  export interface Education {
    university: string;
    major: string;
    startDate: string;  // ISO date string
    endDate: string;    // ISO date string
    description: string;
  }



export interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    bio: string;
    status: 'Employed' | 'Student' | 'Looking For Employment' | 'Upskilling';
    country: string;
    pincode: string;
    skills?: string[];              // Array of skill IDs or names
    experience?: Experience[];     // Optional array of work experience
    education?: Education[];       // Optional array of education entries
  }

export type Skill = { id: string; name: string };


export type SkillFieldStateType = {
    selected: Skill[]
    error? : string
  }

export interface ProfileFormPageProps {
    initialData?: Record<string, any>;
    errors?: Record<string, string[]>;
  }


export interface ProfileFormState {
    errors?: Record<string, string[]>;
    values?: Record<string, any>;
  }

  export interface ExpEduFormProps {
    defaultExperience: any[];
    defaultEducation: any[];
  }


  export interface AlertProps {
    title? : string;
  description: string;
  messages: string[];
  duration?: number;
}


export interface ProjectFormState {
  errors?: Record<string, string[]>;
  values?: {
    name?: string;
    slug?: string;
    description?: string;
    github_url?: string;
    website_url?: string;
    status?: 'draft' | 'active' | 'completed';
    is_public?: boolean;
    category?: string;
    image_url?: string;
    skills?: { id: string; name: string }[] | string[];
  };
}

export interface ProjectFormPageProps {
  initialData?: Record<string, any>;
  errors: Record<string, string[]>;
}

export interface FileUploaderProps {
  name?: string;
  folder: string;
  onUpload?: (url: string) => void;
}

export type Project = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url?: string;
  github_url?: string;
  website_url?: string;
  status: string;
  skills: Skill[];
};
