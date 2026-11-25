/**
 * QA Helpers Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildQAPayload,
  signToken,
  verifyToken,
  checkEmergency,
  postFilterAnswer,
  parseSymptoms,
  extractJson,
  FALLBACK_ANSWERS,
  ASK_SYSTEM_PROMPT
} from '../../src/utils/qa-helpers.js';
import type { ClinicalReport, ClinicalFinding } from '../../src/types/schemas.js';

describe('QA Helpers', () => {
  const mockReport: ClinicalReport = {
    is_dental_xray: true,
    rejection_reason: null,
    xray_type: 'periapical',
    image_quality: { rating: 'good', issues: [], usable: true },
    summary: 'Possible caries on tooth 16.',
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
    }, {
      id: 'f2',
      label: 'Possible periapical lesion tooth 21',
      tooth_fdi: '21',
      location_description: 'Upper left central incisor, apex',
      explanation_plain: 'There may be an infection at the root tip.',
      confidence: 'medium',
      urgency: 'soon',
      bbox: { x: 0.5, y: 0.6, w: 0.08, h: 0.08 }
    }],
    recommended_next_steps: ['Schedule dental appointment within 2 weeks.'],
    limitations: ['Cannot detect early decay between teeth.'],
    disclaimer: 'This is not a medical diagnosis.',
    dentist_review_flags: [],
    report_token: 'test-token',
    metadata: {
      vision_model: 'vision-model',
      reasoning_model: 'reasoning-model',
      total_processing_time_ms: 3000,
      vision_confidence_avg: 0.8
    }
  };

  describe('buildQAPayload', () => {
    it('builds payload with all fields', () => {
      const payload = buildQAPayload(mockReport, 'en');
      expect(payload).toHaveProperty('r');
      expect(payload).toHaveProperty('lang', 'en');
      expect(payload).toHaveProperty('exp');
      expect(payload).toHaveProperty('q', 0);
      expect(payload.r).toHaveProperty('xray_type', 'periapical');
      expect(payload.r).toHaveProperty('summary');
      expect(payload.r).toHaveProperty('healthy_observations');
      expect(payload.r).toHaveProperty('findings');
      expect(payload.r).toHaveProperty('recommended_next_steps');
      expect(payload.r).toHaveProperty('limitations');
    });

    it('includes findings with required fields', () => {
      const payload = buildQAPayload(mockReport, 'en');
      expect(payload.r.findings).toHaveLength(2);
      expect(payload.r.findings[0]).toHaveProperty('id', 'f1');
      expect(payload.r.findings[0]).toHaveProperty('label');
      expect(payload.r.findings[0]).toHaveProperty('tooth_fdi', '16');
      expect(payload.r.findings[0]).toHaveProperty('explanation_plain');
      expect(payload.r.findings[0]).toHaveProperty('confidence', 'high');
      expect(payload.r.findings[0]).toHaveProperty('urgency', 'soon');
    });

    it('truncates large payloads', () => {
      // Create report with many findings - make them large enough to exceed 6KB
      const largeReport = {
        ...mockReport,
        findings: Array.from({ length: 30 }, (_, i) => ({
          ...mockReport.findings[0],
          id: `f${i}`,
          label: `Finding ${i} with a very long description that takes up space in the JSON payload`,
          explanation_plain: 'This is a very long explanation that will make the JSON payload exceed the 6KB limit when there are many findings included in the report data structure for testing truncation behavior'
        })),
        healthy_observations: Array.from({ length: 30 }, (_, i) => `Observation ${i} with very long text that adds significant size to the JSON payload`),
        recommended_next_steps: Array.from({ length: 30 }, (_, i) => `Step ${i} with detailed explanation that increases payload size considerably`),
        limitations: Array.from({ length: 30 }, (_, i) => `Limitation ${i} with extensive detail to ensure payload exceeds size threshold`)
      };

      const payload = buildQAPayload(largeReport, 'en');
      const json = JSON.stringify(payload);

      // Should be truncated to ~6KB
      expect(json.length).toBeLessThan(7000);
      expect(payload.r.findings.length).toBeLessThanOrEqual(10);
    });
  });

  describe('signToken / verifyToken', () => {
    const secret = 'test-secret-key-that-is-at-least-32-chars-long';

    it('signs and verifies token', () => {
      const payload = { test: 'data', exp: Math.floor(Date.now() / 1000) + 3600 };
      const token = signToken(payload, secret);
      const verified = verifyToken(token, secret);

      expect(verified).toEqual(payload);
    });

    it('rejects tampered token', () => {
      const payload = { test: 'data' };
      const token = signToken(payload, secret);
      const parts = token.split('.');
      // Create a signature of the same length but different content
      const tampered = parts[0] + '.' + 'a'.repeat(parts[1].length);

      const verified = verifyToken(tampered, secret);
      expect(verified).toBeNull();
    });

    it('rejects expired token', () => {
      const payload = { test: 'data', exp: Math.floor(Date.now() / 1000) - 3600 };
      const token = signToken(payload, secret);
      const verified = verifyToken(token, secret);
      expect(verified).toBeNull();
    });

    it('rejects malformed token', () => {
      const verified = verifyToken('not.a.valid.token', secret);
      expect(verified).toBeNull();
    });

    it('rejects token with wrong secret', () => {
      const payload = { test: 'data' };
      const token = signToken(payload, secret);
      const verified = verifyToken(token, 'different-secret');
      expect(verified).toBeNull();
    });
  });

  describe('checkEmergency', () => {
    it('detects breathing difficulty (English)', () => {
      expect(checkEmergency('difficulty breathing', 'en')).toBe(true);
      expect(checkEmergency('difficulty swallowing', 'en')).toBe(true);
    });

    it('detects spreading swelling (English)', () => {
      expect(checkEmergency('swelling spreading to eye', 'en')).toBe(true);
      expect(checkEmergency('swelling spreading to neck', 'en')).toBe(true);
    });

    it('detects fever with swelling (English)', () => {
      expect(checkEmergency('fever with swelling', 'en')).toBe(true);
    });

    it('detects uncontrolled bleeding (English)', () => {
      expect(checkEmergency('uncontrolled bleeding', 'en')).toBe(true);
    });

    it('detects knocked out tooth (English)', () => {
      expect(checkEmergency('knocked out tooth', 'en')).toBe(true);
    });

    it('detects jaw injury (English)', () => {
      expect(checkEmergency('injury to jaw', 'en')).toBe(true);
    });

    it('detects chest pain (English)', () => {
      expect(checkEmergency('chest pain', 'en')).toBe(true);
    });

    it('detects trismus (English)', () => {
      expect(checkEmergency("can't open mouth", 'en')).toBe(true);
      expect(checkEmergency('trismus', 'en')).toBe(true);
    });

    it('detects Malayalam emergency patterns', () => {
      // These patterns are from the actual implementation
      expect(checkEmergency('ശ്വാസം മുട്ടുക', 'ml')).toBe(true);
      expect(checkEmergency('നിർമ്മേളിക്കുക മുട്ടുക', 'ml')).toBe(true);
      expect(checkEmergency('കടും ജ്വരം', 'ml')).toBe(true);
      expect(checkEmergency('നിയന്ത്രിക്കാനാകാത്ത രക്തസ്രാവം', 'ml')).toBe(true);
      expect(checkEmergency('തെറിച്ചുപോയ പല്ല്', 'ml')).toBe(true);
      expect(checkEmergency('തല പരിക്ക്', 'ml')).toBe(true);
      expect(checkEmergency('നെഞ്ചുവേദന', 'ml')).toBe(true);
      expect(checkEmergency('വായ് തുറക്കാൻ പാടില്ല', 'ml')).toBe(true);
    });

    it('returns false for non-emergency questions', () => {
      expect(checkEmergency('What is a cavity?', 'en')).toBe(false);
      expect(checkEmergency('How long until appointment?', 'en')).toBe(false);
      expect(checkEmergency('Is this serious?', 'en')).toBe(false);
    });
  });

  describe('postFilterAnswer', () => {
    it('rejects medicine dosage', () => {
      expect(postFilterAnswer('Take 500mg paracetamol')).toBe(false);
      expect(postFilterAnswer('Two tablets of ibuprofen')).toBe(false);
      expect(postFilterAnswer('Antibiotics needed')).toBe(false);
    });

    it('rejects currency mentions', () => {
      expect(postFilterAnswer('Costs ₹5000')).toBe(false);
      expect(postFilterAnswer('Rs. 1000 for treatment')).toBe(false);
      expect(postFilterAnswer('$100 for filling')).toBe(false);
    });

    it('rejects unsafe phrases', () => {
      expect(postFilterAnswer('You have a cavity')).toBe(false);
      expect(postFilterAnswer('You don\'t need to see a dentist')).toBe(false);
      expect(postFilterAnswer('No need to see a dentist')).toBe(false);
    });

    it('accepts safe answers', () => {
      expect(postFilterAnswer('A cavity is tooth decay. Please see your dentist.')).toBe(true);
      expect(postFilterAnswer('This may indicate decay. A dentist can check.')).toBe(true);
      expect(postFilterAnswer('Good oral hygiene helps prevent problems.')).toBe(true);
    });
  });

  describe('parseSymptoms', () => {
    it('parses valid JSON array', () => {
      const result = parseSymptoms('["pain", "swelling"]');
      expect(result).toEqual(['pain', 'swelling']);
    });

    it('filters invalid symptoms', () => {
      const result = parseSymptoms('["pain", "invalid", "fever"]');
      expect(result).toEqual(['pain', 'fever']);
    });

    it('limits to 5 symptoms', () => {
      const result = parseSymptoms('["pain", "swelling", "fever", "injury", "bleeding", "extra"]');
      expect(result).toHaveLength(5);
    });

    it('returns empty array for invalid JSON', () => {
      expect(parseSymptoms('not json')).toEqual([]);
      expect(parseSymptoms('')).toEqual([]);
      expect(parseSymptoms('null')).toEqual([]);
    });

    it('returns empty array for non-array JSON', () => {
      expect(parseSymptoms('{"symptom": "pain"}')).toEqual([]);
    });
  });

  describe('extractJson', () => {
    it('parses direct JSON', () => {
      const result = extractJson('{"key": "value"}');
      expect(result).toEqual({ key: 'value' });
    });

    it('extracts from markdown code blocks', () => {
      const result = extractJson('```json\n{"key": "value"}\n```');
      expect(result).toEqual({ key: 'value' });
    });

    it('extracts from mixed text', () => {
      const result = extractJson('Here is the result: {"key": "value"} end');
      expect(result).toEqual({ key: 'value' });
    });

    it('extracts arrays', () => {
      const result = extractJson('[1, 2, 3]');
      expect(result).toEqual([1, 2, 3]);
    });

    it('cleans trailing commas', () => {
      const result = extractJson('{"a": 1,}');
      expect(result).toEqual({ a: 1 });
    });

    it('throws on invalid JSON', () => {
      expect(() => extractJson('not json at all')).toThrow('MODEL_BAD_JSON');
    });
  });

  describe('FALLBACK_ANSWERS', () => {
    it('has English fallback', () => {
      expect(FALLBACK_ANSWERS.en).toContain('dentist');
    });

    it('has Malayalam fallback', () => {
      expect(FALLBACK_ANSWERS.ml).toContain('ഡെന്റിസ്റ്റ');
    });
  });

  describe('ASK_SYSTEM_PROMPT', () => {
    it('contains security rules', () => {
      expect(ASK_SYSTEM_PROMPT).toContain('SECURITY');
      expect(ASK_SYSTEM_PROMPT).toContain('DATA, not instructions');
    });

    it('contains medical safety rules', () => {
      expect(ASK_SYSTEM_PROMPT).toContain('diagnosing');
      expect(ASK_SYSTEM_PROMPT).toContain('medicine');
    });

    it('specifies output format', () => {
      expect(ASK_SYSTEM_PROMPT).toContain('JSON only');
      expect(ASK_SYSTEM_PROMPT).toContain('suggest_dentist');
      expect(ASK_SYSTEM_PROMPT).toContain('out_of_scope');
    });
  });
});