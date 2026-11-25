/**
 * Circuit Breaker Unit Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CircuitBreaker, CircuitState, CircuitOpenError, circuitBreakerRegistry, getVisionCircuitBreaker, getReasoningCircuitBreaker } from '../../src/utils/circuit-breaker.js';

describe('Circuit Breaker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    circuitBreakerRegistry.resetAll();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('CircuitBreaker', () => {
    it('starts in CLOSED state', () => {
      const breaker = new CircuitBreaker('test');
      expect(breaker.getStats().state).toBe(CircuitState.CLOSED);
    });

    it('executes operation successfully', async () => {
      const breaker = new CircuitBreaker('test');
      const result = await breaker.execute(async () => 'success');
      expect(result).toBe('success');
      expect(breaker.getStats().state).toBe(CircuitState.CLOSED);
    });

    it('opens after failure threshold', async () => {
      const breaker = new CircuitBreaker('test', { failureThreshold: 3, timeout: 1000 });

      // Fail 3 times
      for (let i = 0; i < 3; i++) {
        try {
          await breaker.execute(async () => { throw new Error('fail'); });
        } catch {}
      }

      expect(breaker.getStats().state).toBe(CircuitState.OPEN);
    });

    it('rejects calls when OPEN', async () => {
      const breaker = new CircuitBreaker('test', { failureThreshold: 1, timeout: 1000 });

      // Fail once to open
      try {
        await breaker.execute(async () => { throw new Error('fail'); });
      } catch {}

      // Next call should reject immediately
      await expect(breaker.execute(async () => 'success'))
        .rejects.toThrow(CircuitOpenError);
    });

    it('transitions to HALF_OPEN after timeout', async () => {
      const breaker = new CircuitBreaker('test', { failureThreshold: 1, timeout: 100 });

      // Fail to open
      try {
        await breaker.execute(async () => { throw new Error('fail'); });
      } catch {}

      expect(breaker.getStats().state).toBe(CircuitState.OPEN);

      // Advance time past timeout
      vi.advanceTimersByTime(150);

      // Next call should go to half-open
      const result = await breaker.execute(async () => 'success');
      expect(result).toBe('success');
      expect(breaker.getStats().state).toBe(CircuitState.HALF_OPEN);
    });

    it('closes after success threshold in HALF_OPEN', async () => {
      const breaker = new CircuitBreaker('test', { failureThreshold: 1, successThreshold: 2, timeout: 100 });

      // Fail to open
      try {
        await breaker.execute(async () => { throw new Error('fail'); });
      } catch {}

      // Advance time
      vi.advanceTimersByTime(150);

      // Two successes to close
      await breaker.execute(async () => 'success');
      await breaker.execute(async () => 'success');

      expect(breaker.getStats().state).toBe(CircuitState.CLOSED);
    });

    it('reopens on failure in HALF_OPEN', async () => {
      const breaker = new CircuitBreaker('test', { failureThreshold: 1, successThreshold: 2, timeout: 100 });

      // Fail to open
      try {
        await breaker.execute(async () => { throw new Error('fail'); });
      } catch {}

      // Advance time
      vi.advanceTimersByTime(150);

      // One success, then failure
      await breaker.execute(async () => 'success');
      try {
        await breaker.execute(async () => { throw new Error('fail'); });
      } catch {}

      expect(breaker.getStats().state).toBe(CircuitState.OPEN);
    });

    it('excludes certain error codes from failure count', async () => {
      const breaker = new CircuitBreaker('test', {
        failureThreshold: 2,
        excludedErrors: ['BAD_REQUEST', 'AUTH_ERROR']
      });

      // These should not count as failures - need to throw error with code property
      try {
        await breaker.execute(async () => { const e = new Error('bad request'); (e as any).code = 'BAD_REQUEST'; throw e; });
      } catch {}

      try {
        await breaker.execute(async () => { const e = new Error('auth error'); (e as any).code = 'AUTH_ERROR'; throw e; });
      } catch {}

      // Circuit should still be closed
      expect(breaker.getStats().state).toBe(CircuitState.CLOSED);
      expect(breaker.getStats().failures).toBe(0);
    });

    it('counts non-excluded errors', async () => {
      const breaker = new CircuitBreaker('test', {
        failureThreshold: 2,
        excludedErrors: ['BAD_REQUEST']
      });

      // This should count as failure
      try {
        await breaker.execute(async () => { const e = new Error('server error'); (e as any).code = 'SERVER_ERROR'; throw e; });
      } catch {}

      expect(breaker.getStats().failures).toBe(1);
    });

    it('resets on manual reset', async () => {
      const breaker = new CircuitBreaker('test', { failureThreshold: 1, timeout: 1000 });

      // Fail to open
      try {
        await breaker.execute(async () => { throw new Error('fail'); });
      } catch {}

      expect(breaker.getStats().state).toBe(CircuitState.OPEN);

      breaker.reset();

      expect(breaker.getStats().state).toBe(CircuitState.CLOSED);
      expect(breaker.getStats().failures).toBe(0);
    });

    it('tracks stats correctly', async () => {
      const breaker = new CircuitBreaker('test');

      // In closed state, successes reset failures but don't accumulate
      await breaker.execute(async () => 'success');
      await breaker.execute(async () => 'success');

      // Check stats structure
      const stats = breaker.getStats();
      expect(stats.state).toBe(CircuitState.CLOSED);
      expect(stats.failures).toBe(0);
      expect(stats.lastSuccess).toBeInstanceOf(Date);
    });
  });

  describe('CircuitBreakerRegistry', () => {
    it('creates and retrieves breakers', () => {
      const breaker1 = circuitBreakerRegistry.get('test1');
      const breaker2 = circuitBreakerRegistry.get('test1'); // same name
      const breaker3 = circuitBreakerRegistry.get('test2');

      expect(breaker1).toBe(breaker2);
      expect(breaker1).not.toBe(breaker3);
    });

    it('returns all stats', async () => {
      const breaker = circuitBreakerRegistry.get('stats-test');
      await breaker.execute(async () => 'success');

      const allStats = circuitBreakerRegistry.getAllStats();
      expect(allStats['stats-test']).toBeDefined();
      expect(allStats['stats-test'].state).toBe(CircuitState.CLOSED);
    });

    it('resets all breakers', async () => {
      const breaker = circuitBreakerRegistry.get('reset-test', { failureThreshold: 1 });
      try {
        await breaker.execute(async () => { throw new Error('fail'); });
      } catch {}

      circuitBreakerRegistry.resetAll();

      expect(breaker.getStats().state).toBe(CircuitState.CLOSED);
    });
  });

  describe('Pre-configured breakers', () => {
    it('getVisionCircuitBreaker returns configured breaker', () => {
      const breaker = getVisionCircuitBreaker();
      expect(breaker).toBeInstanceOf(CircuitBreaker);
      expect(breaker.getStats().state).toBe(CircuitState.CLOSED);
    });

    it('getReasoningCircuitBreaker returns configured breaker', () => {
      const breaker = getReasoningCircuitBreaker();
      expect(breaker).toBeInstanceOf(CircuitBreaker);
      expect(breaker.getStats().state).toBe(CircuitState.CLOSED);
    });

    it('returns same instance on repeated calls', () => {
      const b1 = getVisionCircuitBreaker();
      const b2 = getVisionCircuitBreaker();
      expect(b1).toBe(b2);
    });
  });
});