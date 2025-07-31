import { z } from "zod";


export const requesItemContentSchema = z.object({
    content: z.any().refine((val) => val !== undefined, {
        message: "content"
    })
});

const ItemUpdateSchema = z.object({
    content: z.any().optional(),
    completed: z.any().optional()
});

export const requestItemUpdateSchema = ItemUpdateSchema.superRefine((data, ctx) => {
    const optionalFields = ['content', 'completed'] as const;
    const hasAtLeastOne = optionalFields.some(field => field in data);
    console.info(hasAtLeastOne);

  if (!hasAtLeastOne) {
    optionalFields.forEach(field => {
      ctx.addIssue({
        code: "custom",
        message: field
      });
    });
  }
});