import { z } from 'zod';


export const listItemSchema = z.object({
    content: z.string()
                .min(2, "Must be at least 2 characters long")
                .max(120, "content too long")
                .trim()                           // Remove whitespace
                .nonempty("content is required")    // Not empty after trim
                .regex(/^[a-zA-Z0-9 .,!?:;\-_'\(\)]+$/, "Only letters, numbers, spaces, and basic punctuation allowed")
                .optional(),
    completed: z.boolean().optional()
});