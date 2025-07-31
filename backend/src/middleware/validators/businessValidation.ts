
import { z } from 'zod';
import { InvalidListNameError } from '../../errors/dataValidationErrors';
import { DataValidationError } from '../../errors/dataValidationErrors';
import { ToDoItem } from '../../models/ToDoItem';

export const validateString = (str: string, schema: z.ZodType) => {
    const result = schema.safeParse(str)  
    if(!result.success){
        const issues = result.error.issues.map(issue => issue.message);
        throw new InvalidListNameError({'title': issues});
    }
}

export const validateData = <T extends z.ZodRawShape>(item: Partial<z.infer<z.ZodObject<T>>>, schema: z.ZodObject<T>) =>{
    const result = schema.safeParse(item);
    if(!result.success){
        const fieldErrors  = z.flattenError(result.error).fieldErrors;

        // Convert { [x: string]: string[] | undefined } to Record<string, string[]>
        const cleanedFieldErrors: Record<string, string[]> = Object.fromEntries(
            Object.entries(fieldErrors).filter(([key, value]) => value !== undefined)
        ) as Record<string, string[]>;

        console.info(fieldErrors);
        throw new DataValidationError(cleanedFieldErrors);
    }
}