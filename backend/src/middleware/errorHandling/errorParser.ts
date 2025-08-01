import { z } from 'zod';

export const parseFieldErrors = <T extends z.ZodRawShape>(fieldErrors: { [P in keyof z.core.$InferObjectOutput<T, {}>]?: string[]; }): Record<string, string[]> => {
    return Object.fromEntries(Object.entries(fieldErrors).filter(([key, value]) => value !== undefined)) as Record<string, string[]>;
}