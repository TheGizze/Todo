
import { z } from 'zod';
import { InvalidListNameError } from '../../errors/dataValidationErrors';
import { InvalidItemContentError } from '../../errors/dataValidationErrors';
import { ToDoItem } from '../../models/ToDoItem';

export const validateString = (str: string, schema: z.ZodType) => {
    const result = schema.safeParse(str)  
    if(!result.success){
        const issues = result.error.issues.map(issue => issue.message);
        throw new InvalidListNameError({'title': issues});
    }
}

export const validateItem = (item: Partial <ToDoItem>, schema: z.ZodObject) =>{
    const result = schema.safeParse(item);
    if(!result.success){
        const fieldErrors = z.flattenError(result.error).fieldErrors;
        throw new InvalidItemContentError('invalid item values', fieldErrors);
    }
}