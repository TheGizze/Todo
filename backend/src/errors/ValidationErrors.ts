import { z } from 'zod';
import { parseFieldErrors } from '../middleware/errorHandling/errorParser';
abstract class BaseValidationError extends Error {
    abstract status: number;
    violations: Record<string, string[]>;

    constructor(message: string, errors: Record <string, string[]> | z.ZodError<any>){
        super(message);
        this.name = this.constructor.name;
        
        if (errors instanceof z.ZodError){
            const fieldErrors = z.flattenError(errors).fieldErrors;
            this.violations = parseFieldErrors(fieldErrors);
        }else{
            this.violations = errors;
        }
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class DataValidationError extends BaseValidationError {
    status = 400;

    constructor(violations: Record<string, string[]> | z.ZodError<any>){
        super('Data validation failed', violations);
    }
}

export class RequestValidationError extends BaseValidationError {
    status = 400;

    constructor(violations: Record<string, string[]> | z.ZodError<any>){
        super('Request validation failed', violations);
    }
}