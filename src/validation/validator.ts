/**
 * Vision Output Validator
 * Anatomical consistency, schema compliance, and clinical plausibility checks
 */

import type { VisionOutput, VisionFinding, ValidationFlag, ValidatedVisionOutput } from '../types/schemas.js';
import { VisionOutputSchema, VisionFindingSchema, ValidationFlagSchema, ValidatedVisionOutputSchema } from '../types/schemas.js';

/**
 * FDI tooth quadrants for anatomical validation
 */
const FDI_QUADRANTS = {
  1: { start: 11, end: 18, name: 'upper_right', arch: 'maxillary', side: 'right' },
  2: { start: 21, end: 28, name: 'upper_left', arch: 'maxillary', side: 'left' },
  3: { start: 31, end: 38, name: 'lower_left', arch: 'mandibular', side: 'left' },
  4: { start: 41, end: 48, name: 'lower_right', arch: 'mandibular', side: 'right' }
} as const;

/**
 * Valid surfaces per tooth type (simplified)
 */
const VALID_SURFACES_BY_TYPE: Record<string, string[]> = {
  'incisor': ['M', 'D', 'I', 'B', 'L'],
  'canine': ['M', 'D', 'I', 'B', 'L'],
  'premolar': ['M', 'D', 'O', 'B', 'L'],
  'molar': ['M', 'D', 'O', 'B', 'L']
};

/**
 * Get tooth type from FDI number
 */
export function getToothType(fdi: number): string {
  const position = fdi % 10;
  if (position === 1 || position === 2) return 'incisor';
  if (position === 3) return 'canine';
  if (position === 4 || position === 5) return 'premolar';
  return 'molar';
}

/**
 * Check if FDI number is anatomically valid (adult teeth 11-48)
 */
export function isValidFDI(fdi: number): boolean {
  if (fdi < 11 || fdi > 48) return false;
  const quadrant = Math.floor(fdi / 10);
  const position = fdi % 10;
  if (quadrant < 1 || quadrant > 4) return false;
  if (position < 1 || position > 8) return false;
  return true;
}

/**
 * Check if FDI is primary (deciduous) tooth (51-85)
 */
export function isPrimaryTooth(fdi: number): boolean {
  return fdi >= 51 && fdi <= 85;
}

/**
 * Validate surfaces are appropriate for tooth type
 */
export function validateSurfaces(fdi: number, surfaces: string[]): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const toothType = getToothType(fdi);
  const validSurfaces = VALID_SURFACES_BY_TYPE[toothType] || [];

  for (const surface of surfaces) {
    if (!validSurfaces.includes(surface)) {
      issues.push(`Surface ${surface} not typical for ${toothType} (tooth ${fdi})`);
    }
  }

  // Check for contradictory surfaces
  const hasMesial = surfaces.includes('M');
  const hasDistal = surfaces.includes('D');
  const hasOcclusal = surfaces.includes('O');
  const hasIncisal = surfaces.includes('I');

  if (hasOcclusal && hasIncisal) {
    issues.push('Cannot have both occlusal and incisal surfaces');
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Validate bounding box coordinates (normalized 0-1)
 */
export function validateBBox(bbox: VisionFinding['bbox']): { valid: boolean; issues: string[] } {
  if (!bbox) return { valid: true, issues: [] };

  const issues: string[] = [];
  const { x, y, w, h } = bbox;

  if (x < 0 || x > 1) issues.push(`bbox.x out of range [0,1]: ${x}`);
  if (y < 0 || y > 1) issues.push(`bbox.y out of range [0,1]: ${y}`);
  if (w <= 0 || w > 1) issues.push(`bbox.w out of range (0,1]: ${w}`);
  if (h <= 0 || h > 1) issues.push(`bbox.h out of range (0,1]: ${h}`);
  if (x + w > 1) issues.push(`bbox exceeds image width: x+w=${x + w}`);
  if (y + h > 1) issues.push(`bbox exceeds image height: y+h=${y + h}`);

  // Flag suspiciously large boxes (likely full image)
  if (w > 0.9 && h > 0.9) {
    issues.push('Bounding box covers >90% of image (likely not localized)');
  }

  // Flag suspiciously small boxes
  if (w < 0.01 || h < 0.01) {
    issues.push('Bounding box very small (<1% of image dimension)');
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Main validation function
 */
export function validateVisionOutput(visionOutput: VisionOutput): ValidatedVisionOutput {
  const flags: ValidationFlag[] = [];
  let passed = true;

  // 1. Schema validation (already done by Zod, but double-check)
  const schemaResult = VisionOutputSchema.safeParse(visionOutput);
  if (!schemaResult.success) {
    flags.push({
      code: 'SCHEMA_VALIDATION_FAILED',
      severity: 'critical',
      message: `Schema validation failed: ${schemaResult.error.message}`,
      finding_index: null
    });
    passed = false;
  }

  // 2. Image quality validation
  if (!visionOutput.image_quality.adequate) {
    flags.push({
      code: 'IMAGE_QUALITY_INADEQUATE',
      severity: 'warning',
      message: `Image quality inadequate: ${visionOutput.image_quality.issues.join(', ')}`,
      finding_index: null
    });
  }

  // 3. Teeth present validation
  const allTeeth = new Set<number>();
  for (const tooth of visionOutput.teeth_present) {
    if (!isValidFDI(tooth) && !isPrimaryTooth(tooth)) {
      flags.push({
        code: 'INVALID_TOOTH_NUMBER',
        severity: 'warning',
        message: `Invalid tooth number in teeth_present: ${tooth}`,
        finding_index: null,
        tooth_fdi: String(tooth)
      });
    }
    allTeeth.add(tooth);
  }

  for (const tooth of visionOutput.teeth_missing) {
    if (!isValidFDI(tooth) && !isPrimaryTooth(tooth)) {
      flags.push({
        code: 'INVALID_TOOTH_NUMBER',
        severity: 'warning',
        message: `Invalid tooth number in teeth_missing: ${tooth}`,
        finding_index: null,
        tooth_fdi: String(tooth)
      });
    }
  }

  // Check for duplicates between present/missing
  const intersection = [...visionOutput.teeth_present].filter(t => visionOutput.teeth_missing.includes(t));
  if (intersection.length > 0) {
    flags.push({
      code: 'TOOTH_PRESENT_AND_MISSING',
      severity: 'warning',
      message: `Teeth listed as both present and missing: ${intersection.join(', ')}`,
      finding_index: null
    });
  }

  // 4. Findings validation
  const findingFlags = validateFindings(visionOutput.findings, allTeeth);
  flags.push(...findingFlags.flags);
  if (!findingFlags.passed) passed = false;

  // 5. Periodontal validation
  const perioFlags = validatePeriodontal(visionOutput.periodontal, allTeeth);
  flags.push(...perioFlags);

  // 6. Restorations validation
  const restoFlags = validateRestorations(visionOutput.restorations, allTeeth);
  flags.push(...restoFlags);

  // 7. Cross-finding consistency checks
  const crossFlags = validateCrossConsistency(visionOutput);
  flags.push(...crossFlags);

  // 8. Confidence calibration flags
  const confidenceFlags = validateConfidenceCalibration(visionOutput.findings);
  flags.push(...confidenceFlags);

  return {
    data: visionOutput,
    flags,
    passed
  };
}

/**
 * Validate individual findings
 */
export function validateFindings(
  findings: VisionFinding[],
  teethPresent: Set<number>
): { flags: ValidationFlag[]; passed: boolean } {
  const flags: ValidationFlag[] = [];
  let passed = true;

  for (let i = 0; i < findings.length; i++) {
    const finding = findings[i];

    // Validate tooth number
    if (finding.tooth !== null && finding.tooth !== undefined) {
      if (!isValidFDI(finding.tooth) && !isPrimaryTooth(finding.tooth)) {
        flags.push({
          code: 'INVALID_FINDING_TOOTH',
          severity: 'warning',
          message: `Finding ${i}: invalid tooth number ${finding.tooth}`,
          finding_index: i,
          tooth_fdi: String(finding.tooth)
        });
      } else if (!teethPresent.has(finding.tooth)) {
        flags.push({
          code: 'FINDING_TOOTH_NOT_IN_PRESENT',
          severity: 'info',
          message: `Finding ${i}: tooth ${finding.tooth} not in teeth_present list`,
          finding_index: i,
          tooth_fdi: finding.tooth_fdi
        });
      }
    }

    // Validate FDI format
    if (finding.tooth_fdi) {
      const fdiNum = parseInt(finding.tooth_fdi);
      if (!isValidFDI(fdiNum) && !isPrimaryTooth(fdiNum)) {
        flags.push({
          code: 'INVALID_FDI_FORMAT',
          severity: 'warning',
          message: `Finding ${i}: invalid FDI format ${finding.tooth_fdi}`,
          finding_index: i,
          tooth_fdi: finding.tooth_fdi
        });
      }
    }

    // Validate surfaces
    if (finding.tooth && finding.surfaces.length > 0) {
      const surfValidation = validateSurfaces(finding.tooth, finding.surfaces);
      for (const issue of surfValidation.issues) {
        flags.push({
          code: 'INVALID_SURFACE_FOR_TOOTH',
          severity: 'info',
          message: `Finding ${i}: ${issue}`,
          finding_index: i,
          tooth_fdi: finding.tooth_fdi
        });
      }
    }

    // Validate bbox
    const bboxValidation = validateBBox(finding.bbox);
    for (const issue of bboxValidation.issues) {
      flags.push({
        code: 'INVALID_BBOX',
        severity: issue.includes('90%') || issue.includes('<1%') ? 'warning' : 'info',
        message: `Finding ${i}: ${issue}`,
        finding_index: i,
        tooth_fdi: finding.tooth_fdi
      });
    }

    // Validate confidence range
    if (finding.confidence < 0 || finding.confidence > 1) {
      flags.push({
        code: 'INVALID_CONFIDENCE_RANGE',
        severity: 'warning',
        message: `Finding ${i}: confidence ${finding.confidence} out of range [0,1]`,
        finding_index: i,
        tooth_fdi: finding.tooth_fdi
      });
    }

    // Low confidence flag
    if (finding.confidence < 0.3) {
      flags.push({
        code: 'VERY_LOW_CONFIDENCE',
        severity: 'warning',
        message: `Finding ${i}: very low confidence (${finding.confidence.toFixed(2)}) - may be unreliable`,
        finding_index: i,
        tooth_fdi: finding.tooth_fdi
      });
    } else if (finding.confidence < 0.5) {
      flags.push({
        code: 'LOW_CONFIDENCE',
        severity: 'info',
        message: `Finding ${i}: low confidence (${finding.confidence.toFixed(2)}) - dentist verification recommended`,
        finding_index: i,
        tooth_fdi: finding.tooth_fdi
      });
    }

    // Validate pathology/severity combinations
    const pathologySeverityFlags = validatePathologySeverity(finding, i);
    flags.push(...pathologySeverityFlags);
  }

  // Check for duplicate findings (same tooth, same pathology)
  const findingKeys = new Map<string, number>();
  for (let i = 0; i < findings.length; i++) {
    const f = findings[i];
    const key = `${f.tooth_fdi || f.tooth || 'null'}-${f.pathology}`;
    if (findingKeys.has(key)) {
      flags.push({
        code: 'DUPLICATE_FINDING',
        severity: 'warning',
        message: `Duplicate finding for ${key} (indices ${findingKeys.get(key)} and ${i})`,
        finding_index: i,
        tooth_fdi: f.tooth_fdi
      });
    } else {
      findingKeys.set(key, i);
    }
  }

  return { flags, passed };
}

/**
 * Validate pathology/severity combinations make clinical sense
 */
export function validatePathologySeverity(finding: VisionFinding, index: number): ValidationFlag[] {
  const flags: ValidationFlag[] = [];

  // Caries severity should match confidence
  if (finding.pathology === 'caries' && finding.severity === 'severe' && finding.confidence < 0.7) {
    flags.push({
      code: 'SEVERE_CARIES_LOW_CONFIDENCE',
      severity: 'warning',
      message: `Finding ${index}: severe caries with confidence ${finding.confidence.toFixed(2)} - verify carefully`,
      finding_index: index,
      tooth_fdi: finding.tooth_fdi
    });
  }

  // Periapical lesions usually have clearer radiographic signs
  if (finding.pathology === 'periapical' && finding.confidence < 0.5) {
    flags.push({
      code: 'PERIAPICAL_LOW_CONFIDENCE',
      severity: 'info',
      message: `Finding ${index}: periapical finding with low confidence (${finding.confidence.toFixed(2)})`,
      finding_index: index,
      tooth_fdi: finding.tooth_fdi
    });
  }

  // Fracture lines are hard to see on 2D radiographs
  if (finding.pathology === 'fracture' && finding.confidence > 0.8) {
    flags.push({
      code: 'FRACTURE_HIGH_CONFIDENCE',
      severity: 'info',
      message: `Finding ${index}: fracture with high confidence (${finding.confidence.toFixed(2)}) - rare on 2D, verify with CBCT`,
      finding_index: index,
      tooth_fdi: finding.tooth_fdi
    });
  }

  return flags;
}

/**
 * Validate periodontal assessment
 */
export function validatePeriodontal(periodontal: VisionOutput['periodontal'], teethPresent: Set<number>): ValidationFlag[] {
  const flags: ValidationFlag[] = [];

  if (periodontal.bone_loss !== 'none') {
    for (const tooth of periodontal.teeth_affected) {
      if (!teethPresent.has(tooth)) {
        flags.push({
          code: 'PERIO_TOOTH_NOT_PRESENT',
          severity: 'warning',
          message: `Periodontal: tooth ${tooth} listed as affected but not in teeth_present`,
          finding_index: null,
          tooth_fdi: String(tooth)
        });
      }
    }

    if (periodontal.teeth_affected.length === 0) {
      flags.push({
        code: 'PERIO_NO_TEETH_SPECIFIED',
        severity: 'warning',
        message: 'Periodontal bone loss reported but no specific teeth listed',
        finding_index: null
      });
    }
  }

  return flags;
}

/**
 * Validate restorations
 */
export function validateRestorations(
  restorations: VisionOutput['restorations'],
  teethPresent: Set<number>
): ValidationFlag[] {
  const flags: ValidationFlag[] = [];

  for (const resto of restorations) {
    const fdiNum = parseInt(resto.tooth_fdi);
    if (!isValidFDI(fdiNum) && !isPrimaryTooth(fdiNum)) {
      flags.push({
        code: 'INVALID_RESTORATION_TOOTH',
        severity: 'warning',
        message: `Restoration on invalid tooth ${resto.tooth_fdi}`,
        finding_index: null,
        tooth_fdi: resto.tooth_fdi
      });
    } else if (!teethPresent.has(fdiNum)) {
      flags.push({
        code: 'RESTORATION_TOOTH_NOT_PRESENT',
        severity: 'info',
        message: `Restoration on tooth ${resto.tooth_fdi} not in teeth_present`,
        finding_index: null,
        tooth_fdi: resto.tooth_fdi
      });
    }
  }

  return flags;
}

/**
 * Cross-finding consistency checks
 */
export function validateCrossConsistency(visionOutput: VisionOutput): ValidationFlag[] {
  const flags: ValidationFlag[] = [];

  // Check for bilateral symmetry issues (e.g., caries on both 16 and 26)
  const findingsByPathology = new Map<string, number[]>();
  for (const finding of visionOutput.findings) {
    const key = finding.pathology;
    if (!findingsByPathology.has(key)) findingsByPathology.set(key, []);
    if (finding.tooth) findingsByPathology.get(key)!.push(finding.tooth);
  }

  // Flag multiple teeth with same pathology (could be systemic or artifact)
  for (const [pathology, teeth] of findingsByPathology) {
    if (teeth.length > 4) {
      flags.push({
        code: 'MULTIPLE_TEETH_SAME_PATHOLOGY',
        severity: 'info',
        message: `${teeth.length} teeth with ${pathology} - consider systemic cause or artifact`,
        finding_index: null
      });
    }
  }

  // Check for conflicting findings on same tooth
  const findingsByTooth = new Map<number, VisionFinding[]>();
  for (const finding of visionOutput.findings) {
    if (finding.tooth) {
      if (!findingsByTooth.has(finding.tooth)) findingsByTooth.set(finding.tooth, []);
      findingsByTooth.get(finding.tooth)!.push(finding);
    }
  }

  for (const [tooth, findings] of findingsByTooth) {
    if (findings.length > 1) {
      const pathologies = findings.map(f => f.pathology).join(', ');
      flags.push({
        code: 'MULTIPLE_FINDINGS_SAME_TOOTH',
        severity: 'info',
        message: `Tooth ${tooth} has multiple findings: ${pathologies}`,
        finding_index: null,
        tooth_fdi: String(tooth)
      });
    }
  }

  return flags;
}

/**
 * Confidence calibration validation
 */
export function validateConfidenceCalibration(findings: VisionFinding[]): ValidationFlag[] {
  const flags: ValidationFlag[] = [];

  if (findings.length === 0) return flags;

  const avgConfidence = findings.reduce((sum, f) => sum + f.confidence, 0) / findings.length;
  const highConfCount = findings.filter(f => f.confidence >= 0.8).length;
  const lowConfCount = findings.filter(f => f.confidence < 0.5).length;

  // All high confidence - possible overconfidence
  if (highConfCount === findings.length && findings.length > 3) {
    flags.push({
      code: 'ALL_HIGH_CONFIDENCE',
      severity: 'info',
      message: 'All findings have high confidence - possible model overconfidence',
      finding_index: null
    });
  }

  // Mostly low confidence - image quality issue
  if (lowConfCount / findings.length > 0.7) {
    flags.push({
      code: 'PREDOMINANTLY_LOW_CONFIDENCE',
      severity: 'warning',
      message: `${lowConfCount}/${findings.length} findings have low confidence - image quality may be limiting`,
      finding_index: null
    });
  }

  // Very high average confidence
  if (avgConfidence > 0.9) {
    flags.push({
      code: 'UNUSUALLY_HIGH_AVG_CONFIDENCE',
      severity: 'info',
      message: `Average confidence ${avgConfidence.toFixed(2)} unusually high`,
      finding_index: null
    });
  }

  return flags;
}

/**
 * Generate validation summary for logging
 */
export function getValidationSummary(validated: ValidatedVisionOutput): string {
  const { flags, passed } = validated;
  const critical = flags.filter(f => f.severity === 'critical').length;
  const warnings = flags.filter(f => f.severity === 'warning').length;
  const info = flags.filter(f => f.severity === 'info').length;

  return `Validation: ${passed ? 'PASSED' : 'FAILED'} | Critical: ${critical} | Warnings: ${warnings} | Info: ${info} | Findings: ${validated.data.findings.length}`;
}

/**
 * Filter findings by confidence threshold (for downstream processing)
 */
export function filterFindingsByConfidence(
  findings: VisionFinding[],
  minConfidence: number = 0.3
): VisionFinding[] {
  return findings.filter(f => f.confidence >= minConfidence);
}

/**
 * Convert numeric confidence to categorical for reasoning model
 */
export function confidenceToCategorical(confidence: number): 'low' | 'medium' | 'high' {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.5) return 'medium';
  return 'low';
}

/**
 * Map pathology to urgency (preliminary, reasoning model makes final call)
 */
export function pathologyToUrgency(pathology: VisionFinding['pathology'], severity: VisionFinding['severity']): 'routine' | 'soon' | 'urgent' {
  // Urgent conditions
  if (['periapical', 'fracture', 'lesion_cyst'].includes(pathology) && severity === 'severe') {
    return 'urgent';
  }

  // Soon conditions
  if (['caries', 'periodontal', 'bone_loss', 'periapical'].includes(pathology)) {
    return 'soon';
  }

  // Routine
  return 'routine';
}