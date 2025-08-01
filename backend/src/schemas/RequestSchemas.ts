import { z } from "zod";


export const listTitleSchema = z.object({
    title: z.any().refine((val) => val !== undefined, {
        message: "Required"
    })
});

export const itemContentSchema = z.object({
    content: z.any().refine((val) => val !== undefined, {
        message: "Required"
    })
});

export const itemUpdateSchema = z.object({
    content: z.any().optional(),
    completed: z.any().optional()
}).refine((data) => data.content || data.completed, {
    message: "At least one of 'content' or 'completed' is required.",
    path: ["_global"]
}); 