/**
 * Main Entry Point - CLI and Server
 * Production-ready entry with proper error handling
 */
import 'dotenv/config';
import type { AnalysisRequest, AnalysisResponse, HealthCheck } from './types/schemas.js';
/**
 * CLI Analysis Function
 * For direct usage or testing
 */
export declare function analyzeImage(request: AnalysisRequest): Promise<AnalysisResponse>;
/**
 * CLI Health Check
 */
export declare function checkHealth(): Promise<HealthCheck>;
export { loadConfig, getConfig, resetConfig } from './config/index.js';
export { getVisionClient, resetVisionClient } from './api/vision-client.js';
export { getReasoningClient, resetReasoningClient } from './api/reasoning-client.js';
export { runAnalysisPipeline, healthCheck, processImage } from './pipeline/index.js';
export { validateVisionOutput } from './validation/index.js';
export type { AnalysisRequest, AnalysisResponse, ClinicalReport, VisionOutput, ValidatedVisionOutput, HealthCheck } from './types/schemas.js';
//# sourceMappingURL=main.d.ts.map