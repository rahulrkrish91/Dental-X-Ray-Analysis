/**
 * Validation Module - Public Exports
 * Production-ready validation for vision model output
 */
export { validateVisionOutput, getValidationSummary, filterFindingsByConfidence, confidenceToCategorical, pathologyToUrgency } from './validator.js';
export { validateFindings, validatePeriodontal, validateRestorations, validateCrossConsistency, validateConfidenceCalibration, validatePathologySeverity, validateSurfaces, validateBBox, isValidFDI, isPrimaryTooth, getToothType } from './validator.js';
import type { VisionOutput, ValidationFlag, ValidatedVisionOutput } from '../types/schemas.js';
/**
 * Validate and throw on critical failures
 * Use for strict validation requirements
 */
export declare function validateOrThrow(visionOutput: VisionOutput): ValidatedVisionOutput;
/**
 * Quick validation for streaming/partial results
 * Returns only critical/warning flags
 */
export declare function quickValidate(visionOutput: VisionOutput): ValidationFlag[];
/**
 * Validation result formatter for logging
 */
export declare function formatValidationResult(validated: ValidatedVisionOutput): string;
/**
 * Create validation middleware for Express
 */
import { Request, Response, NextFunction } from 'express';
export declare function createValidationMiddleware(): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=index.d.ts.map