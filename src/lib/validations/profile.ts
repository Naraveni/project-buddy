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
  first_name:  z.string().trim().min(1, "First name is required"),
  last_name:   z.string().trim().min(1, "Last name is required"),
  username:    z.string().trim().min(1, "Username is required"),
  bio:         z.string().trim().min(1, "Bio is required"),
  status:      z.enum(["Employed", "Student", "Looking For Employment", "Upskilling"]),
  country:     z.string().trim().min(1, "Country is required"),
  pincode:     z.string().trim().regex(/^[0-9]{5}$/, "Pincode must be 5 digits"),

  experience: z.array(expSchema).optional(),
  education:  z.array(eduSchema).optional(),
});
