
export class InvalidItemContentError extends Error {
    status: number;
    fieldViolations: { [x: string]: string[] | undefined };

    constructor(message: string, fieldViolations: { [x: string]: string[] | undefined }){
        super(message);
        this.name = 'InvalidItemContentError';
        this.status = 400;
        this.fieldViolations = fieldViolations;
    }
}

export class InvalidListNameError extends Error {
    status: number;
    violations: string[];

    constructor(message: string, violations: string[]){
        super(message);
        this.name = 'InvalidListNameError';
        this.status = 400;
        this.violations = violations;
    }
}