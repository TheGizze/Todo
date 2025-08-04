import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger/logger";


export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    logger.info({
        request: {
            method: req.method,
            url: req.url,
            userAgent: req.get('User-Agent'),
            ip: req.ip
        }
    }, 'Incoming request')

    const originalEnd = res.end;
    res.end = function(chunk: any, encoding?: any){
        const duration = Date.now() - start;

        logger.info({
            request:{
                method: req.method,
                url: req.url,
            },
            response:{
                statusCode: res.statusCode,
                duration: `${duration}ms`
            }
        }, 'RequestCompleted');
        
        return originalEnd.call(this, chunk, encoding);
    };

    next();
}