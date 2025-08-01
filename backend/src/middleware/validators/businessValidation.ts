import { z } from 'zod';
import { DataValidationError} from '../../errors/ValidationErrors';

export const validateData = <T extends z.ZodRawShape>(item: Partial<z.infer<z.ZodObject<T>>>, schema: z.ZodObject<T>) =>{
    const result = schema.safeParse(item);
    if(!result.success){;
        throw new DataValidationError(result.error);
    }
    return result.data;
}