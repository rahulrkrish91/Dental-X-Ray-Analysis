/**
 * Validation Module Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateVisionOutput,
  validateFindings,
  validatePeriodontal,
  validateRestorations,
  validateCrossConsistency,
  validateConfidenceCalibration,
  validatePathologySeverity,
  validateSurfaces,
  validateBBox,
  isValidFDI,
  isPrimaryTooth,
  getToothType,
  filterFindingsByConfidence,
  confidenceToCategorical,
  pathologyToUrgency
} from '../../src/validation/validator.js';
import type { VisionOutput, VisionFinding, ValidationFlag } from '../../src/types/schemas.js';

function createBaseVisionOutput(overrides: Partial<VisionOutput> = {}): VisionOutput {
  return {
    image_quality: {
      adequate: true,
      rating: 'good',
      issues: [],
      sharpness_score: 80,
      contrast_score: 75,
      exposure_score: 85
    },
    teeth_present: [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28],
    teeth_missing: [],
    findings: [],
    periodontal: {
      bone_loss: 'none',
      teeth_affected: [],
      description: ''
    },
    restorations: [],
    other_observations: [],
    processing_metadata: {
      model: 'test-model',
      processing_time_ms: 1000,
      tokens_used: 500
    },
    ...overrides
  };
}

function createFinding(overrides: Partial<VisionFinding> = {}): VisionFinding {
  return {
    tooth: 16,
    tooth_fdi: '16',
    surfaces: ['O'],
    pathology: 'caries',
    severity: 'moderate',
    confidence: 0.85,
    description: 'Occlusal caries on upper right first molar',
    bbox: { x: 0.3, y: 0.4, w: 0.1, h: 0.1 },
    ...overrides
  };
}

describe('Validation Module', () => {
  describe('isValidFDI', () => {
    it('accepts valid adult teeth 11-48', () => {
      expect(isValidFDI(11)).toBe(true);
      expect(isValidFDI(18)).toBe(true);
      expect(isValidFDI(21)).toBe(true);
      expect(isValidFDI(48)).toBe(true);
      expect(isValidFDI(36)).toBe(true);
    });

    it('rejects invalid quadrants', () => {
      expect(isValidFDI(51)).toBe(false);
      expect(isValidFDI(0)).toBe(false);
      expect(isValidFDI(99)).toBe(false);
    });

    it('rejects invalid positions', () => {
      expect(isValidFDI(19)).toBe(false);
      expect(isValidFDI(10)).toBe(false);
    });
  });

  describe('isPrimaryTooth', () => {
    it('accepts primary teeth 51-85', () => {
      expect(isPrimaryTooth(51)).toBe(true);
      expect(isPrimaryTooth(55)).toBe(true);
      expect(isPrimaryTooth(85)).toBe(true);
    });

    it('rejects adult teeth', () => {
      expect(isPrimaryTooth(11)).toBe(false);
      expect(isPrimaryTooth(48)).toBe(false);
    });
  });

  describe('getToothType', () => {
    it('returns correct types', () => {
      expect(getToothType(11)).toBe('incisor');
      expect(getToothType(12)).toBe('incisor');
      expect(getToothType(13)).toBe('canine');
      expect(getToothType(14)).toBe('premolar');
      expect(getToothType(15)).toBe('premolar');
      expect(getToothType(16)).toBe('molar');
      expect(getToothType(17)).toBe('molar');
      expect(getToothType(18)).toBe('molar');
    });
  });

  describe('validateSurfaces', () => {
    it('accepts valid surfaces for molar', () => {
      const result = validateSurfaces(16, ['M', 'D', 'O', 'B', 'L']);
      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('rejects invalid surface for incisor', () => {
      const result = validateSurfaces(11, ['O']); // incisors don't have occlusal
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Surface O not typical for incisor (tooth 11)');
    });

    it('rejects contradictory surfaces', () => {
      const result = validateSurfaces(16, ['O', 'I']);
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Cannot have both occlusal and incisal surfaces');
    });
  });

  describe('validateBBox', () => {
    it('accepts valid bbox', () => {
      const result = validateBBox({ x: 0.2, y: 0.3, w: 0.1, h: 0.15 });
      expect(result.valid).toBe(true);
    });

    it('rejects out of range coordinates', () => {
      const result = validateBBox({ x: -0.1, y: 0.3, w: 0.1, h: 0.1 });
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('bbox.x out of range [0,1]: -0.1');
    });

    it('rejects bbox exceeding image bounds', () => {
      const result = validateBBox({ x: 0.8, y: 0.8, w: 0.3, h: 0.3 });
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('bbox exceeds image width: x+w=1.1');
    });

    it('flags suspiciously large bbox', () => {
      const result = validateBBox({ x: 0.05, y: 0.05, w: 0.95, h: 0.95 });
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Bounding box covers >90% of image (likely not localized)');
    });

    it('flags suspiciously small bbox', () => {
      const result = validateBBox({ x: 0.5, y: 0.5, w: 0.005, h: 0.005 });
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Bounding box very small (<1% of image dimension)');
    });

    it('accepts null bbox', () => {
      const result = validateBBox(null);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateVisionOutput', () => {
    it('passes valid output', () => {
      const output = createBaseVisionOutput({
        findings: [createFinding()]
      });
      const result = validateVisionOutput(output);
      expect(result.passed).toBe(true);
      expect(result.flags.filter(f => f.severity === 'critical')).toHaveLength(0);
    });

    it('flags inadequate image quality', () => {
      const output = createBaseVisionOutput({
        image_quality: { adequate: false, rating: 'poor', issues: ['blurry', 'dark'] }
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'IMAGE_QUALITY_INADEQUATE')).toBe(true);
    });

    it('flags invalid tooth in teeth_present', () => {
      const output = createBaseVisionOutput({
        teeth_present: [11, 99] // 99 invalid
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'INVALID_TOOTH_NUMBER')).toBe(true);
    });

    it('flags tooth present and missing', () => {
      const output = createBaseVisionOutput({
        teeth_present: [11, 12],
        teeth_missing: [12, 13]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'TOOTH_PRESENT_AND_MISSING')).toBe(true);
    });

    it('flags finding with tooth not in teeth_present', () => {
      const output = createBaseVisionOutput({
        teeth_present: [11, 12],
        findings: [createFinding({ tooth: 16, tooth_fdi: '16' })] // 16 not in present
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'FINDING_TOOTH_NOT_IN_PRESENT')).toBe(true);
    });

    it('flags invalid confidence range', () => {
      const output = createBaseVisionOutput({
        findings: [createFinding({ confidence: 1.5 })]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'INVALID_CONFIDENCE_RANGE')).toBe(true);
    });

    it('flags very low confidence', () => {
      const output = createBaseVisionOutput({
        findings: [createFinding({ confidence: 0.2 })]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'VERY_LOW_CONFIDENCE')).toBe(true);
    });

    it('flags low confidence', () => {
      const output = createBaseVisionOutput({
        findings: [createFinding({ confidence: 0.4 })]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'LOW_CONFIDENCE')).toBe(true);
    });

    it('flags duplicate findings', () => {
      const output = createBaseVisionOutput({
        findings: [
          createFinding({ tooth: 16, pathology: 'caries' }),
          createFinding({ tooth: 16, pathology: 'caries' })
        ]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'DUPLICATE_FINDING')).toBe(true);
    });

    it('flags severe caries with low confidence', () => {
      const output = createBaseVisionOutput({
        findings: [createFinding({ pathology: 'caries', severity: 'severe', confidence: 0.6 })]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'SEVERE_CARIES_LOW_CONFIDENCE')).toBe(true);
    });

    it('flags periapical with low confidence', () => {
      const output = createBaseVisionOutput({
        findings: [createFinding({ pathology: 'periapical', confidence: 0.4 })]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'PERIAPICAL_LOW_CONFIDENCE')).toBe(true);
    });

    it('flags fracture with high confidence', () => {
      const output = createBaseVisionOutput({
        findings: [createFinding({ pathology: 'fracture', confidence: 0.9 })]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'FRACTURE_HIGH_CONFIDENCE')).toBe(true);
    });
  });

  describe('validatePeriodontal', () => {
    it('flags perio tooth not in present', () => {
      const output = createBaseVisionOutput({
        teeth_present: [11, 12],
        periodontal: { bone_loss: 'moderate', teeth_affected: [16] }
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'PERIO_TOOTH_NOT_PRESENT')).toBe(true);
    });

    it('flags missing teeth_affected when bone_loss present', () => {
      const output = createBaseVisionOutput({
        periodontal: { bone_loss: 'moderate', teeth_affected: [] }
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'PERIO_NO_TEETH_SPECIFIED')).toBe(true);
    });
  });

  describe('validateRestorations', () => {
    it('flags restoration on invalid tooth', () => {
      const output = createBaseVisionOutput({
        restorations: [{ tooth_fdi: '99', type: 'crown', condition: 'intact' }]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'INVALID_RESTORATION_TOOTH')).toBe(true);
    });
  });

  describe('validateCrossConsistency', () => {
    it('flags multiple teeth same pathology', () => {
      const output = createBaseVisionOutput({
        findings: [
          createFinding({ tooth: 16, pathology: 'caries' }),
          createFinding({ tooth: 26, pathology: 'caries' }),
          createFinding({ tooth: 36, pathology: 'caries' }),
          createFinding({ tooth: 46, pathology: 'caries' }),
          createFinding({ tooth: 17, pathology: 'caries' })
        ]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'MULTIPLE_TEETH_SAME_PATHOLOGY')).toBe(true);
    });

    it('flags multiple findings same tooth', () => {
      const output = createBaseVisionOutput({
        findings: [
          createFinding({ tooth: 16, pathology: 'caries' }),
          createFinding({ tooth: 16, pathology: 'periapical' })
        ]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'MULTIPLE_FINDINGS_SAME_TOOTH')).toBe(true);
    });
  });

  describe('validateConfidenceCalibration', () => {
    it('flags all high confidence', () => {
      const output = createBaseVisionOutput({
        findings: [
          createFinding({ confidence: 0.9 }),
          createFinding({ confidence: 0.85 }),
          createFinding({ confidence: 0.92 }),
          createFinding({ confidence: 0.88 })
        ]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'ALL_HIGH_CONFIDENCE')).toBe(true);
    });

    it('flags predominantly low confidence', () => {
      const output = createBaseVisionOutput({
        findings: [
          createFinding({ confidence: 0.3 }),
          createFinding({ confidence: 0.2 }),
          createFinding({ confidence: 0.4 }),
          createFinding({ confidence: 0.25 })
        ]
      });
      const result = validateVisionOutput(output);
      expect(result.flags.some(f => f.code === 'PREDOMINANTLY_LOW_CONFIDENCE')).toBe(true);
    });
  });

  describe('filterFindingsByConfidence', () => {
    it('filters by threshold', () => {
      const findings = [
        createFinding({ confidence: 0.9 }),
        createFinding({ confidence: 0.5 }),
        createFinding({ confidence: 0.3 }),
        createFinding({ confidence: 0.1 })
      ];
      const filtered = filterFindingsByConfidence(findings, 0.4);
      expect(filtered).toHaveLength(2);
      expect(filtered[0].confidence).toBe(0.9);
      expect(filtered[1].confidence).toBe(0.5);
    });
  });

  describe('confidenceToCategorical', () => {
    it('maps correctly', () => {
      expect(confidenceToCategorical(0.9)).toBe('high');
      expect(confidenceToCategorical(0.8)).toBe('high');
      expect(confidenceToCategorical(0.79)).toBe('medium');
      expect(confidenceToCategorical(0.5)).toBe('medium');
      expect(confidenceToCategorical(0.49)).toBe('low');
      expect(confidenceToCategorical(0.3)).toBe('low');
    });
  });

  describe('pathologyToUrgency', () => {
    it('maps urgent conditions', () => {
      expect(pathologyToUrgency('periapical', 'severe')).toBe('urgent');
      expect(pathologyToUrgency('fracture', 'severe')).toBe('urgent');
      expect(pathologyToUrgency('lesion_cyst', 'severe')).toBe('urgent');
    });

    it('maps soon conditions', () => {
      expect(pathologyToUrgency('caries', 'moderate')).toBe('soon');
      expect(pathologyToUrgency('periodontal', 'mild')).toBe('soon');
      expect(pathologyToUrgency('bone_loss', 'moderate')).toBe('soon');
      expect(pathologyToUrgency('periapical', 'mild')).toBe('soon');
    });

    it('maps routine conditions', () => {
      expect(pathologyToUrgency('restoration', 'mild')).toBe('routine');
      expect(pathologyToUrgency('crown', 'mild')).toBe('routine');
      expect(pathologyToUrgency('implant', 'mild')).toBe('routine');
      expect(pathologyToUrgency('impacted', 'mild')).toBe('routine');
    });
  });
});