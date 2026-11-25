/**
 * Integration Tests - API Endpoints
 * Tests the full Express server with mocked dependencies
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock all external dependencies before importing server
let mockConfig = {
    NVIDIA_API_KEY: 'test-key',
    NVIDIA_API_BASE_URL: 'https://api.test.com/v1',
    NVIDIA_VISION_MODEL: 'test-vision',
    NVIDIA_REASONING_MODEL: 'test-reasoning',
    PORT: 3000,
    NODE_ENV: 'test',
    VISION_API_TIMEOUT_MS: 60000,
    REASONING_API_TIMEOUT_MS: 30000,
    VISION_MAX_RETRIES: 2,
    REASONING_MAX_RETRIES: 2,
    RATE_LIMIT_WINDOW_MS: 3600000,
    RATE_LIMIT_MAX: 100,
    ASK_RATE_LIMIT_MAX: 50,
    ASK_RATE_LIMIT_WINDOW_MS: 3600000,
    ASK_DAILY_CAP: 0,
    MAX_FILE_SIZE: 10485760,
    MAX_DIMENSION: 8192,
    TARGET_LONG_EDGE: 2048,
    OPG_TARGET_LONG_EDGE: 3072,
    QUALITY_MIN_SHORT_SIDE_BLOCK: 600,
    QUALITY_MIN_SHORT_SIDE_WARN: 900,
    QUALITY_BLUR_BLOCK_THRESHOLD: 50,
    QUALITY_BLUR_WARN_THRESHOLD: 100,
    QUALITY_DARK_THRESHOLD: 30,
    QUALITY_BRIGHT_THRESHOLD: 225,
    QUALITY_CONTRAST_THRESHOLD: 30,
    QUALITY_XRAY_GRAYSCALE_RATIO: 0.85,
    QUALITY_XRAY_DARK_RATIO: 0.6,
    REPORT_SIGNING_SECRET: 'test-secret-key-that-is-at-least-32-chars-long',
    ASK_ENABLED: true,
    CLINIC_WHATSAPP: null,
    LOG_LEVEL: 'error',
    LOG_FORMAT: 'json',
    ENABLE_DENTIST_REVIEW: true,
    ENABLE_CORRECTION_STORAGE: false,
    ENABLE_METRICS: false
  };

vi.mock('../../src/config/index.js', () => ({
  loadConfig: vi.fn(),
  getConfig: () => mockConfig,
  CONFIG_CONSTANTS: {
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
    ALLOWED_XRAY_TYPES: ['bitewing', 'periapical', 'opg', 'unknown'],
    ALLOWED_SYMPTOMS: ['pain', 'swelling', 'fever', 'injury', 'recent injury', 'bleeding'],
    SUPPORTED_LANGUAGES: ['en', 'ml'],
    FDI_ADULT_MIN: 11,
    FDI_ADULT_MAX: 48,
    FDI_PRIMARY_MIN: 51,
    FDI_PRIMARY_MAX: 85,
    REPORT_TOKEN_EXPIRY_SECONDS: 7200,
    MAX_QUESTIONS_PER_REPORT: 5,
    MAX_QA_PAYLOAD_SIZE: 6000,
    MAX_FINDINGS_IN_PAYLOAD: 10,
    DEFAULT_MAX_FINDINGS: 6,
    DEFAULT_MAX_HEALTHY_OBSERVATIONS: 10,
    DEFAULT_MAX_NEXT_STEPS: 10,
    DEFAULT_MAX_LIMITATIONS: 10
  }
}));

vi.mock('../../src/pipeline/index.js', () => ({
  runAnalysisPipeline: vi.fn(),
  healthCheck: vi.fn(),
  processImage: vi.fn()
}));

vi.mock('../../src/utils/qa-helpers.js', () => ({
  buildQAPayload: vi.fn(),
  signToken: vi.fn(),
  verifyToken: vi.fn(),
  checkEmergency: vi.fn(),
  postFilterAnswer: vi.fn(),
  parseSymptoms: vi.fn(),
  extractJson: vi.fn(),
  FALLBACK_ANSWERS: { en: 'Fallback EN', ml: 'Fallback ML' },
  ASK_SYSTEM_PROMPT: 'test prompt'
}));

vi.mock('sharp', () => ({
  default: vi.fn(() => ({
    metadata: vi.fn().mockResolvedValue({ width: 100, height: 100 }),
    rotate: vi.fn().mockReturnThis(),
    resize: vi.fn().mockReturnThis(),
    jpeg: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('processed'))
  }))
}));

import { runAnalysisPipeline, healthCheck } from '../../src/pipeline/index.js';
import { buildQAPayload, signToken, verifyToken, checkEmergency, parseSymptoms } from '../../src/utils/qa-helpers.js';

describe('API Integration Tests', () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    // Import server after mocks are set up
    const { app: serverApp } = await import('../../server.ts');
    app = serverApp;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('returns healthy status when all checks pass', async () => {
      (healthCheck as any).mockResolvedValue({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        models: { vision: { available: true, latency_ms: 100 }, reasoning: { available: true, latency_ms: 150 } },
        checks: [{ name: 'config', status: 'pass' }, { name: 'vision_model', status: 'pass' }, { name: 'reasoning_model', status: 'pass' }, { name: 'image_processing', status: 'pass' }]
      });

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.models.vision.available).toBe(true);
    });

    it('returns 503 when unhealthy', async () => {
      (healthCheck as any).mockResolvedValue({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        models: { vision: { available: false, latency_ms: 0 }, reasoning: { available: true, latency_ms: 150 } },
        checks: [{ name: 'vision_model', status: 'fail', message: 'Unavailable' }]
      });

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(503);
      expect(response.body.status).toBe('unhealthy');
    });
  });

  describe('GET /api/config', () => {
    it('returns public config', async () => {
      const response = await request(app).get('/api/config');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('clinicWhatsapp');
    });
  });

  describe('POST /api/analyze', () => {
    const mockSuccessResult = {
      success: true,
      report: {
        is_dental_xray: true,
        rejection_reason: null,
        xray_type: 'periapical',
        image_quality: { rating: 'good', issues: [], usable: true },
        summary: 'Test summary',
        healthy_observations: [],
        findings: [],
        recommended_next_steps: [],
        limitations: [],
        disclaimer: 'Test disclaimer',
        dentist_review_flags: [],
        report_token: 'test-token'
      },
      error: null,
      request_id: 'test-request-id'
    };

    const mockErrorResult = {
      success: false,
      report: null,
      error: { code: 'INVALID_IMAGE', message: 'Invalid image', details: {} },
      request_id: 'test-request-id'
    };

    it('returns 400 when no image uploaded', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .field('xrayType', 'periapical')
        .field('lang', 'en');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('No image uploaded');
    });

    it('returns 400 for invalid file type', async () => {
      const response = await request(app)
        .post('/api/analyze')
        .attach('image', Buffer.from('test'), 'test.txt')
        .field('xrayType', 'periapical');

      expect(response.status).toBe(400);
    });

    it('returns 200 on successful analysis', async () => {
      (runAnalysisPipeline as any).mockResolvedValue(mockSuccessResult);
      (buildQAPayload as any).mockReturnValue({ r: {}, lang: 'en', exp: 0, q: 0 });
      (signToken as any).mockReturnValue('signed-token');

      const response = await request(app)
        .post('/api/analyze')
        .attach('image', Buffer.from('fake-jpeg'), 'test.jpg')
        .field('xrayType', 'periapical')
        .field('lang', 'en');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.report).toBeDefined();
    });

    it('returns 400 for invalid image error', async () => {
      (runAnalysisPipeline as any).mockResolvedValue({
        ...mockErrorResult,
        error: { code: 'INVALID_IMAGE', message: 'Invalid image', details: {} }
      });

      const response = await request(app)
        .post('/api/analyze')
        .attach('image', Buffer.from('fake'), 'test.jpg')
        .field('xrayType', 'periapical');

      expect(response.status).toBe(400);
    });

    it('returns 502 for model errors', async () => {
      (runAnalysisPipeline as any).mockResolvedValue({
        ...mockErrorResult,
        error: { code: 'MODEL_UNAVAILABLE', message: 'Model down', details: {} }
      });

      const response = await request(app)
        .post('/api/analyze')
        .attach('image', Buffer.from('fake'), 'test.jpg')
        .field('xrayType', 'periapical');

      expect(response.status).toBe(502);
    });

    it('validates xrayType enum', async () => {
      (runAnalysisPipeline as any).mockResolvedValue(mockSuccessResult);

      const response = await request(app)
        .post('/api/analyze')
        .attach('image', Buffer.from('fake'), 'test.jpg')
        .field('xrayType', 'invalid-type')
        .field('lang', 'en');

      // Should default to 'unknown'
      expect(response.status).toBe(200);
    });

    it('validates language enum', async () => {
      (runAnalysisPipeline as any).mockResolvedValue(mockSuccessResult);

      const response = await request(app)
        .post('/api/analyze')
        .attach('image', Buffer.from('fake'), 'test.jpg')
        .field('xrayType', 'periapical')
        .field('lang', 'fr');

      // Should default to 'en'
      expect(response.status).toBe(200);
    });

    it('parses symptoms correctly', async () => {
      (runAnalysisPipeline as any).mockResolvedValue(mockSuccessResult);
      (parseSymptoms as any).mockReturnValue(['pain', 'swelling']);

      await request(app)
        .post('/api/analyze')
        .attach('image', Buffer.from('fake'), 'test.jpg')
        .field('xrayType', 'periapical')
        .field('symptoms', '["pain", "swelling", "invalid"]')
        .field('lang', 'en');

      expect(parseSymptoms).toHaveBeenCalledWith('["pain", "swelling", "invalid"]');
    });
  });

  describe('POST /api/ask', () => {
    const validPayload = {
      r: {
        xray_type: 'periapical',
        summary: 'Test',
        healthy_observations: [],
        findings: [],
        recommended_next_steps: [],
        limitations: []
      },
      lang: 'en',
      exp: Math.floor(Date.now() / 1000) + 7200,
      q: 0
    };

    beforeEach(() => {
      (verifyToken as any).mockReturnValue(validPayload);
      (checkEmergency as any).mockReturnValue(false);
      (buildQAPayload as any).mockReturnValue(validPayload);
      (signToken as any).mockReturnValue('new-token');
    });

    it('returns 503 when Q&A disabled', async () => {
      // Create a fresh app with Q&A disabled
      mockConfig.ASK_ENABLED = false;
      vi.resetModules();
      const { app: disabledApp } = await import('../../server.ts');

      const response = await request(disabledApp)
        .post('/api/ask')
        .send({ token: 'valid-token', question: 'Test question', language: 'en' });

      expect(response.status).toBe(503);
      mockConfig.ASK_ENABLED = true; // Reset for other tests
    });

    it('returns 400 for missing token', async () => {
      const response = await request(app)
        .post('/api/ask')
        .send({ question: 'Test question', language: 'en' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request');
    });

    it('returns 400 for missing question', async () => {
      const response = await request(app)
        .post('/api/ask')
        .send({ token: 'valid-token', language: 'en' });

      expect(response.status).toBe(400);
    });

    it('returns 400 for invalid language', async () => {
      const response = await request(app)
        .post('/api/ask')
        .send({ token: 'valid-token', question: 'Test', language: 'fr' });

      expect(response.status).toBe(400);
    });

    it('returns 400 for question too short', async () => {
      const response = await request(app)
        .post('/api/ask')
        .send({ token: 'valid-token', question: 'Hi', language: 'en' });

      expect(response.status).toBe(400);
    });

    it('returns 400 for question too long', async () => {
      const response = await request(app)
        .post('/api/ask')
        .send({ token: 'valid-token', question: 'a'.repeat(301), language: 'en' });

      expect(response.status).toBe(400);
    });

    it('returns 400 for expired token', async () => {
      (verifyToken as any).mockReturnValue(null);

      const response = await request(app)
        .post('/api/ask')
        .send({ token: 'expired-token', question: 'Test question', language: 'en' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid or expired session');
    });

    it('returns 400 when question limit reached', async () => {
      (verifyToken as any).mockReturnValue({ ...validPayload, q: 5 });

      const response = await request(app)
        .post('/api/ask')
        .send({ token: 'valid-token', question: 'Test question', language: 'en' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Question limit reached for this report');
    });

    it('returns emergency response for emergency questions', async () => {
      (checkEmergency as any).mockReturnValue(true);

      const response = await request(app)
        .post('/api/ask')
        .send({ token: 'valid-token', question: 'I have difficulty breathing', language: 'en' });

      expect(response.status).toBe(200);
      expect(response.body.urgent).toBe(true);
      expect(response.body.suggest_dentist).toBe(true);
    });
  });
});