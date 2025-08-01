import { z } from 'zod';
import { DataValidationError} from '../../errors/ValidationErrors';
import { parseFieldErrors } from '../errorHandling/errorParser';

export const validateData = <T extends z.ZodRawShape>(item: Partial<z.infer<z.ZodObject<T>>>, schema: z.ZodObject<T>) =>{
    const result = schema.safeParse(item);
    if(!result.success){
        const fieldErrors  = z.flattenError(result.error).fieldErrors;
        const cleanedFieldErrors = parseFieldErrors(fieldErrors);
        throw new DataValidationError(cleanedFieldErrors);
    }
    return result.data;
}