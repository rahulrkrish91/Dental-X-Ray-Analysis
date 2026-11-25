/**
 * Reasoning Model Client - nemotron-3.5-lightning-30b-a3b
 * Generates clinical report from validated vision findings
 */
import { NIMClient } from './nim-client.js';
import type { VisionOutput, ClinicalReport, ValidationFlag } from '../types/schemas.js';
/**
 * Reasoning Model Client
 */
export declare class ReasoningClient extends NIMClient {
    private readonly model;
    constructor();
    /**
     * Generate clinical report from validated vision output
     */
    generateReport(visionOutput: VisionOutput, validationFlags: ValidationFlag[], language?: 'en' | 'ml'): Promise<ClinicalReport>;
    /**
     * Health check for reasoning model
     */
    healthCheck(): Promise<{
        available: boolean;
        latencyMs: number;
    }>;
}
export declare function getReasoningClient(): ReasoningClient;
export declare function resetReasoningClient(): void;
//# sourceMappingURL=reasoning-client.d.ts.map