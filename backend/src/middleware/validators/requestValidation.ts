import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../../errors/ValidationErrors';

export const validateRequest = (schema: z.ZodType) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if(!result.success){
            throw new RequestValidationError(result.error);
        }
        req.body = result.data;
        
        next();
    };
};