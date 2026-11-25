/**
 * NVIDIA NIM API Client
 * Shared base client for vision and reasoning models
 */
import type { AllowedMimeType } from '../config/index.js';
export interface NIMRequestOptions {
    model: string;
    messages: NIMMessage[];
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    stream?: boolean;
    timeout_ms?: number;
    reasoning_budget?: number;
}
export interface NIMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string | NIMContentPart[];
}
export interface NIMContentPart {
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
        url: string;
    };
}
export interface NIMResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: NIMChoice[];
    usage?: NIMUsage;
}
export interface NIMChoice {
    index: number;
    message: {
        role: string;
        content: string | null;
        reasoning_content?: string;
    };
    finish_reason: string | null;
}
export interface NIMUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}
export interface NIMError {
    error: {
        message: string;
        type: string;
        code?: string;
    };
}
/**
 * Custom error classes for different failure modes
 */
export declare class NIMError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly retryable: boolean;
    readonly originalError?: Error | undefined;
    constructor(message: string, statusCode: number, code: string, retryable: boolean, originalError?: Error | undefined);
}
export declare class NIMTimeoutError extends NIMError {
    constructor(timeoutMs: number, originalError?: Error);
}
export declare class NIMAuthError extends NIMError {
    constructor(message?: string);
}
export declare class NIMRateLimitError extends NIMError {
    constructor(retryAfterMs?: number);
    retryAfterMs?: number;
}
export declare class NIMServerError extends NIMError {
    constructor(statusCode: number, message: string);
}
/**
 * Base NIM Client with retry logic, timeout handling, and error classification
 */
export declare class NIMClient {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly defaultTimeout;
    private readonly maxRetries;
    constructor(apiKey: string, baseUrl: string, defaultTimeout?: number, maxRetries?: number);
    /**
     * Create client from environment config
     */
    static fromConfig(): NIMClient;
    /**
     * Make a chat completion request with retry logic
     */
    chatCompletion(options: NIMRequestOptions): Promise<NIMResponse>;
    /**
     * Handle HTTP error responses
     */
    private handleHttpError;
    /**
     * Check if an error is retryable
     */
    private isRetryableError;
    /**
     * Exponential backoff with jitter
     */
    private delay;
    /**
     * Health check - simple model availability test
     */
    healthCheck(model: string): Promise<{
        available: boolean;
        latencyMs: number;
    }>;
}
/**
 * Convert image buffer to data URL for NIM API
 */
export declare function bufferToDataUrl(buffer: Buffer, mimeType?: AllowedMimeType): string;
/**
 * Validate image buffer
 */
export declare function validateImageBuffer(buffer: Buffer, maxSize: number, maxDimension: number): {
    valid: boolean;
    error?: string;
    metadata?: {
        width: number;
        height: number;
        format: string;
    };
};
//# sourceMappingURL=nim-client.d.ts.map