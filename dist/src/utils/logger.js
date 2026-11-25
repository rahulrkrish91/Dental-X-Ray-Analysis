/**
 * Structured Logger with PII Redaction
 * Production-ready logging with context enrichment
 */
import { getConfig } from '../config/index.js';
/**
 * PII patterns to redact
 * Order matters - more specific patterns first
 */
const PII_PATTERNS = [
    // Email
    { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[EMAIL]' },
    // Phone numbers (various formats)
    { pattern: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: '[PHONE]' },
    // Credit card (basic)
    { pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: '[CARD]' },
    // JWT tokens (before generic token pattern)
    { pattern: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, replacement: '[JWT]' },
    // Base64 encoded data (long strings) - before generic token
    { pattern: /\b[A-Za-z0-9+/]{100,}={0,2}\b/g, replacement: '[BASE64]' },
    // API keys / tokens (generic, after specific ones)
    { pattern: /\b[A-Za-z0-9_-]{32,}\b/g, replacement: '[TOKEN]' },
    // Patient IDs / MRNs
    { pattern: /\b(?:patient|mrn|id)[\s:]*([A-Za-z0-9-]{6,})\b/gi, replacement: '[PATIENT_ID]' },
    // Names (two capitalized words) - not at start of string or after sentence end
    { pattern: /(?<!^)(?<![.!?]\s)[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, replacement: '[NAME]' }
];
/**
 * Redact PII from string
 */
export function redactPII(text) {
    let redacted = text;
    for (const { pattern, replacement } of PII_PATTERNS) {
        redacted = redacted.replace(pattern, replacement);
    }
    return redacted;
}
/**
 * Redact PII from object recursively
 */
function redactObject(obj) {
    if (obj === null || obj === undefined)
        return obj;
    if (typeof obj === 'string')
        return redactPII(obj);
    if (typeof obj === 'number' || typeof obj === 'boolean')
        return obj;
    if (Array.isArray(obj))
        return obj.map(redactObject);
    if (typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            // Skip sensitive keys entirely
            if (/^(password|secret|token|key|auth|credential|ssn|dob|address|phone|email)$/i.test(key)) {
                result[key] = '[REDACTED]';
            }
            else {
                result[key] = redactObject(value);
            }
        }
        return result;
    }
    return obj;
}
let config = null;
function getLogConfig() {
    if (!config) {
        try {
            config = getConfig();
        }
        catch {
            // Config not loaded yet, use defaults
            config = {
                LOG_LEVEL: 'info',
                LOG_FORMAT: 'pretty'
            };
        }
    }
    return config;
}
/**
 * Check if log level should be output
 */
function shouldLog(level) {
    const cfg = getLogConfig();
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(cfg.LOG_LEVEL ?? 'info');
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= configLevelIndex;
}
/**
 * Format log entry for output
 */
function formatEntry(entry) {
    const cfg = getLogConfig();
    const logFormat = cfg.LOG_FORMAT ?? 'pretty';
    if (logFormat === 'json') {
        return JSON.stringify(entry);
    }
    // Pretty format
    const time = new Date(entry.timestamp).toLocaleTimeString();
    const level = entry.level.toUpperCase().padEnd(5);
    const ctx = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const err = entry.error ? `\n  Error: ${entry.error.name}: ${entry.error.message}${entry.error.stack ? `\n  Stack: ${entry.error.stack}` : ''}` : '';
    return `${time} [${level}] ${entry.message}${ctx}${err}`;
}
/**
 * Core logging function
 */
function log(level, message, context, error) {
    if (!shouldLog(level))
        return;
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message: redactPII(message),
        context: context ? redactObject(context) : undefined,
        error: error ? {
            name: error.name,
            message: redactPII(error.message),
            stack: error.stack ? redactPII(error.stack) : undefined,
            code: error.code
        } : undefined
    };
    const formatted = formatEntry(entry);
    if (level === 'error' || level === 'warn') {
        console.error(formatted);
    }
    else {
        console.log(formatted);
    }
}
/**
 * Logger instance
 */
export const logger = {
    debug: (message, context) => log('debug', message, context),
    info: (message, context) => log('info', message, context),
    warn: (message, context) => log('warn', message, context),
    error: (message, context, error) => log('error', message, context, error),
    /**
     * Create child logger with bound context
     */
    child: (context) => ({
        debug: (message, extra) => log('debug', message, { ...context, ...extra }),
        info: (message, extra) => log('info', message, { ...context, ...extra }),
        warn: (message, extra) => log('warn', message, { ...context, ...extra }),
        error: (message, extra, error) => log('error', message, { ...context, ...extra }, error)
    }),
    /**
     * Log with timing
     */
    time: (operation, context) => {
        const start = Date.now();
        return {
            end: (message, extra) => {
                const durationMs = Date.now() - start;
                log('info', message, { ...context, ...extra, operation, durationMs });
            },
            endError: (message, error, extra) => {
                const durationMs = Date.now() - start;
                log('error', message, { ...context, ...extra, operation, durationMs }, error);
            }
        };
    }
};
export function requestLogger() {
    return (req, res, next) => {
        const start = Date.now();
        const requestId = req.headers['x-request-id'] || crypto.randomUUID();
        // Add requestId to response header
        res.setHeader('x-request-id', requestId);
        // Log request
        logger.info('Request started', {
            requestId,
            method: req.method,
            path: req.path,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        // Log response on finish
        res.on('finish', () => {
            const durationMs = Date.now() - start;
            logger.info('Request completed', {
                requestId,
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                durationMs
            });
        });
        next();
    };
}
/**
 * Error logging helper
 */
export function logError(operation, error, context) {
    logger.error(`${operation} failed`, { operation, ...context }, error);
}
/**
 * Audit log for sensitive operations
 */
export function auditLog(action, context) {
    logger.info(`AUDIT: ${action}`, {
        ...context,
        audit: true,
        action
    });
}
//# sourceMappingURL=logger.js.map