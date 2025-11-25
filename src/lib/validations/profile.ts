// lib/validations/profile.ts
import { z } from "zod";

const dateString = z
  .string().trim()
  .refine((s) => !isNaN(Date.parse(s)), { message: "Invalid date format" });

const expSchema = z
  .object({
    employer:    z.string().trim().min(1, "Employer is required"),
    role:        z.string().trim().min(1, "Role is required"),
    startDate:   dateString,
    endDate:     dateString,
    description: z.string().trim().min(1, "Description is required"),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  });

const eduSchema = z
  .object({
    university:  z.string().trim().min(1, "University is required"),
    major:       z.string().trim().min(1, "Major is required"),
    startDate:   dateString,
    endDate:     dateString,
    description: z.string().trim().min(1, "Description is required"),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "End date must be after or equal to start date",
    path: ["endDate"],
  });

export const profileSchema = z.object({
  first_name: z
  .string()
  .trim()
  .min(1, "First name is required")
  .max(20, "First name cannot exceed 20 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),

last_name: z
  .string()
  .trim()
  .min(1, "Last name is required")
  .max(20, "First name cannot exceed 20 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),

username: z
  .string()
  .trim()
  .min(6, "Username must be at least 6 characters")
  .max(13, "Username cannot exceed 13 characters")
  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "Only letters, numbers, and underscores allowed"),

bio: z
  .string()
  .trim()
  .min(10, "Bio must be at least 10 characters")
  .max(500, "Bio cannot exceed 500 characters"),

status: z.enum(["Employed", "Student", "Looking For Employment", "Upskilling"]),

country: z
  .string()
  .trim()
  .min(2, "Country name is too short")
  .max(56, "Country name is too long")
  .regex(/^[a-zA-Z\s'-]+$/, "Country contains invalid characters"),

pincode: z
  .string()
  .trim()
  .regex(/^[0-9]{4,10}$/, "Pincode must be exactly between 4 or 10 digits"),


  experience: z.array(expSchema).optional(),
  education:  z.array(eduSchema).optional(),
});
