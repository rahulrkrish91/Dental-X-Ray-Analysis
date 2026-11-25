/**
 * Structured Logger with PII Redaction
 * Production-ready logging with context enrichment
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogContext {
    requestId?: string;
    userId?: string;
    sessionId?: string;
    operation?: string;
    durationMs?: number;
    [key: string]: unknown;
}
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: {
        name: string;
        message: string;
        stack?: string;
        code?: string;
    };
}
/**
 * Redact PII from string
 */
export declare function redactPII(text: string): string;
/**
 * Logger instance
 */
export declare const logger: {
    debug: (message: string, context?: LogContext) => void;
    info: (message: string, context?: LogContext) => void;
    warn: (message: string, context?: LogContext) => void;
    error: (message: string, context?: LogContext, error?: Error) => void;
    /**
     * Create child logger with bound context
     */
    child: (context: LogContext) => {
        debug: (message: string, extra?: LogContext) => void;
        info: (message: string, extra?: LogContext) => void;
        warn: (message: string, extra?: LogContext) => void;
        error: (message: string, extra?: LogContext, error?: Error) => void;
    };
    /**
     * Log with timing
     */
    time: (operation: string, context?: LogContext) => {
        end: (message: string, extra?: LogContext) => void;
        endError: (message: string, error: Error, extra?: LogContext) => void;
    };
};
/**
 * Express middleware for request logging
 */
import { Request, Response, NextFunction } from 'express';
export declare function requestLogger(): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Error logging helper
 */
export declare function logError(operation: string, error: Error, context?: LogContext): void;
/**
 * Audit log for sensitive operations
 */
export declare function auditLog(action: string, context: LogContext & {
    userId: string;
    resource: string;
    resourceId: string;
}): void;
//# sourceMappingURL=logger.d.ts.map