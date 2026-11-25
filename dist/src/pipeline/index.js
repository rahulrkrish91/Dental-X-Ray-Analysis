/**
 * Main Analysis Pipeline Orchestrator
 * Coordinates vision -> validation -> reasoning -> response
 */
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { getConfig } from '../config/index.js';
import { getVisionClient } from '../api/vision-client.js';
import { getReasoningClient } from '../api/reasoning-client.js';
import { validateVisionOutput } from '../validation/index.js';
import { AnalysisRequestSchema, AnalysisResponseSchema } from '../types/schemas.js';
/**
 * Pipeline processing stages
 */
export var PipelineStage;
(function (PipelineStage) {
    PipelineStage["VALIDATE_INPUT"] = "validate_input";
    PipelineStage["PROCESS_IMAGE"] = "process_image";
    PipelineStage["VISION_ANALYSIS"] = "vision_analysis";
    PipelineStage["VALIDATE_VISION"] = "validate_vision";
    PipelineStage["REASONING_REPORT"] = "reasoning_report";
    PipelineStage["FINALIZE"] = "finalize";
})(PipelineStage || (PipelineStage = {}));
/**
 * Default image processing options
 */
const DEFAULT_IMAGE_OPTIONS = {
    targetLongEdge: 2048,
    opgTargetLongEdge: 3072,
    quality: 85,
    maxDimension: 8192
};
/**
 * Process and optimize image for analysis
 */
export async function processImage(buffer, xrayType, options = {}) {
    const opts = { ...DEFAULT_IMAGE_OPTIONS, ...options };
    const config = getConfig();
    // Validate with sharp
    let metadata;
    try {
        metadata = await sharp(buffer).metadata();
    }
    catch {
        throw new Error('Invalid or corrupted image file');
    }
    if (!metadata.width || !metadata.height) {
        throw new Error('Could not determine image dimensions');
    }
    if (metadata.width > opts.maxDimension || metadata.height > opts.maxDimension) {
        throw new Error(`Image dimensions too large (max ${opts.maxDimension}px)`);
    }
    if (metadata.width < 100 || metadata.height < 100) {
        throw new Error('Image too small (minimum 100x100px)');
    }
    // Determine target size based on x-ray type
    const targetLongEdge = xrayType === 'opg' ? opts.opgTargetLongEdge : opts.targetLongEdge;
    const longEdge = Math.max(metadata.width, metadata.height);
    const scale = longEdge > targetLongEdge ? targetLongEdge / longEdge : 1;
    const processed = await sharp(buffer)
        .rotate() // Auto-orient from EXIF
        .resize({
        width: Math.round(metadata.width * scale),
        height: Math.round(metadata.height * scale),
        fit: 'inside',
        withoutEnlargement: true
    })
        .jpeg({ quality: opts.quality, mozjpeg: true })
        .toBuffer();
    return {
        buffer: processed,
        width: Math.round(metadata.width * scale),
        height: Math.round(metadata.height * scale),
        mimeType: 'image/jpeg'
    };
}
/**
 * Main pipeline execution
 */
export async function runAnalysisPipeline(request) {
    const requestId = request.request_id || randomUUID();
    const startTime = Date.now();
    const metrics = {
        requestId,
        startTime,
        stageTimings: {},
        totalTimeMs: 0,
        findingsCount: 0,
        flagsCount: 0,
        success: false
    };
    const stageStart = (stage) => {
        metrics.stageTimings[stage] = Date.now();
    };
    const stageEnd = (stage) => {
        const end = Date.now();
        const start = metrics.stageTimings[stage] || startTime;
        metrics.stageTimings[stage] = end - start;
    };
    try {
        // Stage 1: Validate Input
        stageStart(PipelineStage.VALIDATE_INPUT);
        const validatedRequest = AnalysisRequestSchema.parse(request);
        stageEnd(PipelineStage.VALIDATE_INPUT);
        // Stage 2: Process Image
        stageStart(PipelineStage.PROCESS_IMAGE);
        const { buffer: processedBuffer, width, height, mimeType } = await processImage(Buffer.from(validatedRequest.image_base64, 'base64'), validatedRequest.xray_type_hint || 'unknown', {
            targetLongEdge: getConfig().TARGET_LONG_EDGE,
            opgTargetLongEdge: getConfig().OPG_TARGET_LONG_EDGE,
            maxDimension: getConfig().MAX_DIMENSION
        });
        stageEnd(PipelineStage.PROCESS_IMAGE);
        // Stage 3: Vision Analysis
        stageStart(PipelineStage.VISION_ANALYSIS);
        const visionClient = getVisionClient();
        const visionOutput = await visionClient.analyzeImage(processedBuffer, mimeType, {
            xrayTypeHint: validatedRequest.xray_type_hint,
            symptoms: validatedRequest.symptoms,
            requestId
        });
        stageEnd(PipelineStage.VISION_ANALYSIS);
        metrics.visionTokens = visionOutput.processing_metadata?.tokens_used;
        metrics.findingsCount = visionOutput.findings.length;
        // Stage 4: Validate Vision Output
        stageStart(PipelineStage.VALIDATE_VISION);
        const validatedVision = validateVisionOutput(visionOutput);
        stageEnd(PipelineStage.VALIDATE_VISION);
        metrics.flagsCount = validatedVision.flags.length;
        // Stage 5: Generate Clinical Report
        stageStart(PipelineStage.REASONING_REPORT);
        const reasoningClient = getReasoningClient();
        const clinicalReport = await reasoningClient.generateReport(validatedVision.data, validatedVision.flags, validatedRequest.language);
        stageEnd(PipelineStage.REASONING_REPORT);
        metrics.reasoningTokens = clinicalReport.metadata?.vision_confidence_avg
            ? undefined // tokens not tracked in reasoning yet
            : undefined;
        // Stage 6: Finalize Response
        stageStart(PipelineStage.FINALIZE);
        const response = {
            success: true,
            report: clinicalReport,
            error: null,
            request_id: requestId
        };
        stageEnd(PipelineStage.FINALIZE);
        metrics.totalTimeMs = Date.now() - startTime;
        metrics.success = true;
        logMetrics(metrics);
        return AnalysisResponseSchema.parse(response);
    }
    catch (error) {
        metrics.totalTimeMs = Date.now() - startTime;
        metrics.success = false;
        metrics.error = error.message;
        logMetrics(metrics);
        const errorResponse = {
            success: false,
            report: null,
            error: {
                code: getErrorCode(error),
                message: getErrorMessage(error),
                details: { requestId }
            },
            request_id: requestId
        };
        return AnalysisResponseSchema.parse(errorResponse);
    }
}
/**
 * Map errors to standardized codes
 */
function getErrorCode(error) {
    if (error instanceof Error) {
        if (error.message.includes('Invalid or corrupted'))
            return 'INVALID_IMAGE';
        if (error.message.includes('too large'))
            return 'IMAGE_TOO_LARGE';
        if (error.message.includes('too small'))
            return 'IMAGE_TOO_SMALL';
        if (error.message.includes('dimensions too large'))
            return 'IMAGE_DIMENSIONS_EXCEEDED';
        if (error.message.includes('NVIDIA_API_KEY'))
            return 'CONFIG_MISSING';
        if (error.message.includes('Authentication failed') || error.message.includes('401'))
            return 'AUTH_FAILED';
        if (error.message.includes('Rate limit') || error.message.includes('429'))
            return 'RATE_LIMITED';
        if (error.message.includes('Model not found') || error.message.includes('404') || error.message.includes('model unavailable') || error.message.includes('unavailable'))
            return 'MODEL_UNAVAILABLE';
        if (error.message.includes('timeout') || error.message.includes('timed out'))
            return 'TIMEOUT';
        if (error.message.includes('MODEL_BAD_JSON') || error.message.includes('validation failed'))
            return 'MODEL_OUTPUT_INVALID';
        if (error.message.includes('Empty response'))
            return 'EMPTY_MODEL_RESPONSE';
    }
    return 'INTERNAL_ERROR';
}
/**
 * Get user-friendly error message
 */
function getErrorMessage(error) {
    if (error instanceof Error) {
        if (error.message.includes('Invalid or corrupted'))
            return 'The uploaded file is not a valid image';
        if (error.message.includes('too large'))
            return 'Image file is too large (maximum 10MB)';
        if (error.message.includes('too small'))
            return 'Image is too small (minimum 100x100 pixels)';
        if (error.message.includes('dimensions too large'))
            return 'Image dimensions exceed maximum allowed';
        if (error.message.includes('NVIDIA_API_KEY'))
            return 'Service temporarily unavailable';
        if (error.message.includes('Authentication failed'))
            return 'Service authentication failed';
        if (error.message.includes('Rate limit'))
            return 'Too many requests, please try again later';
        if (error.message.includes('Model not found'))
            return 'Analysis model temporarily unavailable';
        if (error.message.includes('timeout') || error.message.includes('timed out'))
            return 'Analysis timed out, please try again';
        if (error.message.includes('MODEL_BAD_JSON') || error.message.includes('validation failed'))
            return 'Analysis failed, please try again';
        if (error.message.includes('Empty response'))
            return 'Analysis returned no results, please try again';
    }
    return 'Analysis failed. Please try again.';
}
/**
 * Log pipeline metrics
 */
function logMetrics(metrics) {
    const config = getConfig();
    if (!config.ENABLE_METRICS)
        return;
    const logData = {
        request_id: metrics.requestId,
        total_ms: metrics.totalTimeMs,
        stages: metrics.stageTimings,
        vision_tokens: metrics.visionTokens,
        findings: metrics.findingsCount,
        flags: metrics.flagsCount,
        success: metrics.success,
        error: metrics.error
    };
    if (config.LOG_FORMAT === 'json') {
        console.log(JSON.stringify({ type: 'pipeline_metrics', ...logData }));
    }
    else {
        const status = metrics.success ? '✓' : '✗';
        console.log(`${status} [${metrics.requestId}] ${metrics.totalTimeMs}ms | vision:${metrics.stageTimings[PipelineStage.VISION_ANALYSIS] || 0}ms | reasoning:${metrics.stageTimings[PipelineStage.REASONING_REPORT] || 0}ms | findings:${metrics.findingsCount} | flags:${metrics.flagsCount}`);
        if (!metrics.success) {
            console.log(`  Error: ${metrics.error}`);
        }
    }
}
/**
 * Health check for entire pipeline
 */
export async function healthCheck() {
    const checks = [];
    // Check config
    try {
        getConfig();
        checks.push({ name: 'config', status: 'pass' });
    }
    catch (e) {
        checks.push({ name: 'config', status: 'fail', message: e.message });
    }
    // Check vision model
    const visionClient = getVisionClient();
    const visionHealth = await visionClient.healthCheck();
    checks.push({
        name: 'vision_model',
        status: visionHealth.available ? 'pass' : 'fail',
        message: visionHealth.available ? `Latency: ${visionHealth.latencyMs}ms` : 'Unavailable'
    });
    // Check reasoning model
    const reasoningClient = getReasoningClient();
    const reasoningHealth = await reasoningClient.healthCheck();
    checks.push({
        name: 'reasoning_model',
        status: reasoningHealth.available ? 'pass' : 'fail',
        message: reasoningHealth.available ? `Latency: ${reasoningHealth.latencyMs}ms` : 'Unavailable'
    });
    // Check sharp
    try {
        await sharp(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')).metadata();
        checks.push({ name: 'image_processing', status: 'pass' });
    }
    catch {
        checks.push({ name: 'image_processing', status: 'fail', message: 'Sharp not working' });
    }
    const failed = checks.filter(c => c.status === 'fail').length;
    const warned = checks.filter(c => c.status === 'warn').length;
    let status = 'healthy';
    if (failed > 0)
        status = 'unhealthy';
    else if (warned > 0)
        status = 'degraded';
    return {
        status,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        models: {
            vision: { available: visionHealth.available, latencyMs: visionHealth.latencyMs },
            reasoning: { available: reasoningHealth.available, latencyMs: reasoningHealth.latencyMs }
        },
        checks
    };
}
//# sourceMappingURL=index.js.map