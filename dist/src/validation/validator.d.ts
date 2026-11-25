/**
 * Vision Output Validator
 * Anatomical consistency, schema compliance, and clinical plausibility checks
 */
import type { VisionOutput, VisionFinding, ValidationFlag, ValidatedVisionOutput } from '../types/schemas.js';
/**
 * Get tooth type from FDI number
 */
export declare function getToothType(fdi: number): string;
/**
 * Check if FDI number is anatomically valid (adult teeth 11-48)
 */
export declare function isValidFDI(fdi: number): boolean;
/**
 * Check if FDI is primary (deciduous) tooth (51-85)
 */
export declare function isPrimaryTooth(fdi: number): boolean;
/**
 * Validate surfaces are appropriate for tooth type
 */
export declare function validateSurfaces(fdi: number, surfaces: string[]): {
    valid: boolean;
    issues: string[];
};
/**
 * Validate bounding box coordinates (normalized 0-1)
 */
export declare function validateBBox(bbox: VisionFinding['bbox']): {
    valid: boolean;
    issues: string[];
};
/**
 * Main validation function
 */
export declare function validateVisionOutput(visionOutput: VisionOutput): ValidatedVisionOutput;
/**
 * Validate individual findings
 */
export declare function validateFindings(findings: VisionFinding[], teethPresent: Set<number>): {
    flags: ValidationFlag[];
    passed: boolean;
};
/**
 * Validate pathology/severity combinations make clinical sense
 */
export declare function validatePathologySeverity(finding: VisionFinding, index: number): ValidationFlag[];
/**
 * Validate periodontal assessment
 */
export declare function validatePeriodontal(periodontal: VisionOutput['periodontal'], teethPresent: Set<number>): ValidationFlag[];
/**
 * Validate restorations
 */
export declare function validateRestorations(restorations: VisionOutput['restorations'], teethPresent: Set<number>): ValidationFlag[];
/**
 * Cross-finding consistency checks
 */
export declare function validateCrossConsistency(visionOutput: VisionOutput): ValidationFlag[];
/**
 * Confidence calibration validation
 */
export declare function validateConfidenceCalibration(findings: VisionFinding[]): ValidationFlag[];
/**
 * Generate validation summary for logging
 */
export declare function getValidationSummary(validated: ValidatedVisionOutput): string;
/**
 * Filter findings by confidence threshold (for downstream processing)
 */
export declare function filterFindingsByConfidence(findings: VisionFinding[], minConfidence?: number): VisionFinding[];
/**
 * Convert numeric confidence to categorical for reasoning model
 */
export declare function confidenceToCategorical(confidence: number): 'low' | 'medium' | 'high';
/**
 * Map pathology to urgency (preliminary, reasoning model makes final call)
 */
export declare function pathologyToUrgency(pathology: VisionFinding['pathology'], severity: VisionFinding['severity']): 'routine' | 'soon' | 'urgent';
//# sourceMappingURL=validator.d.ts.map