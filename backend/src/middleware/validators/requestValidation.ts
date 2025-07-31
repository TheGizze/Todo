import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { MissingValuesError } from '../../errors/requestValidationErrors';

export const validateRequest = (schema: z.ZodType) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        console.info("post was called");
        if(!result.success){
            const issues = result.error.issues.map(issue => issue.message);

            throw new MissingValuesError('request body missing values', issues);
        }
        req.body = result.data;
        
        next();
    };
};

export const validateUpdateItemRequest = (schema: z.ZodType) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        console.info("patch was called");
        if(!result.success){
            const issues = result.error.issues.map(issue => issue.message);
            throw new MissingValuesError('At least One field required', issues);
        }
        req.body = result.data;
        next();
    };
};