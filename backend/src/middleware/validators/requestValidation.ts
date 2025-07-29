import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { MissingValuesError } from '../../errors/requestValidationErrors';

export const validateRequest = (schema: ZodSchema) => {
    return (_req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(_req.body);

        if(!result.success){
            const issues = result.error.issues.map(issue => issue.message);

            throw new MissingValuesError('request body missing values', issues);
        }
        _req.body = result.data;
        
        next();
    };
};