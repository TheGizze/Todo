import { z } from "zod";

export const listTitleSchema= z.string()
                .min(3, "Title too short")
                .max(50, "Title too long")
                .trim()                           // Remove whitespace
                .nonempty("Title is required")    // Not empty after trim
                .regex(/^[a-zA-Z0-9 .,!?:;\-_'\(\)]+$/, "Only letters, numbers, spaces, and basic punctuation allowed")
