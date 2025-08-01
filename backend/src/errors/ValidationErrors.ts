abstract class BaseValidationError extends Error {
    abstract status: number;
    abstract violations: Record <string, string[]>;

    constructor(message: string){
        super(message);
        this.name = this.constructor.name;
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class DataValidationError extends BaseValidationError {
    status = 400;
    violations: Record<string, string[]>;

    constructor(violations: Record<string, string[]>){
        super('Data validation failed');
        this.violations = violations;
    }
}

export class RequestValidationError extends BaseValidationError {
    status = 400;
    violations: Record<string, string[]>;

    constructor(violations: Record<string, string[]>){
        super('Request validation failed');
        this.violations = violations;
    }
}