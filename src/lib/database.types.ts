export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blog_comments: {
        Row: {
          blog_id: string | null
          created_at: string | null
          id: string
          response: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          blog_id?: string | null
          created_at?: string | null
          id?: string
          response?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          blog_id?: string | null
          created_at?: string | null
          id?: string
          response?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          blog_id: string
          created_at: string
          tag_id: string
          updated_at: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          tag_id: string
          updated_at?: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          tag_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_tags_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          category: Database["public"]["Enums"]["blog_category"]
          content: string | null
          created_at: string
          id: string
          slug: string
          status: Database["public"]["Enums"]["blog_status"]
          summary: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["blog_category"]
          content?: string | null
          created_at?: string
          id?: string
          slug: string
          status?: Database["public"]["Enums"]["blog_status"]
          summary: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["blog_category"]
          content?: string | null
          created_at?: string
          id?: string
          slug?: string
          status?: Database["public"]["Enums"]["blog_status"]
          summary?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          chat_id: string | null
          id: string
          last_seen_at: string | null
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          id?: string
          last_seen_at?: string | null
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          id?: string
          last_seen_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string | null
          id: string
          name: string
          post_id: string | null
          user_id: string | null
          user_owner_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          post_id?: string | null
          user_id?: string | null
          user_owner_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          post_id?: string | null
          user_id?: string | null
          user_owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_user_owner_id_fkey"
            columns: ["user_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_drafts: {
        Row: {
          created_at: string | null
          data: Json | null
          errors: Json | null
          form_type: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          errors?: Json | null
          form_type?: string | null
          id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          errors?: Json | null
          form_type?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string | null
          created_at: string
          id: string
          sender_id: string | null
          text: string
        }
        Insert: {
          chat_id?: string | null
          created_at?: string
          id?: string
          sender_id?: string | null
          text: string
        }
        Update: {
          chat_id?: string | null
          created_at?: string
          id?: string
          sender_id?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posting_skills: {
        Row: {
          posting_id: string
          skill_id: string
        }
        Insert: {
          posting_id: string
          skill_id: string
        }
        Update: {
          posting_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posting_skills_posting_id_fkey"
            columns: ["posting_id"]
            isOneToOne: false
            referencedRelation: "postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posting_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      postings: {
        Row: {
          application_deadline: string | null
          created_at: string
          description: string
          end_date: string
          hours_required: number
          id: string
          mode_of_meeting: Database["public"]["Enums"]["meeting_mode"]
          project_id: string | null
          role_name: string
          start_date: string
          status: Database["public"]["Enums"]["posting_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string
          description: string
          end_date: string
          hours_required: number
          id?: string
          mode_of_meeting: Database["public"]["Enums"]["meeting_mode"]
          project_id?: string | null
          role_name: string
          start_date: string
          status: Database["public"]["Enums"]["posting_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          application_deadline?: string | null
          created_at?: string
          description?: string
          end_date?: string
          hours_required?: number
          id?: string
          mode_of_meeting?: Database["public"]["Enums"]["meeting_mode"]
          project_id?: string | null
          role_name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["posting_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "postings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_skills: {
        Row: {
          profile_id: string
          skill_id: string
          updated_at: string | null
        }
        Insert: {
          profile_id: string
          skill_id: string
          updated_at?: string | null
        }
        Update: {
          profile_id?: string
          skill_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string
          country: string
          created_at: string | null
          education: Json | null
          experience: Json | null
          first_name: string
          id: string
          last_name: string
          personal_profiles: Json | null
          pincode: string
          status: Database["public"]["Enums"]["status_type"]
          updated_at: string | null
          username: string
        }
        Insert: {
          bio: string
          country: string
          created_at?: string | null
          education?: Json | null
          experience?: Json | null
          first_name: string
          id: string
          last_name: string
          personal_profiles?: Json | null
          pincode: string
          status: Database["public"]["Enums"]["status_type"]
          updated_at?: string | null
          username: string
        }
        Update: {
          bio?: string
          country?: string
          created_at?: string | null
          education?: Json | null
          experience?: Json | null
          first_name?: string
          id?: string
          last_name?: string
          personal_profiles?: Json | null
          pincode?: string
          status?: Database["public"]["Enums"]["status_type"]
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      project_skills: {
        Row: {
          project_id: string
          skill_id: string
        }
        Insert: {
          project_id: string
          skill_id: string
        }
        Update: {
          project_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          description: string
          github_url: string | null
          id: string
          image_url: string | null
          is_public: boolean
          name: string
          slug: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean
          name: string
          slug?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_public?: boolean
          name?: string
          slug?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          blog_id: string | null
          created_at: string
          id: string
          response: Database["public"]["Enums"]["blog_reaction_type"][]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          blog_id?: string | null
          created_at?: string
          id?: string
          response: Database["public"]["Enums"]["blog_reaction_type"][]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          blog_id?: string | null
          created_at?: string
          id?: string
          response?: Database["public"]["Enums"]["blog_reaction_type"][]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reactions_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_reaction_counts: {
        Args: { blog_id_param: string }
        Returns: Json
      }
    }
    Enums: {
      blog_category:
        | "frontend"
        | "backend"
        | "devops"
        | "deployment"
        | "design"
        | "ai"
        | "product"
        | "collaboration"
        | "career"
        | "other"
      blog_reaction_type:
        | "helpful"
        | "informative"
        | "solved_my_issue"
        | "daily_read"
        | "inspiring"
        | "well_written"
        | "thought_provoking"
        | "entertaining"
        | "supportive"
        | "actionable"
      blog_status: "draft" | "published"
      employment_status:
        | "student"
        | "employed"
        | "looking_for_employment"
        | "upskilling"
      meeting_mode: "in-person" | "remote" | "hybrid"
      posting_status: "open" | "closed" | "paused"
      project_status: "draft" | "published" | "archived"
      status_type:
        | "Employed"
        | "Student"
        | "Looking For Employment"
        | "Upskilling"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blog_category: [
        "frontend",
        "backend",
        "devops",
        "deployment",
        "design",
        "ai",
        "product",
        "collaboration",
        "career",
        "other",
      ],
      blog_reaction_type: [
        "helpful",
        "informative",
        "solved_my_issue",
        "daily_read",
        "inspiring",
        "well_written",
        "thought_provoking",
        "entertaining",
        "supportive",
        "actionable",
      ],
      blog_status: ["draft", "published"],
      employment_status: [
        "student",
        "employed",
        "looking_for_employment",
        "upskilling",
      ],
      meeting_mode: ["in-person", "remote", "hybrid"],
      posting_status: ["open", "closed", "paused"],
      project_status: ["draft", "published", "archived"],
      status_type: [
        "Employed",
        "Student",
        "Looking For Employment",
        "Upskilling",
      ],
    },
  },
} as const
