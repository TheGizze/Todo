import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../../errors/ValidationErrors';
import { parseFieldErrors } from '../errorHandling/errorParser';

export const validateRequest = (schema: z.ZodType) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if(!result.success){
            console.info(result.error);
            const fieldErrors  = z.flattenError(result.error).fieldErrors;
            const cleanedFieldErrors = parseFieldErrors(fieldErrors);
            throw new RequestValidationError(cleanedFieldErrors);
        }
        req.body = result.data;
        
        next();
    };
};