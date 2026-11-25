/**
 * Core type definitions for dental X-ray analysis pipeline
 * Compatible with Zod runtime validation
 */
import { z } from 'zod';
/**
 * FDI tooth numbering (1-8, 11-18, 21-28, 31-38, 41-48)
 * Primary teeth: 51-55, 61-65, 71-75, 81-85
 */
export const FDIToothSchema = z.string().regex(/^(?:[1-4][1-8]|[5-8][1-5])$/);
/**
 * Tooth surfaces
 */
export const ToothSurfaceSchema = z.enum(['M', 'D', 'O', 'B', 'L', 'I', 'C']);
/**
 * Pathology types
 */
export const PathologyTypeSchema = z.enum([
    'caries',
    'periapical',
    'periodontal',
    'restoration',
    'crown',
    'implant',
    'impacted',
    'retained_root',
    'fracture',
    'lesion_cyst',
    'bone_loss',
    'other'
]);
/**
 * Severity levels
 */
export const SeveritySchema = z.enum(['mild', 'moderate', 'severe']);
/**
 * Confidence levels (numeric for vision model output)
 */
export const ConfidenceNumericSchema = z.number().min(0).max(1);
/**
 * Confidence levels (categorical for reasoning model output)
 */
export const ConfidenceCategoricalSchema = z.enum(['low', 'medium', 'high']);
/**
 * Urgency levels
 */
export const UrgencySchema = z.enum(['routine', 'soon', 'urgent']);
/**
 * X-ray types
 */
export const XRayTypeSchema = z.enum(['bitewing', 'periapical', 'opg', 'unknown']);
/**
 * Image quality rating
 */
export const ImageQualityRatingSchema = z.enum(['good', 'fair', 'poor']);
/**
 * Vision model finding (detailed, numeric confidence)
 */
export const VisionFindingSchema = z.object({
    tooth: z.number().int().min(1).max(48).nullable(),
    tooth_fdi: FDIToothSchema.nullable(),
    surfaces: z.array(ToothSurfaceSchema).default([]),
    pathology: PathologyTypeSchema,
    severity: SeveritySchema,
    confidence: ConfidenceNumericSchema,
    description: z.string().min(1).max(500),
    bbox: z.object({
        x: z.number().min(0).max(1),
        y: z.number().min(0).max(1),
        w: z.number().min(0).max(1),
        h: z.number().min(0).max(1)
    }).nullable().optional()
});
/**
 * Periodontal assessment
 */
export const PeriodontalAssessmentSchema = z.object({
    bone_loss: z.enum(['none', 'mild', 'moderate', 'severe']).default('none'),
    teeth_affected: z.array(z.number().int().min(1).max(48)).default([]),
    description: z.string().max(500).optional()
});
/**
 * Image quality assessment
 */
export const ImageQualitySchema = z.object({
    adequate: z.boolean(),
    rating: ImageQualityRatingSchema,
    issues: z.array(z.string()).default([]),
    sharpness_score: z.number().min(0).max(100).optional(),
    contrast_score: z.number().min(0).max(100).optional(),
    exposure_score: z.number().min(0).max(100).optional()
});
/**
 * Complete vision model output
 */
export const VisionOutputSchema = z.object({
    image_quality: ImageQualitySchema,
    teeth_present: z.array(z.number().int().min(1).max(48)).default([]),
    teeth_missing: z.array(z.number().int().min(1).max(48)).default([]),
    findings: z.array(VisionFindingSchema).max(20).default([]),
    periodontal: PeriodontalAssessmentSchema,
    restorations: z.array(z.object({
        tooth_fdi: FDIToothSchema,
        type: z.enum(['filling', 'crown', 'bridge', 'implant', 'root_canal', 'ortho']),
        condition: z.enum(['intact', 'defective', 'recurrent_caries']).optional()
    })).default([]),
    other_observations: z.array(z.string()).default([]),
    processing_metadata: z.object({
        model: z.string(),
        processing_time_ms: z.number().int().positive(),
        tokens_used: z.number().int().positive().optional()
    }).optional()
});
/**
 * Validation flags for dentist review
 */
export const ValidationFlagSchema = z.object({
    code: z.string(),
    severity: z.enum(['info', 'warning', 'critical']),
    message: z.string(),
    finding_index: z.number().int().nullable().optional(),
    tooth_fdi: FDIToothSchema.nullable().optional()
});
/**
 * Validated vision output with flags
 */
export const ValidatedVisionOutputSchema = z.object({
    data: VisionOutputSchema,
    flags: z.array(ValidationFlagSchema).default([]),
    passed: z.boolean()
});
/**
 * Reasoning model output (clinical report)
 */
export const ClinicalFindingSchema = z.object({
    id: z.string(),
    label: z.string(),
    tooth_fdi: FDIToothSchema.nullable(),
    location_description: z.string(),
    explanation_plain: z.string(),
    confidence: ConfidenceCategoricalSchema,
    urgency: UrgencySchema,
    bbox: z.object({
        x: z.number().min(0).max(1),
        y: z.number().min(0).max(1),
        w: z.number().min(0).max(1),
        h: z.number().min(0).max(1)
    }).nullable()
});
export const ClinicalReportSchema = z.object({
    is_dental_xray: z.boolean(),
    rejection_reason: z.string().nullable(),
    xray_type: XRayTypeSchema,
    image_quality: z.object({
        rating: ImageQualityRatingSchema,
        issues: z.array(z.string()),
        usable: z.boolean()
    }),
    summary: z.string().max(500),
    healthy_observations: z.array(z.string()).max(10).default([]),
    findings: z.array(ClinicalFindingSchema).max(10).default([]),
    recommended_next_steps: z.array(z.string()).max(10).default([]),
    limitations: z.array(z.string()).max(10).default([]),
    disclaimer: z.string(),
    dentist_review_flags: z.array(ValidationFlagSchema).default([]),
    report_token: z.string().optional(),
    metadata: z.object({
        vision_model: z.string(),
        reasoning_model: z.string(),
        total_processing_time_ms: z.number().int().positive(),
        vision_confidence_avg: z.number().min(0).max(1).optional()
    }).optional()
});
/**
 * Pipeline request input
 */
export const AnalysisRequestSchema = z.object({
    image_base64: z.string().min(1),
    mime_type: z.enum(['image/jpeg', 'image/png', 'image/webp']).default('image/jpeg'),
    xray_type_hint: XRayTypeSchema.optional(),
    symptoms: z.array(z.string()).max(5).default([]),
    language: z.enum(['en', 'ml']).default('en'),
    patient_id: z.string().optional(),
    request_id: z.string().uuid().optional()
});
/**
 * Pipeline response
 */
export const AnalysisResponseSchema = z.object({
    success: z.boolean(),
    report: ClinicalReportSchema.nullable(),
    error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.unknown()).optional()
    }).nullable(),
    request_id: z.string().uuid()
});
/**
 * Dentist correction input
 */
export const DentistCorrectionSchema = z.object({
    report_id: z.string().uuid(),
    finding_id: z.string(),
    action: z.enum(['confirm', 'modify', 'reject']),
    corrected_finding: ClinicalFindingSchema.partial().optional(),
    notes: z.string().max(1000).optional(),
    dentist_id: z.string()
});
/**
 * Health check response
 */
export const HealthCheckSchema = z.object({
    status: z.enum(['healthy', 'degraded', 'unhealthy']),
    timestamp: z.string().datetime(),
    version: z.string(),
    models: z.object({
        vision: z.object({ available: z.boolean(), latency_ms: z.number().optional() }),
        reasoning: z.object({ available: z.boolean(), latency_ms: z.number().optional() })
    }),
    checks: z.array(z.object({
        name: z.string(),
        status: z.enum(['pass', 'fail', 'warn']),
        message: z.string().optional()
    }))
});
// Export all schemas as a registry for easy access
export const Schemas = {
    FDITooth: FDIToothSchema,
    ToothSurface: ToothSurfaceSchema,
    PathologyType: PathologyTypeSchema,
    Severity: SeveritySchema,
    ConfidenceNumeric: ConfidenceNumericSchema,
    ConfidenceCategorical: ConfidenceCategoricalSchema,
    Urgency: UrgencySchema,
    XRayType: XRayTypeSchema,
    ImageQualityRating: ImageQualityRatingSchema,
    VisionFinding: VisionFindingSchema,
    PeriodontalAssessment: PeriodontalAssessmentSchema,
    ImageQuality: ImageQualitySchema,
    VisionOutput: VisionOutputSchema,
    ValidationFlag: ValidationFlagSchema,
    ValidatedVisionOutput: ValidatedVisionOutputSchema,
    ClinicalFinding: ClinicalFindingSchema,
    ClinicalReport: ClinicalReportSchema,
    AnalysisRequest: AnalysisRequestSchema,
    AnalysisResponse: AnalysisResponseSchema,
    DentistCorrection: DentistCorrectionSchema,
    HealthCheck: HealthCheckSchema
};
//# sourceMappingURL=schemas.js.map