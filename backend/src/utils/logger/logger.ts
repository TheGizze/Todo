import pino from 'pino';


const createLogger = () => {
    const isDev = process.env.NODE_ENV === 'DEV';
    const isTest = process.env.NODE_ENV === 'TEST'

    return pino({
        level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
        
        // Pretty output for development
        transport: isDev ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'dd-mm-yyyy HH:MM:ss'
            }
        } : undefined,
    
        // Disable in tests unless explicitly needed
        enabled: !isTest,
    
        // Add application context
        base: {
        env: process.env.NODE_ENV,
        version: process.env.npm_package_version
        }
    });
}

export const logger = createLogger();