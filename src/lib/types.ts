export interface Experience {
    employer: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    start_date?: string;
    end_date?: string;

  }
  
  /**
   * A single education entry
   */
  export interface Education {
    university: string;
    major: string;
    startDate: string;
    endDate: string;
    description: string;
    start_date?: string;
    end_date?: string;
  }

  export interface ChatMessage {
  id: string;
  text: string;
  sender_id: string;
  chat_id: string;
  created_at: string;
  user?: {
    username: string;
  };
}

export interface Chat {
  id: string;
  user_id: string;
  user_owner_id: string;
  post_id: string | null;
  created_at: string;
  chat_type: 'incoming' | 'outgoing';
  name: string;
  messages: ChatMessage[];
  unread_count?: number;
  user?: {
    username: string;
  }
  owner?: {
    username: string;  
  }
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
    id? : string;
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
  display_image_url? :string
};

// types.ts or wherever you manage types

export interface PostingFormValues {
  id?: string;
  project_id: string;
  role_name: string;
  description: string;
  start_date: string;
  end_date: string;
  hours_required: number;
  mode_of_meeting: string;
  status: string;
  application_deadline?: string;
  skills: { id: string; name: string }[];
}

export interface PostingFormState {
  values: Partial<PostingFormValues>;
  errors?: Record<string, string[]>;
}

export interface PostingFormPageProps {
  initialData?: Partial<PostingFormValues>;
  errors?: Record<string, string[]>;
  projects: { id: string; name: string }[];
}


export interface Posting {
  id: string;
  user_id: string;
  project_id: string;
  role_name: string;
  description: string;
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
  hours_required: number;
  mode_of_meeting: 'remote' | 'in-person' | 'hybrid';
  status: 'open' | 'closed' | 'paused';
  application_deadline?: string | null;
  created_at: string;
  updated_at: string;
  skills: {
    id: string;
    name: string;
  }[];
}


export interface Message {
  id?: string;
  text?: string;
  sender_id?: string;
  created_at?: string;
  chat_id?: string;
  user?: {
    username: string;
  };  
}

