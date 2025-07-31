import { z } from "zod";

export const listTitleSchema= z.string()
                .min(3, "Must be at least 3 characters long")
                .max(50, "Can't be longer than 50 characters")
                .trim()                           // Remove whitespace
                .nonempty("Title is required")    // Not empty after trim
                .regex(/^[a-zA-Z0-9 .,!?:;\-_'\(\)]+$/, "Only letters, numbers, spaces, and basic punctuation allowed")
