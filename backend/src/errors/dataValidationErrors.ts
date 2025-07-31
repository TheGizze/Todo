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

/*     status: number;
    fieldViolations: { [x: string]: string[] | undefined };

    constructor(message: string, fieldViolations: { [x: string]: string[] | undefined }){
        super(message);
        this.name = 'InvalidItemContentError';
        this.status = 400;
        this.fieldViolations = fieldViolations;
    } */
}


export class InvalidListNameError extends BaseValidationError{
    status = 400;
    violations: Record<string, string[]>;

    constructor(violations: Record<string, string[]>){
        super('Invalid list name')
        this.violations = violations
    }
}