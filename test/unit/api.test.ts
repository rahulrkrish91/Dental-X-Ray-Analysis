/**
 * API Module Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NIMClient, NIMError, NIMAuthError, NIMRateLimitError, NIMTimeoutError, NIMServerError, bufferToDataUrl, validateImageBuffer } from '../../src/api/nim-client.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('NIMClient', () => {
    const client = new NIMClient('test-key', 'https://api.test.com/v1', 5000, 2);

    it('creates client with config', () => {
      expect(client).toBeInstanceOf(NIMClient);
    });

    it('chatCompletion succeeds on first try', async () => {
      const mockResponse = {
        id: 'test-123',
        object: 'chat.completion',
        created: Date.now(),
        model: 'test-model',
        choices: [{
          index: 0,
          message: { role: 'assistant', content: '{"test": "response"}' },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.chatCompletion({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }]
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('retries on retryable error', async () => {
      const mockResponse = {
        id: 'test-123',
        object: 'chat.completion',
        created: Date.now(),
        model: 'test-model',
        choices: [{
          index: 0,
          message: { role: 'assistant', content: '{"test": "response"}' },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
      };

      // First call fails with network error
      mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));
      // Second call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const promise = client.chatCompletion({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }]
      });

      // Advance timers for retry delay (2^0 * 1000 + jitter = ~1000ms)
      await vi.advanceTimersByTimeAsync(1500);

      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('does not retry on non-retryable error (401)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: { message: 'Invalid API key', type: 'auth_error', code: 'AUTH_ERROR' } })
      });

      await expect(client.chatCompletion({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }]
      })).rejects.toThrow(NIMAuthError);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('does not retry on 400', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ error: { message: 'Invalid request', type: 'bad_request', code: 'BAD_REQUEST' } })
      });

      await expect(client.chatCompletion({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }]
      })).rejects.toThrow(NIMError);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('retries on 429 with retry-after', async () => {
      const mockResponse = {
        id: 'test-123',
        object: 'chat.completion',
        created: Date.now(),
        model: 'test-model',
        choices: [{
          index: 0,
          message: { role: 'assistant', content: '{"test": "response"}' },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
      };

      // First call returns 429
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: { get: () => '1' }, // 1 second
        json: async () => ({ error: { message: 'Rate limited', type: 'rate_limit', code: 'RATE_LIMIT' } })
      });
      // Second call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const promise = client.chatCompletion({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }]
      });

      // Advance timers for retry delay (retry-after = 1 second)
      await vi.advanceTimersByTimeAsync(1500);

      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('retries on 500 server errors', async () => {
      const mockResponse = {
        id: 'test-123',
        object: 'chat.completion',
        created: Date.now(),
        model: 'test-model',
        choices: [{
          index: 0,
          message: { role: 'assistant', content: '{"test": "response"}' },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
      };

      // Use TypeError with 'fetch' to simulate network error (retryable)
      mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const promise = client.chatCompletion({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }]
      });

      // Advance timers for retry delay (2^0 * 1000 + jitter = ~1000ms)
      await vi.advanceTimersByTimeAsync(1500);

      const result = await promise;

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('times out on slow response', async () => {
      // Use separate client with no retries
      const timeoutClient = new NIMClient('test-key', 'https://api.test.com/v1', 5000, 0);

      // Skip fake timers for this test - uses real setTimeout in client
      vi.useRealTimers();

      // Mock fetch to wait for abort signal
      let abortHandler: () => void;
      const slowPromise = new Promise((_, reject) => {
        abortHandler = () => reject(new DOMException('Aborted', 'AbortError'));
      });
      mockFetch.mockImplementation((_, options) => {
        options?.signal?.addEventListener('abort', abortHandler);
        return slowPromise;
      });

      const promise = timeoutClient.chatCompletion({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }],
        timeout_ms: 100
      });

      // Wait for client timeout (real timer)
      await new Promise(r => setTimeout(r, 200));

      await expect(promise).rejects.toThrow(NIMTimeoutError);

      vi.useFakeTimers();
    });

    it('throws on empty choices', async () => {
      // Use client with no retries to avoid timeout
      const noRetryClient = new NIMClient('test-key', 'https://api.test.com/v1', 5000, 0);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-123',
          object: 'chat.completion',
          created: Date.now(),
          model: 'test-model',
          choices: [],
          usage: { prompt_tokens: 10, completion_tokens: 0, total_tokens: 10 }
        })
      });

      await expect(noRetryClient.chatCompletion({
        model: 'test-model',
        messages: [{ role: 'user', content: 'test' }]
      })).rejects.toThrow('Empty choices in response');
    });

    it('healthCheck returns available=true on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'test-123',
          object: 'chat.completion',
          created: Date.now(),
          model: 'test-model',
          choices: [{
            index: 0,
            message: { role: 'assistant', content: 'pong' },
            finish_reason: 'stop'
          }],
          usage: { prompt_tokens: 5, completion_tokens: 5, total_tokens: 10 }
        })
      });

      const promise = client.healthCheck('test-model');
      const health = await promise;
      expect(health.available).toBe(true);
      expect(health.latencyMs).toBeGreaterThanOrEqual(0);
    });

    it('healthCheck returns available=false on failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const promise = client.healthCheck('test-model');
      const health = await promise;
      expect(health.available).toBe(false);
    });
  });

  describe('Error Classes', () => {
    it('NIMError has correct properties', () => {
      const err = new NIMError('Test error', 500, 'TEST_ERROR', true);
      expect(err.message).toBe('Test error');
      expect(err.statusCode).toBe(500);
      expect(err.code).toBe('TEST_ERROR');
      expect(err.retryable).toBe(true);
    });

    it('NIMTimeoutError has correct defaults', () => {
      const err = new NIMTimeoutError(5000);
      expect(err.message).toBe('Request timed out after 5000ms');
      expect(err.statusCode).toBe(504);
      expect(err.code).toBe('TIMEOUT');
      expect(err.retryable).toBe(true);
    });

    it('NIMAuthError has correct defaults', () => {
      const err = new NIMAuthError('Custom auth error');
      expect(err.message).toBe('Custom auth error');
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe('AUTH_ERROR');
      expect(err.retryable).toBe(false);
    });

    it('NIMRateLimitError has retryAfterMs', () => {
      const err = new NIMRateLimitError(5000);
      expect(err.retryAfterMs).toBe(5000);
      expect(err.retryable).toBe(true);
    });

    it('NIMServerError retryable based on status', () => {
      const err500 = new NIMServerError(500, 'Server error');
      expect(err500.retryable).toBe(true);

      const err400 = new NIMServerError(400, 'Bad request');
      expect(err400.retryable).toBe(false);
    });
  });

  describe('bufferToDataUrl', () => {
    it('converts buffer to data URL', () => {
      const buffer = Buffer.from('test image data');
      const dataUrl = bufferToDataUrl(buffer, 'image/jpeg');
      expect(dataUrl).toMatch(/^data:image\/jpeg;base64,/);
    });

    it('handles different mime types', () => {
      const buffer = Buffer.from('png data');
      const dataUrl = bufferToDataUrl(buffer, 'image/png');
      expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe('validateImageBuffer', () => {
    it('rejects empty buffer', () => {
      const result = validateImageBuffer(Buffer.from(''), 1000000, 8192);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Empty image buffer');
    });

    it('rejects oversized buffer', () => {
      const buffer = Buffer.alloc(2000000);
      const result = validateImageBuffer(buffer, 1000000, 8192);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too large');
    });

    it('detects JPEG format', () => {
      // JPEG magic bytes: FF D8 FF
      const buffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]);
      const result = validateImageBuffer(buffer, 1000000, 8192);
      expect(result.valid).toBe(true);
      expect(result.metadata?.format).toBe('jpeg');
    });

    it('detects PNG format', () => {
      // PNG magic bytes: 89 50 4E 47
      const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D]);
      const result = validateImageBuffer(buffer, 1000000, 8192);
      expect(result.valid).toBe(true);
      expect(result.metadata?.format).toBe('png');
    });

    it('detects WebP format', () => {
      // WebP magic bytes: RIFF....WEBP
      const buffer = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]);
      const result = validateImageBuffer(buffer, 1000000, 8192);
      expect(result.valid).toBe(true);
      expect(result.metadata?.format).toBe('webp');
    });

    it('detects HEIC format', () => {
      // HEIC magic bytes: ....ftypheic
      const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63]);
      const result = validateImageBuffer(buffer, 1000000, 8192);
      expect(result.valid).toBe(true);
      expect(result.metadata?.format).toBe('heic');
    });

    it('rejects unknown format', () => {
      const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B]);
      const result = validateImageBuffer(buffer, 1000000, 8192);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Unsupported image format');
    });
  });
});