import { z } from "zod";


export const requestListTitleSchema = z.object({
    title: z.any().refine((val) => val !== undefined, {
        message: "title"
    })
});