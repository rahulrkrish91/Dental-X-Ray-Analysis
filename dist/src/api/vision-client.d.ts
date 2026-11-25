/**
 * Vision Model Client - nemotron-3.5-super-vl-120b-a12b
 * Handles dental X-ray image analysis with structured JSON output
 */
import { NIMClient } from './nim-client.js';
import type { VisionOutput } from '../types/schemas.js';
/**
 * Vision Model Client
 */
export declare class VisionClient extends NIMClient {
    private readonly model;
    constructor();
    /**
     * Analyze dental X-ray image
     */
    analyzeImage(imageBuffer: Buffer, mimeType: string, options?: {
        xrayTypeHint?: string;
        symptoms?: string[];
        requestId?: string;
    }): Promise<VisionOutput>;
    /**
     * Health check for vision model
     */
    healthCheck(): Promise<{
        available: boolean;
        latencyMs: number;
    }>;
}
export declare function getVisionClient(): VisionClient;
export declare function resetVisionClient(): void;
//# sourceMappingURL=vision-client.d.ts.map