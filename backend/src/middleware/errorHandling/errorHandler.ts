import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) =>{
    const status = err?.status || 500;
    const message = err?.message || 'Internal server error';

    const error: any = {
            name: err?.name || 'Error',
            message
        }

    if(err?.missingValues) error.missingValues = err.missingValues;
    if(err?.violations) error.violations = err.violations;
    if(err?.fieldViolations) error.fieldViolations = err.fieldViolations;

    res.status(status).json({
        error
    });
}