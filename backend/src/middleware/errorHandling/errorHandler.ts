import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger/logger";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) =>{
    const status = err?.status || 500;
    const message = err?.message || 'Internal server error';

    const error: any = {
            name: err?.name || 'Error',
            message
        }

    if(err?.violations) error.violations = err.violations;


        logger.error({
        err,
        request: {
            method: req.method,
            url: req.url,
            payload: req.body,
            ip: req.ip
        },
        statusCode: status
    }, 'Request error occurred');

    res.status(status).json({
        error
    });
}