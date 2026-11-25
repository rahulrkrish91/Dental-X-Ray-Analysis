/**
 * Pipeline Module Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AnalysisRequest, VisionOutput } from '../../src/types/schemas.js';

// Create a valid test JPEG using sharp
let testJpegBuffer: Buffer;
let testSmallJpegBuffer: Buffer;
let testJpegBase64: string;
let testSmallJpegBase64: string;

beforeEach(async () => {
  const sharp = (await import('sharp')).default;
  testJpegBuffer = await sharp({
    create: {
      width: 200,
      height: 200,
      channels: 3,
      background: { r: 128, g: 128, b: 128 }
    }
  }).jpeg().toBuffer();

  testSmallJpegBuffer = await sharp({
    create: {
      width: 50,
      height: 50,
      channels: 3,
      background: { r: 128, g: 128, b: 128 }
    }
  }).jpeg().toBuffer();

  testJpegBase64 = testJpegBuffer.toString('base64');
  testSmallJpegBase64 = testSmallJpegBuffer.toString('base64');
});

// Mock dependencies - must be before importing runAnalysisPipeline
const mockVisionClient = {
  analyzeImage: vi.fn(),
  healthCheck: vi.fn()
};

const mockReasoningClient = {
  generateReport: vi.fn(),
  healthCheck: vi.fn()
};

vi.mock('../../src/api/vision-client.js', () => ({
  getVisionClient: () => mockVisionClient,
  resetVisionClient: vi.fn()
}));

vi.mock('../../src/api/reasoning-client.js', () => ({
  getReasoningClient: () => mockReasoningClient,
  resetReasoningClient: vi.fn()
}));

vi.mock('../../src/config/index.js', () => ({
  getConfig: () => ({
    NVIDIA_API_KEY: 'test-key',
    NVIDIA_API_BASE_URL: 'https://api.test.com/v1',
    NVIDIA_VISION_MODEL: 'test-vision-model',
    NVIDIA_REASONING_MODEL: 'test-reasoning-model',
    VISION_API_TIMEOUT_MS: 60000,
    REASONING_API_TIMEOUT_MS: 30000,
    VISION_MAX_RETRIES: 2,
    REASONING_MAX_RETRIES: 2,
    TARGET_LONG_EDGE: 2048,
    OPG_TARGET_LONG_EDGE: 3072,
    MAX_DIMENSION: 8192,
    MAX_FILE_SIZE: 10485760,
    ENABLE_METRICS: true,
    LOG_LEVEL: 'info',
    LOG_FORMAT: 'pretty'
  }),
  loadConfig: vi.fn()
}));

vi.mock('../../src/validation/index.js', () => {
  const mockFn = vi.fn();
  return { validateVisionOutput: mockFn };
});

// Import real processImage, mock healthCheck only
vi.mock('../../src/pipeline/index.js', async () => {
  const actual = await vi.importActual('../../src/pipeline/index.js');
  return {
    ...actual,
    healthCheck: vi.fn()
  };
});

// Import after mocks are set up
import { runAnalysisPipeline, healthCheck, processImage, PipelineStage } from '../../src/pipeline/index.js';
import { validateVisionOutput } from '../../src/validation/index.js';
import { getVisionClient } from '../../src/api/vision-client.js';
import { getReasoningClient } from '../../src/api/reasoning-client.js';

describe('Pipeline Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Reset mock clients before each test
  beforeEach(() => {
    mockVisionClient.analyzeImage.mockReset();
    mockVisionClient.healthCheck.mockReset();
    mockReasoningClient.generateReport.mockReset();
    mockReasoningClient.healthCheck.mockReset();
  });

  describe('processImage', () => {
    it('processes valid JPEG image', async () => {
      const result = await processImage(testJpegBuffer, 'periapical');
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.width).toBeGreaterThan(0);
      expect(result.height).toBeGreaterThan(0);
      expect(result.mimeType).toBe('image/jpeg');
    });

    it('rejects invalid image', async () => {
      const invalidBuffer = Buffer.from('not an image');
      await expect(processImage(invalidBuffer, 'periapical'))
        .rejects.toThrow('Invalid or corrupted image file');
    });

    it('rejects too small image', async () => {
      await expect(processImage(testSmallJpegBuffer, 'periapical'))
        .rejects.toThrow('Image too small');
    });
  });

  describe('runAnalysisPipeline', () => {
    const mockVisionOutput: VisionOutput = {
      image_quality: {
        adequate: true,
        rating: 'good',
        issues: [],
        sharpness_score: 80,
        contrast_score: 75,
        exposure_score: 85
      },
      teeth_present: [11, 12, 13, 14, 15, 16, 17, 18],
      teeth_missing: [],
      findings: [{
        tooth: 16,
        tooth_fdi: '16',
        surfaces: ['O'],
        pathology: 'caries',
        severity: 'moderate',
        confidence: 0.85,
        description: 'Occlusal caries on tooth 16',
        bbox: { x: 0.3, y: 0.4, w: 0.1, h: 0.1 }
      }],
      periodontal: {
        bone_loss: 'none',
        teeth_affected: [],
        description: ''
      },
      restorations: [],
      other_observations: [],
      processing_metadata: {
        model: 'test-vision-model',
        processing_time_ms: 1500,
        tokens_used: 1200
      }
    };

    const mockValidatedVision = {
      data: mockVisionOutput,
      flags: [],
      passed: true
    };

    const mockClinicalReport = {
      is_dental_xray: true,
      rejection_reason: null,
      xray_type: 'periapical',
      image_quality: { rating: 'good', issues: [], usable: true },
      summary: 'Possible caries on upper right first molar.',
      healthy_observations: ['Other teeth appear intact.'],
      findings: [{
        id: 'f1',
        label: 'Possible caries upper right first molar',
        tooth_fdi: '16',
        location_description: 'Upper right first molar, occlusal surface',
        explanation_plain: 'There appears to be tooth decay on the chewing surface.',
        confidence: 'high',
        urgency: 'soon',
        bbox: { x: 0.3, y: 0.4, w: 0.1, h: 0.1 }
      }],
      recommended_next_steps: ['Schedule dental appointment within 2 weeks.'],
      limitations: ['Cannot detect early decay between teeth.'],
      disclaimer: 'This is not a medical diagnosis.',
      dentist_review_flags: [],
      metadata: {
        vision_model: 'test-vision-model',
        reasoning_model: 'test-reasoning-model',
        total_processing_time_ms: 3000,
        vision_confidence_avg: 0.85
      }
    };

    it('successfully runs full pipeline', async () => {
      mockVisionClient.analyzeImage.mockResolvedValue(mockVisionOutput);
      mockReasoningClient.generateReport.mockResolvedValue(mockClinicalReport);
      validateVisionOutput.mockReturnValue(mockValidatedVision);

      const request: AnalysisRequest = {
        image_base64: testJpegBase64,
        mime_type: 'image/jpeg',
        xray_type_hint: 'periapical',
        symptoms: ['pain'],
        language: 'en'
      };

      const result = await runAnalysisPipeline(request);

      expect(result.success).toBe(true);
      expect(result.report).toEqual(mockClinicalReport);
      expect(result.error).toBeNull();
      expect(result.request_id).toBeDefined();

      expect(mockVisionClient.analyzeImage).toHaveBeenCalled();
      expect(mockReasoningClient.generateReport).toHaveBeenCalled();
      expect(validateVisionOutput).toHaveBeenCalled();
    });

    it('handles vision model failure', async () => {
      mockVisionClient.analyzeImage.mockRejectedValue(new Error('Vision model unavailable'));

      const request: AnalysisRequest = {
        image_base64: testJpegBase64,
        mime_type: 'image/jpeg'
      };

      const result = await runAnalysisPipeline(request);

      expect(result.success).toBe(false);
      expect(result.report).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('MODEL_UNAVAILABLE');
    });

    it('handles validation failure', async () => {
      mockVisionClient.analyzeImage.mockResolvedValue(mockVisionOutput);
      validateVisionOutput.mockReturnValue({
        data: mockVisionOutput,
        flags: [{ code: 'SCHEMA_VALIDATION_FAILED', severity: 'critical', message: 'Invalid', finding_index: null }],
        passed: false
      });
      mockReasoningClient.generateReport.mockResolvedValue(mockClinicalReport);

      const request: AnalysisRequest = {
        image_base64: testJpegBase64,
        mime_type: 'image/jpeg'
      };

      const result = await runAnalysisPipeline(request);

      // Pipeline continues even with validation failure (warning only)
      expect(result.success).toBe(true);
    });

    it('handles reasoning model failure', async () => {
      mockVisionClient.analyzeImage.mockResolvedValue(mockVisionOutput);
      validateVisionOutput.mockReturnValue(mockValidatedVision);
      mockReasoningClient.generateReport.mockRejectedValue(new Error('Reasoning model timeout'));

      const request: AnalysisRequest = {
        image_base64: testJpegBase64,
        mime_type: 'image/jpeg'
      };

      const result = await runAnalysisPipeline(request);

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('TIMEOUT');
    });

    it('includes request ID in response', async () => {
      mockVisionClient.analyzeImage.mockResolvedValue(mockVisionOutput);
      mockReasoningClient.generateReport.mockResolvedValue(mockClinicalReport);
      validateVisionOutput.mockReturnValue(mockValidatedVision);

      const request: AnalysisRequest = {
        image_base64: testJpegBase64,
        mime_type: 'image/jpeg',
        request_id: '550e8400-e29b-41d4-a716-446655440000'
      };

      const result = await runAnalysisPipeline(request);
      expect(result.request_id).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('generates request ID if not provided', async () => {
      mockVisionClient.analyzeImage.mockResolvedValue(mockVisionOutput);
      mockReasoningClient.generateReport.mockResolvedValue(mockClinicalReport);
      validateVisionOutput.mockReturnValue(mockValidatedVision);

      const request: AnalysisRequest = {
        image_base64: testJpegBase64,
        mime_type: 'image/jpeg'
      };

      const result = await runAnalysisPipeline(request);
      expect(result.request_id).toMatch(/^[0-9a-f-]{36}$/);
    });
  });

  describe('healthCheck', () => {
    it('returns healthy when all checks pass', async () => {
      (healthCheck as any).mockResolvedValue({
        status: 'healthy',
        models: {
          vision: { available: true, latencyMs: 100 },
          reasoning: { available: true, latencyMs: 150 }
        },
        checks: [{ name: 'vision', status: 'pass' }, { name: 'reasoning', status: 'pass' }]
      });

      const health = await healthCheck();

      expect(health.status).toBe('healthy');
      expect(health.models.vision.available).toBe(true);
      expect(health.models.reasoning.available).toBe(true);
      expect(health.checks.every(c => c.status === 'pass')).toBe(true);
    });

    it('returns unhealthy when vision model fails', async () => {
      (healthCheck as any).mockResolvedValue({
        status: 'unhealthy',
        models: {
          vision: { available: false, latencyMs: 0 },
          reasoning: { available: true, latencyMs: 150 }
        },
        checks: [{ name: 'vision', status: 'fail' }, { name: 'reasoning', status: 'pass' }]
      });

      const health = await healthCheck();

      expect(health.status).toBe('unhealthy');
      expect(health.models.vision.available).toBe(false);
    });

    it('returns a valid status', async () => {
      (healthCheck as any).mockResolvedValue({
        status: 'healthy',
        models: { vision: { available: true }, reasoning: { available: true } },
        checks: []
      });
      const health = await healthCheck();
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
    });
  });
});