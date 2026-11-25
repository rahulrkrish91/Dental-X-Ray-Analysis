/**
 * API Module - Public Exports
 * Production-ready NIM API clients with retry, timeout, and error handling
 */
export { NIMClient, NIMError, NIMTimeoutError, NIMAuthError, NIMRateLimitError, NIMServerError, type NIMRequestOptions, type NIMMessage, type NIMContentPart, type NIMResponse, type NIMChoice, type NIMUsage, type NIMError as NIMErrorResponse, bufferToDataUrl, validateImageBuffer } from './nim-client.js';
export { VisionClient, getVisionClient, resetVisionClient } from './vision-client.js';
export { ReasoningClient, getReasoningClient, resetReasoningClient } from './reasoning-client.js';
import { NIMClient } from './nim-client.js';
import { VisionClient } from './vision-client.js';
import { ReasoningClient } from './reasoning-client.js';
/**
 * API Client Factory
 * Creates configured clients from environment
 */
export declare class APIClientFactory {
    private static visionInstance;
    private static reasoningInstance;
    static createVisionClient(): VisionClient;
    static createReasoningClient(): ReasoningClient;
    static createBaseClient(): NIMClient;
    static reset(): void;
}
/**
 * Health check all API clients
 */
export declare function checkAPIHealth(): Promise<{
    vision: {
        available: boolean;
        latencyMs?: number;
    };
    reasoning: {
        available: boolean;
        latencyMs?: number;
    };
}>;
//# sourceMappingURL=index.d.ts.map