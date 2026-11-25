/**
 * NVIDIA NIM API Client
 * Shared base client for vision and reasoning models
 */
import { getConfig } from '../config/index.js';
/**
 * Custom error classes for different failure modes
 */
export class NIMError extends Error {
    statusCode;
    code;
    retryable;
    originalError;
    constructor(message, statusCode, code, retryable, originalError) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.retryable = retryable;
        this.originalError = originalError;
        this.name = 'NIMError';
    }
}
export class NIMTimeoutError extends NIMError {
    constructor(timeoutMs, originalError) {
        super(`Request timed out after ${timeoutMs}ms`, 504, 'TIMEOUT', true, originalError);
        this.name = 'NIMTimeoutError';
    }
}
export class NIMAuthError extends NIMError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTH_ERROR', false);
        this.name = 'NIMAuthError';
    }
}
export class NIMRateLimitError extends NIMError {
    constructor(retryAfterMs) {
        super('Rate limit exceeded', 429, 'RATE_LIMIT', true);
        this.name = 'NIMRateLimitError';
        this.retryAfterMs = retryAfterMs;
    }
    retryAfterMs;
}
export class NIMServerError extends NIMError {
    constructor(statusCode, message) {
        super(message, statusCode, 'SERVER_ERROR', statusCode >= 500);
        this.name = 'NIMServerError';
    }
}
/**
 * Base NIM Client with retry logic, timeout handling, and error classification
 */
export class NIMClient {
    apiKey;
    baseUrl;
    defaultTimeout;
    maxRetries;
    constructor(apiKey, baseUrl, defaultTimeout = 60000, maxRetries = 2) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replace(/\/+$/, '');
        this.defaultTimeout = defaultTimeout;
        this.maxRetries = maxRetries;
    }
    /**
     * Create client from environment config
     */
    static fromConfig() {
        const config = getConfig();
        return new NIMClient(config.NVIDIA_API_KEY, config.NVIDIA_API_BASE_URL, config.VISION_API_TIMEOUT_MS, config.VISION_MAX_RETRIES);
    }
    /**
     * Make a chat completion request with retry logic
     */
    async chatCompletion(options) {
        const timeout = options.timeout_ms ?? this.defaultTimeout;
        const maxRetries = options.max_tokens ? this.maxRetries : this.maxRetries;
        let lastError = null;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            try {
                const response = await fetch(`${this.baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        model: options.model,
                        messages: options.messages,
                        temperature: options.temperature ?? 0.6,
                        top_p: options.top_p ?? 0.95,
                        max_tokens: options.max_tokens ?? 4096,
                        stream: options.stream ?? false,
                        reasoning_budget: options.reasoning_budget
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                // Handle HTTP errors
                if (!response.ok) {
                    const error = await this.handleHttpError(response, attempt, maxRetries);
                    if (error) {
                        lastError = error;
                        if (error.retryable && attempt < maxRetries) {
                            await this.delay(attempt);
                            continue;
                        }
                        throw error;
                    }
                }
                const data = await response.json();
                // Validate response structure
                if (!data.choices || data.choices.length === 0) {
                    throw new NIMError('Empty choices in response', 502, 'EMPTY_RESPONSE', true);
                }
                return data;
            }
            catch (error) {
                clearTimeout(timeoutId);
                lastError = error;
                // If timeout caused abort, wrap in NIMTimeoutError
                if (error instanceof DOMException && error.name === 'AbortError') {
                    throw new NIMTimeoutError(timeout, error);
                }
                // Don't retry non-retryable errors
                if (error instanceof NIMError && !error.retryable) {
                    throw error;
                }
                // Don't retry on last attempt
                if (attempt >= maxRetries) {
                    break;
                }
                // Check if error is retryable
                const retryable = this.isRetryableError(error);
                if (!retryable) {
                    throw error;
                }
                await this.delay(attempt);
            }
        }
        throw lastError || new NIMError('Request failed after retries', 502, 'MAX_RETRIES_EXCEEDED', false);
    }
    /**
     * Handle HTTP error responses
     */
    async handleHttpError(response, attempt, maxRetries) {
        let errorMessage = `API error: ${response.status}`;
        let errorCode = 'API_ERROR';
        try {
            const errorData = await response.json();
            errorMessage = errorData.error?.message || errorMessage;
            errorCode = errorData.error?.code || errorCode;
        }
        catch {
            // Ignore JSON parse errors, use status text
            errorMessage = `${response.status} ${response.statusText}`;
        }
        switch (response.status) {
            case 401:
                return new NIMAuthError(errorMessage);
            case 429: {
                const retryAfter = response.headers.get('retry-after');
                const retryAfterMs = retryAfter ? parseInt(retryAfter) * 1000 : undefined;
                return new NIMRateLimitError(retryAfterMs);
            }
            case 400:
                return new NIMError(errorMessage, 400, 'BAD_REQUEST', false);
            case 404:
                return new NIMError('Model not found', 404, 'MODEL_NOT_FOUND', false);
            case 500:
            case 502:
            case 503:
            case 504:
                return new NIMServerError(response.status, errorMessage);
            default:
                return new NIMError(errorMessage, response.status, errorCode, response.status >= 500);
        }
    }
    /**
     * Check if an error is retryable
     */
    isRetryableError(error) {
        if (error instanceof NIMError) {
            return error.retryable;
        }
        if (error instanceof DOMException && error.name === 'AbortError') {
            return true;
        }
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return true; // Network errors
        }
        return false;
    }
    /**
     * Exponential backoff with jitter
     */
    async delay(attempt) {
        const baseDelay = Math.pow(2, attempt) * 1000;
        const jitter = Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
    }
    /**
     * Health check - simple model availability test
     */
    async healthCheck(model) {
        const start = Date.now();
        try {
            await this.chatCompletion({
                model,
                messages: [{ role: 'user', content: 'ping' }],
                max_tokens: 5,
                temperature: 0,
                timeout_ms: 5000
            });
            return { available: true, latencyMs: Date.now() - start };
        }
        catch {
            return { available: false, latencyMs: Date.now() - start };
        }
    }
}
/**
 * Convert image buffer to data URL for NIM API
 */
export function bufferToDataUrl(buffer, mimeType = 'image/jpeg') {
    const base64 = buffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
}
/**
 * Validate image buffer
 */
export function validateImageBuffer(buffer, maxSize, maxDimension) {
    if (!buffer || buffer.length === 0) {
        return { valid: false, error: 'Empty image buffer' };
    }
    if (buffer.length > maxSize) {
        return { valid: false, error: `Image too large (max ${maxSize} bytes)` };
    }
    // Basic format detection
    const format = detectImageFormat(buffer);
    if (!format) {
        return { valid: false, error: 'Unsupported image format' };
    }
    // For detailed metadata, use sharp (done in processing layer)
    return { valid: true, metadata: { width: 0, height: 0, format } };
}
/**
 * Detect image format from buffer signature
 */
function detectImageFormat(buffer) {
    if (buffer.length < 12)
        return null;
    // JPEG
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF)
        return 'jpeg';
    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47)
        return 'png';
    // WebP
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50)
        return 'webp';
    // HEIC (ftyp)
    if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
        const brand = buffer.subarray(8, 12).toString();
        if (['heic', 'heix', 'mif1', 'msf1'].includes(brand))
            return 'heic';
    }
    return null;
}
//# sourceMappingURL=nim-client.js.map