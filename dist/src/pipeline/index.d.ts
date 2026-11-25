/**
 * Main Analysis Pipeline Orchestrator
 * Coordinates vision -> validation -> reasoning -> response
 */
import type { AnalysisRequest, AnalysisResponse } from '../types/schemas.js';
/**
 * Pipeline processing stages
 */
export declare enum PipelineStage {
    VALIDATE_INPUT = "validate_input",
    PROCESS_IMAGE = "process_image",
    VISION_ANALYSIS = "vision_analysis",
    VALIDATE_VISION = "validate_vision",
    REASONING_REPORT = "reasoning_report",
    FINALIZE = "finalize"
}
/**
 * Pipeline metrics for monitoring
 */
export interface PipelineMetrics {
    requestId: string;
    startTime: number;
    stageTimings: Record<PipelineStage, number>;
    totalTimeMs: number;
    visionTokens?: number;
    reasoningTokens?: number;
    findingsCount: number;
    flagsCount: number;
    success: boolean;
    error?: string;
}
/**
 * Image processing options
 */
export interface ImageProcessingOptions {
    targetLongEdge?: number;
    opgTargetLongEdge?: number;
    quality?: number;
    maxDimension?: number;
}
/**
 * Process and optimize image for analysis
 */
export declare function processImage(buffer: Buffer, xrayType: string, options?: ImageProcessingOptions): Promise<{
    buffer: Buffer;
    width: number;
    height: number;
    mimeType: string;
}>;
/**
 * Main pipeline execution
 */
export declare function runAnalysisPipeline(request: AnalysisRequest): Promise<AnalysisResponse>;
/**
 * Health check for entire pipeline
 */
export declare function healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    version: string;
    models: {
        vision: {
            available: boolean;
            latencyMs?: number;
        };
        reasoning: {
            available: boolean;
            latencyMs?: number;
        };
    };
    checks: Array<{
        name: string;
        status: 'pass' | 'fail' | 'warn';
        message?: string;
    }>;
}>;
//# sourceMappingURL=index.d.ts.map