import { z } from "zod";


export const TodoItemSchema = z.object({
    content: z.string()
                .min(2, "Must be at least 2 characters long")
                .max(120, "content too long")
                .trim()                           // Remove whitespace
                .nonempty("content is required")    // Not empty after trim
                .regex(/^[a-zA-Z0-9 .,!?:;\-_'\(\)]+$/, "Only letters, numbers, spaces, and basic punctuation allowed")
                .optional(),
    completed: z.boolean().optional()
});


export const ToDoListSchema = z.object({
    id: z.string().optional(),
    title: z.string({})
                .min(3, "Must be at least 3 characters long")
                .max(50, "Can't be longer than 50 characters")
                .trim()                           // Remove whitespace
                .nonempty("Title is required")    // Not empty after trim
                .regex(/^[a-zA-Z0-9 .,!?:;\-_'\(\)]+$/, "Only letters, numbers, spaces, and basic punctuation allowed"),
    items: z.array(TodoItemSchema).optional()})

