/**
 * Logger Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, requestLogger, logError, auditLog } from '../../src/utils/logger.js';
import { redactPII } from '../../src/utils/logger.js';

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.resetModules();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('redactPII', () => {
    it('redacts email addresses', () => {
      const result = redactPII('Contact user@example.com for help');
      expect(result).toBe('Contact [EMAIL] for help');
    });

    it('redacts phone numbers', () => {
      const result = redactPII('Call 555-123-4567 or (555) 123-4567');
      expect(result).toContain('[PHONE]');
    });

    it('redacts credit cards', () => {
      const result = redactPII('Card 1234-5678-9012-3456');
      expect(result).toBe('Card [CARD]');
    });

    it('redacts JWT tokens', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const result = redactPII(`Bearer ${token}`);
      expect(result).toContain('[JWT]');
      expect(result).not.toContain('eyJhbGci');
    });

    it('redacts long base64 strings', () => {
      const b64 = 'a'.repeat(150);
      const result = redactPII(`data:${b64}`);
      expect(result).toContain('[BASE64]');
      expect(result).not.toContain(b64);
    });

    it('redacts patient IDs', () => {
      const result = redactPII('Patient ID: PAT-123456');
      expect(result).toContain('[PATIENT_ID]');
    });

    it('redacts names', () => {
      const result = redactPII('Contact John Smith');
      expect(result).toBe('Contact [NAME]');
    });
  });

  describe('logger', () => {
    it('logs info messages', () => {
      logger.info('Test message', { key: 'value' });
      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0][0];
      expect(call).toContain('Test message');
      expect(call).toContain('key');
    });

    it('logs error messages to stderr', () => {
      logger.error('Error message', { op: 'test' }, new Error('Test error'));
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('Error message');
      expect(call).toContain('Test error');
    });

    it('logs warn messages to stderr', () => {
      logger.warn('Warning message', { key: 'value' });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('child logger includes parent context', () => {
      const child = logger.child({ requestId: 'req-123' });
      child.info('Child message');
      const call = consoleLogSpy.mock.calls[0][0];
      expect(call).toContain('requestId');
      expect(call).toContain('req-123');
    });

    it('child logger merges extra context', () => {
      const child = logger.child({ requestId: 'req-123' });
      child.info('Child message', { userId: 'user-456' });
      const call = consoleLogSpy.mock.calls[0][0];
      expect(call).toContain('requestId');
      expect(call).toContain('userId');
    });

    it('time helper logs duration', () => {
      const timer = logger.time('test-operation', { requestId: 'req-123' });
      timer.end('Operation complete');
      const call = consoleLogSpy.mock.calls[0][0];
      expect(call).toContain('Operation complete');
      expect(call).toContain('durationMs');
    });

    it('time helper logs error with duration', () => {
      const timer = logger.time('test-operation');
      timer.endError('Operation failed', new Error('Test error'));
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('Operation failed');
      expect(call).toContain('durationMs');
    });
  });

  describe('requestLogger middleware', () => {
    it('adds request ID header', () => {
      const middleware = requestLogger();
      const req = { method: 'GET', path: '/api/test', ip: '127.0.0.1', headers: {}, get: () => 'test-agent' } as any;
      const res = { setHeader: vi.fn(), on: vi.fn((event, cb) => { if (event === 'finish') cb(); }) } as any;
      const next = vi.fn();

      middleware(req, res, next);

      expect(res.setHeader).toHaveBeenCalledWith('x-request-id', expect.any(String));
      expect(next).toHaveBeenCalled();
    });

    it('logs request start and finish', () => {
      const middleware = requestLogger();
      const req = { method: 'POST', path: '/api/analyze', ip: '127.0.0.1', headers: {}, get: () => 'test-agent' } as any;
      let finishCb: (() => void) | null = null;
      const res = { setHeader: vi.fn(), on: vi.fn((event, cb) => { if (event === 'finish') finishCb = cb; }), statusCode: 200 } as any;
      const next = vi.fn();

      middleware(req, res, next);
      if (finishCb) finishCb(); // Simulate response finish

      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      const startCall = consoleLogSpy.mock.calls[0][0];
      const finishCall = consoleLogSpy.mock.calls[1][0];
      expect(startCall).toContain('Request started');
      expect(finishCall).toContain('Request completed');
      expect(finishCall).toContain('200');
    });
  });

  describe('logError', () => {
    it('logs error with operation context', () => {
      logError('analyzeImage', new Error('Model unavailable'), { requestId: 'req-123' });
      expect(consoleErrorSpy).toHaveBeenCalled();
      const call = consoleErrorSpy.mock.calls[0][0];
      expect(call).toContain('analyzeImage failed');
      expect(call).toContain('Model unavailable');
      expect(call).toContain('requestId');
    });
  });

  describe('auditLog', () => {
    it('logs audit entry with required fields', () => {
      auditLog('report_viewed', {
        userId: 'dentist-123',
        resource: 'report',
        resourceId: 'report-456'
      });
      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0][0];
      expect(call).toContain('AUDIT: report_viewed');
      expect(call).toContain('dentist-123');
      expect(call).toContain('report');
      expect(call).toContain('report-456');
      expect(call).toContain('audit');
    });
  });
});