import { z } from 'zod';

export const postingSchema = z.object({
  id: z.string().uuid().optional(),
  project_id: z.string().uuid(),
  role_name: z.string().min(5, 'Role name is too short'),
  description: z.string().min(20, 'Description is too short'),
  start_date: z.string().date(),
  end_date: z.string().date(),
  hours_required: z.coerce.number().int().min(1),
  mode_of_meeting: z.enum(['remote','in-person','hybrid']),
  status: z.enum(['open','closed','paused']),
  application_deadline: z.string(),
  skills: z.array(z.object({ id: z.string(), name: z.string() })).min(1,'Atleast one skills is required'),
}).superRefine((data, ctx) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    if (start >= end) {
      ctx.addIssue({
        code: 'custom',
        path: ['start_date'],
        message: 'Start date must be before end date',
      });
    }

    if (data.application_deadline) {
      const deadline = new Date(data.application_deadline);
      if (deadline > start) {
        ctx.addIssue({
          code: 'custom',
          path: ['application_deadline'],
          message: 'Application deadline must be before the start date',
        });
      }
    }
  });