/**
 * Validation Module - Public Exports
 * Production-ready validation for vision model output
 */

export {
  validateVisionOutput,
  getValidationSummary,
  filterFindingsByConfidence,
  confidenceToCategorical,
  pathologyToUrgency
} from './validator.js';

export {
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
  getToothType
} from './validator.js';

import type { VisionOutput, VisionFinding, ValidationFlag, ValidatedVisionOutput } from '../types/schemas.js';
import { validateVisionOutput as validate } from './validator.js';

/**
 * Validate and throw on critical failures
 * Use for strict validation requirements
 */
export function validateOrThrow(visionOutput: VisionOutput): ValidatedVisionOutput {
  const result = validate(visionOutput);
  if (!result.passed) {
    const criticalFlags = result.flags.filter(f => f.severity === 'critical');
    if (criticalFlags.length > 0) {
      const messages = criticalFlags.map(f => f.message).join('; ');
      throw new Error(`Critical validation failures: ${messages}`);
    }
  }
  return result;
}

/**
 * Quick validation for streaming/partial results
 * Returns only critical/warning flags
 */
export function quickValidate(visionOutput: VisionOutput): ValidationFlag[] {
  const result = validate(visionOutput);
  return result.flags.filter(f => f.severity === 'critical' || f.severity === 'warning');
}

/**
 * Validation result formatter for logging
 */
export function formatValidationResult(validated: ValidatedVisionOutput): string {
  const { flags, passed, data } = validated;
  const bySeverity = {
    critical: flags.filter(f => f.severity === 'critical').length,
    warning: flags.filter(f => f.severity === 'warning').length,
    info: flags.filter(f => f.severity === 'info').length
  };

  return `Validation: ${passed ? 'PASSED' : 'FAILED'} | ` +
    `Critical: ${bySeverity.critical} | Warnings: ${bySeverity.warning} | Info: ${bySeverity.info} | ` +
    `Findings: ${data.findings.length} | Teeth present: ${data.teeth_present.length}`;
}

/**
 * Create validation middleware for Express
 */
import { Request, Response, NextFunction } from 'express';

export function createValidationMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    // This middleware would validate incoming analysis requests
    // Implementation depends on specific needs
    next();
  };
}