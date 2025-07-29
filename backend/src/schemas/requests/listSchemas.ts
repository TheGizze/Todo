import { z } from "zod";


export const createListSchema = z.object({
    title: z.any().refine((val) => val !== undefined, {
        message: "title"
    })
});