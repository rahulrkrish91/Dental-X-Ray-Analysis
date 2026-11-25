/**
 * Core type definitions for dental X-ray analysis pipeline
 * Compatible with Zod runtime validation
 */
import { z } from 'zod';
/**
 * FDI tooth numbering (1-8, 11-18, 21-28, 31-38, 41-48)
 * Primary teeth: 51-55, 61-65, 71-75, 81-85
 */
export declare const FDIToothSchema: z.ZodString;
/**
 * Tooth surfaces
 */
export declare const ToothSurfaceSchema: z.ZodEnum<["M", "D", "O", "B", "L", "I", "C"]>;
/**
 * Pathology types
 */
export declare const PathologyTypeSchema: z.ZodEnum<["caries", "periapical", "periodontal", "restoration", "crown", "implant", "impacted", "retained_root", "fracture", "lesion_cyst", "bone_loss", "other"]>;
/**
 * Severity levels
 */
export declare const SeveritySchema: z.ZodEnum<["mild", "moderate", "severe"]>;
/**
 * Confidence levels (numeric for vision model output)
 */
export declare const ConfidenceNumericSchema: z.ZodNumber;
/**
 * Confidence levels (categorical for reasoning model output)
 */
export declare const ConfidenceCategoricalSchema: z.ZodEnum<["low", "medium", "high"]>;
/**
 * Urgency levels
 */
export declare const UrgencySchema: z.ZodEnum<["routine", "soon", "urgent"]>;
/**
 * X-ray types
 */
export declare const XRayTypeSchema: z.ZodEnum<["bitewing", "periapical", "opg", "unknown"]>;
/**
 * Image quality rating
 */
export declare const ImageQualityRatingSchema: z.ZodEnum<["good", "fair", "poor"]>;
/**
 * Vision model finding (detailed, numeric confidence)
 */
export declare const VisionFindingSchema: z.ZodObject<{
    tooth: z.ZodNullable<z.ZodNumber>;
    tooth_fdi: z.ZodNullable<z.ZodString>;
    surfaces: z.ZodDefault<z.ZodArray<z.ZodEnum<["M", "D", "O", "B", "L", "I", "C"]>, "many">>;
    pathology: z.ZodEnum<["caries", "periapical", "periodontal", "restoration", "crown", "implant", "impacted", "retained_root", "fracture", "lesion_cyst", "bone_loss", "other"]>;
    severity: z.ZodEnum<["mild", "moderate", "severe"]>;
    confidence: z.ZodNumber;
    description: z.ZodString;
    bbox: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        w: number;
        h: number;
    }, {
        x: number;
        y: number;
        w: number;
        h: number;
    }>>>;
}, "strip", z.ZodTypeAny, {
    tooth: number | null;
    tooth_fdi: string | null;
    surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
    pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
    severity: "mild" | "moderate" | "severe";
    confidence: number;
    description: string;
    bbox?: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null | undefined;
}, {
    tooth: number | null;
    tooth_fdi: string | null;
    pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
    severity: "mild" | "moderate" | "severe";
    confidence: number;
    description: string;
    surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
    bbox?: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null | undefined;
}>;
export type VisionFinding = z.infer<typeof VisionFindingSchema>;
/**
 * Periodontal assessment
 */
export declare const PeriodontalAssessmentSchema: z.ZodObject<{
    bone_loss: z.ZodDefault<z.ZodEnum<["none", "mild", "moderate", "severe"]>>;
    teeth_affected: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    bone_loss: "mild" | "moderate" | "severe" | "none";
    teeth_affected: number[];
    description?: string | undefined;
}, {
    bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
    description?: string | undefined;
    teeth_affected?: number[] | undefined;
}>;
export type PeriodontalAssessment = z.infer<typeof PeriodontalAssessmentSchema>;
/**
 * Image quality assessment
 */
export declare const ImageQualitySchema: z.ZodObject<{
    adequate: z.ZodBoolean;
    rating: z.ZodEnum<["good", "fair", "poor"]>;
    issues: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    sharpness_score: z.ZodOptional<z.ZodNumber>;
    contrast_score: z.ZodOptional<z.ZodNumber>;
    exposure_score: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    issues: string[];
    adequate: boolean;
    rating: "good" | "fair" | "poor";
    sharpness_score?: number | undefined;
    contrast_score?: number | undefined;
    exposure_score?: number | undefined;
}, {
    adequate: boolean;
    rating: "good" | "fair" | "poor";
    issues?: string[] | undefined;
    sharpness_score?: number | undefined;
    contrast_score?: number | undefined;
    exposure_score?: number | undefined;
}>;
export type ImageQuality = z.infer<typeof ImageQualitySchema>;
/**
 * Complete vision model output
 */
export declare const VisionOutputSchema: z.ZodObject<{
    image_quality: z.ZodObject<{
        adequate: z.ZodBoolean;
        rating: z.ZodEnum<["good", "fair", "poor"]>;
        issues: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        sharpness_score: z.ZodOptional<z.ZodNumber>;
        contrast_score: z.ZodOptional<z.ZodNumber>;
        exposure_score: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        issues: string[];
        adequate: boolean;
        rating: "good" | "fair" | "poor";
        sharpness_score?: number | undefined;
        contrast_score?: number | undefined;
        exposure_score?: number | undefined;
    }, {
        adequate: boolean;
        rating: "good" | "fair" | "poor";
        issues?: string[] | undefined;
        sharpness_score?: number | undefined;
        contrast_score?: number | undefined;
        exposure_score?: number | undefined;
    }>;
    teeth_present: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
    teeth_missing: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
    findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
        tooth: z.ZodNullable<z.ZodNumber>;
        tooth_fdi: z.ZodNullable<z.ZodString>;
        surfaces: z.ZodDefault<z.ZodArray<z.ZodEnum<["M", "D", "O", "B", "L", "I", "C"]>, "many">>;
        pathology: z.ZodEnum<["caries", "periapical", "periodontal", "restoration", "crown", "implant", "impacted", "retained_root", "fracture", "lesion_cyst", "bone_loss", "other"]>;
        severity: z.ZodEnum<["mild", "moderate", "severe"]>;
        confidence: z.ZodNumber;
        description: z.ZodString;
        bbox: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            w: z.ZodNumber;
            h: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            w: number;
            h: number;
        }, {
            x: number;
            y: number;
            w: number;
            h: number;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        tooth: number | null;
        tooth_fdi: string | null;
        surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
        pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
        severity: "mild" | "moderate" | "severe";
        confidence: number;
        description: string;
        bbox?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }, {
        tooth: number | null;
        tooth_fdi: string | null;
        pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
        severity: "mild" | "moderate" | "severe";
        confidence: number;
        description: string;
        surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
        bbox?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }>, "many">>;
    periodontal: z.ZodObject<{
        bone_loss: z.ZodDefault<z.ZodEnum<["none", "mild", "moderate", "severe"]>>;
        teeth_affected: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        bone_loss: "mild" | "moderate" | "severe" | "none";
        teeth_affected: number[];
        description?: string | undefined;
    }, {
        bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
        description?: string | undefined;
        teeth_affected?: number[] | undefined;
    }>;
    restorations: z.ZodDefault<z.ZodArray<z.ZodObject<{
        tooth_fdi: z.ZodString;
        type: z.ZodEnum<["filling", "crown", "bridge", "implant", "root_canal", "ortho"]>;
        condition: z.ZodOptional<z.ZodEnum<["intact", "defective", "recurrent_caries"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
        tooth_fdi: string;
        condition?: "intact" | "defective" | "recurrent_caries" | undefined;
    }, {
        type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
        tooth_fdi: string;
        condition?: "intact" | "defective" | "recurrent_caries" | undefined;
    }>, "many">>;
    other_observations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    processing_metadata: z.ZodOptional<z.ZodObject<{
        model: z.ZodString;
        processing_time_ms: z.ZodNumber;
        tokens_used: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        model: string;
        processing_time_ms: number;
        tokens_used?: number | undefined;
    }, {
        model: string;
        processing_time_ms: number;
        tokens_used?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    periodontal: {
        bone_loss: "mild" | "moderate" | "severe" | "none";
        teeth_affected: number[];
        description?: string | undefined;
    };
    image_quality: {
        issues: string[];
        adequate: boolean;
        rating: "good" | "fair" | "poor";
        sharpness_score?: number | undefined;
        contrast_score?: number | undefined;
        exposure_score?: number | undefined;
    };
    teeth_present: number[];
    teeth_missing: number[];
    findings: {
        tooth: number | null;
        tooth_fdi: string | null;
        surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
        pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
        severity: "mild" | "moderate" | "severe";
        confidence: number;
        description: string;
        bbox?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }[];
    restorations: {
        type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
        tooth_fdi: string;
        condition?: "intact" | "defective" | "recurrent_caries" | undefined;
    }[];
    other_observations: string[];
    processing_metadata?: {
        model: string;
        processing_time_ms: number;
        tokens_used?: number | undefined;
    } | undefined;
}, {
    periodontal: {
        bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
        description?: string | undefined;
        teeth_affected?: number[] | undefined;
    };
    image_quality: {
        adequate: boolean;
        rating: "good" | "fair" | "poor";
        issues?: string[] | undefined;
        sharpness_score?: number | undefined;
        contrast_score?: number | undefined;
        exposure_score?: number | undefined;
    };
    teeth_present?: number[] | undefined;
    teeth_missing?: number[] | undefined;
    findings?: {
        tooth: number | null;
        tooth_fdi: string | null;
        pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
        severity: "mild" | "moderate" | "severe";
        confidence: number;
        description: string;
        surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
        bbox?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }[] | undefined;
    restorations?: {
        type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
        tooth_fdi: string;
        condition?: "intact" | "defective" | "recurrent_caries" | undefined;
    }[] | undefined;
    other_observations?: string[] | undefined;
    processing_metadata?: {
        model: string;
        processing_time_ms: number;
        tokens_used?: number | undefined;
    } | undefined;
}>;
export type VisionOutput = z.infer<typeof VisionOutputSchema>;
/**
 * Validation flags for dentist review
 */
export declare const ValidationFlagSchema: z.ZodObject<{
    code: z.ZodString;
    severity: z.ZodEnum<["info", "warning", "critical"]>;
    message: z.ZodString;
    finding_index: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tooth_fdi: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    message: string;
    severity: "info" | "warning" | "critical";
    tooth_fdi?: string | null | undefined;
    finding_index?: number | null | undefined;
}, {
    code: string;
    message: string;
    severity: "info" | "warning" | "critical";
    tooth_fdi?: string | null | undefined;
    finding_index?: number | null | undefined;
}>;
export type ValidationFlag = z.infer<typeof ValidationFlagSchema>;
/**
 * Validated vision output with flags
 */
export declare const ValidatedVisionOutputSchema: z.ZodObject<{
    data: z.ZodObject<{
        image_quality: z.ZodObject<{
            adequate: z.ZodBoolean;
            rating: z.ZodEnum<["good", "fair", "poor"]>;
            issues: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            sharpness_score: z.ZodOptional<z.ZodNumber>;
            contrast_score: z.ZodOptional<z.ZodNumber>;
            exposure_score: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            issues: string[];
            adequate: boolean;
            rating: "good" | "fair" | "poor";
            sharpness_score?: number | undefined;
            contrast_score?: number | undefined;
            exposure_score?: number | undefined;
        }, {
            adequate: boolean;
            rating: "good" | "fair" | "poor";
            issues?: string[] | undefined;
            sharpness_score?: number | undefined;
            contrast_score?: number | undefined;
            exposure_score?: number | undefined;
        }>;
        teeth_present: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
        teeth_missing: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
        findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
            tooth: z.ZodNullable<z.ZodNumber>;
            tooth_fdi: z.ZodNullable<z.ZodString>;
            surfaces: z.ZodDefault<z.ZodArray<z.ZodEnum<["M", "D", "O", "B", "L", "I", "C"]>, "many">>;
            pathology: z.ZodEnum<["caries", "periapical", "periodontal", "restoration", "crown", "implant", "impacted", "retained_root", "fracture", "lesion_cyst", "bone_loss", "other"]>;
            severity: z.ZodEnum<["mild", "moderate", "severe"]>;
            confidence: z.ZodNumber;
            description: z.ZodString;
            bbox: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                w: z.ZodNumber;
                h: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                w: number;
                h: number;
            }, {
                x: number;
                y: number;
                w: number;
                h: number;
            }>>>;
        }, "strip", z.ZodTypeAny, {
            tooth: number | null;
            tooth_fdi: string | null;
            surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
            pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
            severity: "mild" | "moderate" | "severe";
            confidence: number;
            description: string;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
        }, {
            tooth: number | null;
            tooth_fdi: string | null;
            pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
            severity: "mild" | "moderate" | "severe";
            confidence: number;
            description: string;
            surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
        }>, "many">>;
        periodontal: z.ZodObject<{
            bone_loss: z.ZodDefault<z.ZodEnum<["none", "mild", "moderate", "severe"]>>;
            teeth_affected: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            bone_loss: "mild" | "moderate" | "severe" | "none";
            teeth_affected: number[];
            description?: string | undefined;
        }, {
            bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
            description?: string | undefined;
            teeth_affected?: number[] | undefined;
        }>;
        restorations: z.ZodDefault<z.ZodArray<z.ZodObject<{
            tooth_fdi: z.ZodString;
            type: z.ZodEnum<["filling", "crown", "bridge", "implant", "root_canal", "ortho"]>;
            condition: z.ZodOptional<z.ZodEnum<["intact", "defective", "recurrent_caries"]>>;
        }, "strip", z.ZodTypeAny, {
            type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
            tooth_fdi: string;
            condition?: "intact" | "defective" | "recurrent_caries" | undefined;
        }, {
            type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
            tooth_fdi: string;
            condition?: "intact" | "defective" | "recurrent_caries" | undefined;
        }>, "many">>;
        other_observations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        processing_metadata: z.ZodOptional<z.ZodObject<{
            model: z.ZodString;
            processing_time_ms: z.ZodNumber;
            tokens_used: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            model: string;
            processing_time_ms: number;
            tokens_used?: number | undefined;
        }, {
            model: string;
            processing_time_ms: number;
            tokens_used?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        periodontal: {
            bone_loss: "mild" | "moderate" | "severe" | "none";
            teeth_affected: number[];
            description?: string | undefined;
        };
        image_quality: {
            issues: string[];
            adequate: boolean;
            rating: "good" | "fair" | "poor";
            sharpness_score?: number | undefined;
            contrast_score?: number | undefined;
            exposure_score?: number | undefined;
        };
        teeth_present: number[];
        teeth_missing: number[];
        findings: {
            tooth: number | null;
            tooth_fdi: string | null;
            surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
            pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
            severity: "mild" | "moderate" | "severe";
            confidence: number;
            description: string;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
        }[];
        restorations: {
            type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
            tooth_fdi: string;
            condition?: "intact" | "defective" | "recurrent_caries" | undefined;
        }[];
        other_observations: string[];
        processing_metadata?: {
            model: string;
            processing_time_ms: number;
            tokens_used?: number | undefined;
        } | undefined;
    }, {
        periodontal: {
            bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
            description?: string | undefined;
            teeth_affected?: number[] | undefined;
        };
        image_quality: {
            adequate: boolean;
            rating: "good" | "fair" | "poor";
            issues?: string[] | undefined;
            sharpness_score?: number | undefined;
            contrast_score?: number | undefined;
            exposure_score?: number | undefined;
        };
        teeth_present?: number[] | undefined;
        teeth_missing?: number[] | undefined;
        findings?: {
            tooth: number | null;
            tooth_fdi: string | null;
            pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
            severity: "mild" | "moderate" | "severe";
            confidence: number;
            description: string;
            surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
        }[] | undefined;
        restorations?: {
            type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
            tooth_fdi: string;
            condition?: "intact" | "defective" | "recurrent_caries" | undefined;
        }[] | undefined;
        other_observations?: string[] | undefined;
        processing_metadata?: {
            model: string;
            processing_time_ms: number;
            tokens_used?: number | undefined;
        } | undefined;
    }>;
    flags: z.ZodDefault<z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "critical"]>;
        message: z.ZodString;
        finding_index: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        tooth_fdi: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        tooth_fdi?: string | null | undefined;
        finding_index?: number | null | undefined;
    }, {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        tooth_fdi?: string | null | undefined;
        finding_index?: number | null | undefined;
    }>, "many">>;
    passed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    data: {
        periodontal: {
            bone_loss: "mild" | "moderate" | "severe" | "none";
            teeth_affected: number[];
            description?: string | undefined;
        };
        image_quality: {
            issues: string[];
            adequate: boolean;
            rating: "good" | "fair" | "poor";
            sharpness_score?: number | undefined;
            contrast_score?: number | undefined;
            exposure_score?: number | undefined;
        };
        teeth_present: number[];
        teeth_missing: number[];
        findings: {
            tooth: number | null;
            tooth_fdi: string | null;
            surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
            pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
            severity: "mild" | "moderate" | "severe";
            confidence: number;
            description: string;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
        }[];
        restorations: {
            type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
            tooth_fdi: string;
            condition?: "intact" | "defective" | "recurrent_caries" | undefined;
        }[];
        other_observations: string[];
        processing_metadata?: {
            model: string;
            processing_time_ms: number;
            tokens_used?: number | undefined;
        } | undefined;
    };
    flags: {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        tooth_fdi?: string | null | undefined;
        finding_index?: number | null | undefined;
    }[];
    passed: boolean;
}, {
    data: {
        periodontal: {
            bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
            description?: string | undefined;
            teeth_affected?: number[] | undefined;
        };
        image_quality: {
            adequate: boolean;
            rating: "good" | "fair" | "poor";
            issues?: string[] | undefined;
            sharpness_score?: number | undefined;
            contrast_score?: number | undefined;
            exposure_score?: number | undefined;
        };
        teeth_present?: number[] | undefined;
        teeth_missing?: number[] | undefined;
        findings?: {
            tooth: number | null;
            tooth_fdi: string | null;
            pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
            severity: "mild" | "moderate" | "severe";
            confidence: number;
            description: string;
            surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
        }[] | undefined;
        restorations?: {
            type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
            tooth_fdi: string;
            condition?: "intact" | "defective" | "recurrent_caries" | undefined;
        }[] | undefined;
        other_observations?: string[] | undefined;
        processing_metadata?: {
            model: string;
            processing_time_ms: number;
            tokens_used?: number | undefined;
        } | undefined;
    };
    passed: boolean;
    flags?: {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        tooth_fdi?: string | null | undefined;
        finding_index?: number | null | undefined;
    }[] | undefined;
}>;
export type ValidatedVisionOutput = z.infer<typeof ValidatedVisionOutputSchema>;
/**
 * Reasoning model output (clinical report)
 */
export declare const ClinicalFindingSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    tooth_fdi: z.ZodNullable<z.ZodString>;
    location_description: z.ZodString;
    explanation_plain: z.ZodString;
    confidence: z.ZodEnum<["low", "medium", "high"]>;
    urgency: z.ZodEnum<["routine", "soon", "urgent"]>;
    bbox: z.ZodNullable<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        w: z.ZodNumber;
        h: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        w: number;
        h: number;
    }, {
        x: number;
        y: number;
        w: number;
        h: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    tooth_fdi: string | null;
    confidence: "low" | "medium" | "high";
    bbox: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;
    id: string;
    label: string;
    location_description: string;
    explanation_plain: string;
    urgency: "routine" | "soon" | "urgent";
}, {
    tooth_fdi: string | null;
    confidence: "low" | "medium" | "high";
    bbox: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;
    id: string;
    label: string;
    location_description: string;
    explanation_plain: string;
    urgency: "routine" | "soon" | "urgent";
}>;
export type ClinicalFinding = z.infer<typeof ClinicalFindingSchema>;
export declare const ClinicalReportSchema: z.ZodObject<{
    is_dental_xray: z.ZodBoolean;
    rejection_reason: z.ZodNullable<z.ZodString>;
    xray_type: z.ZodEnum<["bitewing", "periapical", "opg", "unknown"]>;
    image_quality: z.ZodObject<{
        rating: z.ZodEnum<["good", "fair", "poor"]>;
        issues: z.ZodArray<z.ZodString, "many">;
        usable: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        issues: string[];
        rating: "good" | "fair" | "poor";
        usable: boolean;
    }, {
        issues: string[];
        rating: "good" | "fair" | "poor";
        usable: boolean;
    }>;
    summary: z.ZodString;
    healthy_observations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        tooth_fdi: z.ZodNullable<z.ZodString>;
        location_description: z.ZodString;
        explanation_plain: z.ZodString;
        confidence: z.ZodEnum<["low", "medium", "high"]>;
        urgency: z.ZodEnum<["routine", "soon", "urgent"]>;
        bbox: z.ZodNullable<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            w: z.ZodNumber;
            h: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            w: number;
            h: number;
        }, {
            x: number;
            y: number;
            w: number;
            h: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        tooth_fdi: string | null;
        confidence: "low" | "medium" | "high";
        bbox: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null;
        id: string;
        label: string;
        location_description: string;
        explanation_plain: string;
        urgency: "routine" | "soon" | "urgent";
    }, {
        tooth_fdi: string | null;
        confidence: "low" | "medium" | "high";
        bbox: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null;
        id: string;
        label: string;
        location_description: string;
        explanation_plain: string;
        urgency: "routine" | "soon" | "urgent";
    }>, "many">>;
    recommended_next_steps: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    limitations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    disclaimer: z.ZodString;
    dentist_review_flags: z.ZodDefault<z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "critical"]>;
        message: z.ZodString;
        finding_index: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        tooth_fdi: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        tooth_fdi?: string | null | undefined;
        finding_index?: number | null | undefined;
    }, {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        tooth_fdi?: string | null | undefined;
        finding_index?: number | null | undefined;
    }>, "many">>;
    report_token: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        vision_model: z.ZodString;
        reasoning_model: z.ZodString;
        total_processing_time_ms: z.ZodNumber;
        vision_confidence_avg: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        vision_model: string;
        reasoning_model: string;
        total_processing_time_ms: number;
        vision_confidence_avg?: number | undefined;
    }, {
        vision_model: string;
        reasoning_model: string;
        total_processing_time_ms: number;
        vision_confidence_avg?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    image_quality: {
        issues: string[];
        rating: "good" | "fair" | "poor";
        usable: boolean;
    };
    findings: {
        tooth_fdi: string | null;
        confidence: "low" | "medium" | "high";
        bbox: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null;
        id: string;
        label: string;
        location_description: string;
        explanation_plain: string;
        urgency: "routine" | "soon" | "urgent";
    }[];
    is_dental_xray: boolean;
    rejection_reason: string | null;
    xray_type: "bitewing" | "periapical" | "opg" | "unknown";
    summary: string;
    healthy_observations: string[];
    recommended_next_steps: string[];
    limitations: string[];
    disclaimer: string;
    dentist_review_flags: {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        tooth_fdi?: string | null | undefined;
        finding_index?: number | null | undefined;
    }[];
    report_token?: string | undefined;
    metadata?: {
        vision_model: string;
        reasoning_model: string;
        total_processing_time_ms: number;
        vision_confidence_avg?: number | undefined;
    } | undefined;
}, {
    image_quality: {
        issues: string[];
        rating: "good" | "fair" | "poor";
        usable: boolean;
    };
    is_dental_xray: boolean;
    rejection_reason: string | null;
    xray_type: "bitewing" | "periapical" | "opg" | "unknown";
    summary: string;
    disclaimer: string;
    findings?: {
        tooth_fdi: string | null;
        confidence: "low" | "medium" | "high";
        bbox: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null;
        id: string;
        label: string;
        location_description: string;
        explanation_plain: string;
        urgency: "routine" | "soon" | "urgent";
    }[] | undefined;
    healthy_observations?: string[] | undefined;
    recommended_next_steps?: string[] | undefined;
    limitations?: string[] | undefined;
    dentist_review_flags?: {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        tooth_fdi?: string | null | undefined;
        finding_index?: number | null | undefined;
    }[] | undefined;
    report_token?: string | undefined;
    metadata?: {
        vision_model: string;
        reasoning_model: string;
        total_processing_time_ms: number;
        vision_confidence_avg?: number | undefined;
    } | undefined;
}>;
export type ClinicalReport = z.infer<typeof ClinicalReportSchema>;
/**
 * Pipeline request input
 */
export declare const AnalysisRequestSchema: z.ZodObject<{
    image_base64: z.ZodString;
    mime_type: z.ZodDefault<z.ZodEnum<["image/jpeg", "image/png", "image/webp"]>>;
    xray_type_hint: z.ZodOptional<z.ZodEnum<["bitewing", "periapical", "opg", "unknown"]>>;
    symptoms: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    language: z.ZodDefault<z.ZodEnum<["en", "ml"]>>;
    patient_id: z.ZodOptional<z.ZodString>;
    request_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    image_base64: string;
    mime_type: "image/jpeg" | "image/png" | "image/webp";
    symptoms: string[];
    language: "en" | "ml";
    xray_type_hint?: "bitewing" | "periapical" | "opg" | "unknown" | undefined;
    patient_id?: string | undefined;
    request_id?: string | undefined;
}, {
    image_base64: string;
    mime_type?: "image/jpeg" | "image/png" | "image/webp" | undefined;
    xray_type_hint?: "bitewing" | "periapical" | "opg" | "unknown" | undefined;
    symptoms?: string[] | undefined;
    language?: "en" | "ml" | undefined;
    patient_id?: string | undefined;
    request_id?: string | undefined;
}>;
export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;
/**
 * Pipeline response
 */
export declare const AnalysisResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    report: z.ZodNullable<z.ZodObject<{
        is_dental_xray: z.ZodBoolean;
        rejection_reason: z.ZodNullable<z.ZodString>;
        xray_type: z.ZodEnum<["bitewing", "periapical", "opg", "unknown"]>;
        image_quality: z.ZodObject<{
            rating: z.ZodEnum<["good", "fair", "poor"]>;
            issues: z.ZodArray<z.ZodString, "many">;
            usable: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            issues: string[];
            rating: "good" | "fair" | "poor";
            usable: boolean;
        }, {
            issues: string[];
            rating: "good" | "fair" | "poor";
            usable: boolean;
        }>;
        summary: z.ZodString;
        healthy_observations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            tooth_fdi: z.ZodNullable<z.ZodString>;
            location_description: z.ZodString;
            explanation_plain: z.ZodString;
            confidence: z.ZodEnum<["low", "medium", "high"]>;
            urgency: z.ZodEnum<["routine", "soon", "urgent"]>;
            bbox: z.ZodNullable<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                w: z.ZodNumber;
                h: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                w: number;
                h: number;
            }, {
                x: number;
                y: number;
                w: number;
                h: number;
            }>>;
        }, "strip", z.ZodTypeAny, {
            tooth_fdi: string | null;
            confidence: "low" | "medium" | "high";
            bbox: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null;
            id: string;
            label: string;
            location_description: string;
            explanation_plain: string;
            urgency: "routine" | "soon" | "urgent";
        }, {
            tooth_fdi: string | null;
            confidence: "low" | "medium" | "high";
            bbox: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null;
            id: string;
            label: string;
            location_description: string;
            explanation_plain: string;
            urgency: "routine" | "soon" | "urgent";
        }>, "many">>;
        recommended_next_steps: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        limitations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        disclaimer: z.ZodString;
        dentist_review_flags: z.ZodDefault<z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            severity: z.ZodEnum<["info", "warning", "critical"]>;
            message: z.ZodString;
            finding_index: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            tooth_fdi: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }, {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }>, "many">>;
        report_token: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodObject<{
            vision_model: z.ZodString;
            reasoning_model: z.ZodString;
            total_processing_time_ms: z.ZodNumber;
            vision_confidence_avg: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            vision_model: string;
            reasoning_model: string;
            total_processing_time_ms: number;
            vision_confidence_avg?: number | undefined;
        }, {
            vision_model: string;
            reasoning_model: string;
            total_processing_time_ms: number;
            vision_confidence_avg?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        image_quality: {
            issues: string[];
            rating: "good" | "fair" | "poor";
            usable: boolean;
        };
        findings: {
            tooth_fdi: string | null;
            confidence: "low" | "medium" | "high";
            bbox: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null;
            id: string;
            label: string;
            location_description: string;
            explanation_plain: string;
            urgency: "routine" | "soon" | "urgent";
        }[];
        is_dental_xray: boolean;
        rejection_reason: string | null;
        xray_type: "bitewing" | "periapical" | "opg" | "unknown";
        summary: string;
        healthy_observations: string[];
        recommended_next_steps: string[];
        limitations: string[];
        disclaimer: string;
        dentist_review_flags: {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }[];
        report_token?: string | undefined;
        metadata?: {
            vision_model: string;
            reasoning_model: string;
            total_processing_time_ms: number;
            vision_confidence_avg?: number | undefined;
        } | undefined;
    }, {
        image_quality: {
            issues: string[];
            rating: "good" | "fair" | "poor";
            usable: boolean;
        };
        is_dental_xray: boolean;
        rejection_reason: string | null;
        xray_type: "bitewing" | "periapical" | "opg" | "unknown";
        summary: string;
        disclaimer: string;
        findings?: {
            tooth_fdi: string | null;
            confidence: "low" | "medium" | "high";
            bbox: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null;
            id: string;
            label: string;
            location_description: string;
            explanation_plain: string;
            urgency: "routine" | "soon" | "urgent";
        }[] | undefined;
        healthy_observations?: string[] | undefined;
        recommended_next_steps?: string[] | undefined;
        limitations?: string[] | undefined;
        dentist_review_flags?: {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }[] | undefined;
        report_token?: string | undefined;
        metadata?: {
            vision_model: string;
            reasoning_model: string;
            total_processing_time_ms: number;
            vision_confidence_avg?: number | undefined;
        } | undefined;
    }>>;
    error: z.ZodNullable<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
    }, {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
    }>>;
    request_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
    } | null;
    request_id: string;
    success: boolean;
    report: {
        image_quality: {
            issues: string[];
            rating: "good" | "fair" | "poor";
            usable: boolean;
        };
        findings: {
            tooth_fdi: string | null;
            confidence: "low" | "medium" | "high";
            bbox: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null;
            id: string;
            label: string;
            location_description: string;
            explanation_plain: string;
            urgency: "routine" | "soon" | "urgent";
        }[];
        is_dental_xray: boolean;
        rejection_reason: string | null;
        xray_type: "bitewing" | "periapical" | "opg" | "unknown";
        summary: string;
        healthy_observations: string[];
        recommended_next_steps: string[];
        limitations: string[];
        disclaimer: string;
        dentist_review_flags: {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }[];
        report_token?: string | undefined;
        metadata?: {
            vision_model: string;
            reasoning_model: string;
            total_processing_time_ms: number;
            vision_confidence_avg?: number | undefined;
        } | undefined;
    } | null;
}, {
    error: {
        code: string;
        message: string;
        details?: Record<string, unknown> | undefined;
    } | null;
    request_id: string;
    success: boolean;
    report: {
        image_quality: {
            issues: string[];
            rating: "good" | "fair" | "poor";
            usable: boolean;
        };
        is_dental_xray: boolean;
        rejection_reason: string | null;
        xray_type: "bitewing" | "periapical" | "opg" | "unknown";
        summary: string;
        disclaimer: string;
        findings?: {
            tooth_fdi: string | null;
            confidence: "low" | "medium" | "high";
            bbox: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null;
            id: string;
            label: string;
            location_description: string;
            explanation_plain: string;
            urgency: "routine" | "soon" | "urgent";
        }[] | undefined;
        healthy_observations?: string[] | undefined;
        recommended_next_steps?: string[] | undefined;
        limitations?: string[] | undefined;
        dentist_review_flags?: {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }[] | undefined;
        report_token?: string | undefined;
        metadata?: {
            vision_model: string;
            reasoning_model: string;
            total_processing_time_ms: number;
            vision_confidence_avg?: number | undefined;
        } | undefined;
    } | null;
}>;
export type AnalysisResponse = z.infer<typeof AnalysisResponseSchema>;
/**
 * Dentist correction input
 */
export declare const DentistCorrectionSchema: z.ZodObject<{
    report_id: z.ZodString;
    finding_id: z.ZodString;
    action: z.ZodEnum<["confirm", "modify", "reject"]>;
    corrected_finding: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        label: z.ZodOptional<z.ZodString>;
        tooth_fdi: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        location_description: z.ZodOptional<z.ZodString>;
        explanation_plain: z.ZodOptional<z.ZodString>;
        confidence: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        urgency: z.ZodOptional<z.ZodEnum<["routine", "soon", "urgent"]>>;
        bbox: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            w: z.ZodNumber;
            h: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            w: number;
            h: number;
        }, {
            x: number;
            y: number;
            w: number;
            h: number;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        tooth_fdi?: string | null | undefined;
        confidence?: "low" | "medium" | "high" | undefined;
        bbox?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
        id?: string | undefined;
        label?: string | undefined;
        location_description?: string | undefined;
        explanation_plain?: string | undefined;
        urgency?: "routine" | "soon" | "urgent" | undefined;
    }, {
        tooth_fdi?: string | null | undefined;
        confidence?: "low" | "medium" | "high" | undefined;
        bbox?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
        id?: string | undefined;
        label?: string | undefined;
        location_description?: string | undefined;
        explanation_plain?: string | undefined;
        urgency?: "routine" | "soon" | "urgent" | undefined;
    }>>;
    notes: z.ZodOptional<z.ZodString>;
    dentist_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    report_id: string;
    finding_id: string;
    action: "confirm" | "modify" | "reject";
    dentist_id: string;
    corrected_finding?: {
        tooth_fdi?: string | null | undefined;
        confidence?: "low" | "medium" | "high" | undefined;
        bbox?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
        id?: string | undefined;
        label?: string | undefined;
        location_description?: string | undefined;
        explanation_plain?: string | undefined;
        urgency?: "routine" | "soon" | "urgent" | undefined;
    } | undefined;
    notes?: string | undefined;
}, {
    report_id: string;
    finding_id: string;
    action: "confirm" | "modify" | "reject";
    dentist_id: string;
    corrected_finding?: {
        tooth_fdi?: string | null | undefined;
        confidence?: "low" | "medium" | "high" | undefined;
        bbox?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
        id?: string | undefined;
        label?: string | undefined;
        location_description?: string | undefined;
        explanation_plain?: string | undefined;
        urgency?: "routine" | "soon" | "urgent" | undefined;
    } | undefined;
    notes?: string | undefined;
}>;
export type DentistCorrection = z.infer<typeof DentistCorrectionSchema>;
/**
 * Health check response
 */
export declare const HealthCheckSchema: z.ZodObject<{
    status: z.ZodEnum<["healthy", "degraded", "unhealthy"]>;
    timestamp: z.ZodString;
    version: z.ZodString;
    models: z.ZodObject<{
        vision: z.ZodObject<{
            available: z.ZodBoolean;
            latency_ms: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            available: boolean;
            latency_ms?: number | undefined;
        }, {
            available: boolean;
            latency_ms?: number | undefined;
        }>;
        reasoning: z.ZodObject<{
            available: z.ZodBoolean;
            latency_ms: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            available: boolean;
            latency_ms?: number | undefined;
        }, {
            available: boolean;
            latency_ms?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        vision: {
            available: boolean;
            latency_ms?: number | undefined;
        };
        reasoning: {
            available: boolean;
            latency_ms?: number | undefined;
        };
    }, {
        vision: {
            available: boolean;
            latency_ms?: number | undefined;
        };
        reasoning: {
            available: boolean;
            latency_ms?: number | undefined;
        };
    }>;
    checks: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        status: z.ZodEnum<["pass", "fail", "warn"]>;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "warn" | "pass" | "fail";
        name: string;
        message?: string | undefined;
    }, {
        status: "warn" | "pass" | "fail";
        name: string;
        message?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    version: string;
    models: {
        vision: {
            available: boolean;
            latency_ms?: number | undefined;
        };
        reasoning: {
            available: boolean;
            latency_ms?: number | undefined;
        };
    };
    checks: {
        status: "warn" | "pass" | "fail";
        name: string;
        message?: string | undefined;
    }[];
}, {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    version: string;
    models: {
        vision: {
            available: boolean;
            latency_ms?: number | undefined;
        };
        reasoning: {
            available: boolean;
            latency_ms?: number | undefined;
        };
    };
    checks: {
        status: "warn" | "pass" | "fail";
        name: string;
        message?: string | undefined;
    }[];
}>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
export declare const Schemas: {
    readonly FDITooth: z.ZodString;
    readonly ToothSurface: z.ZodEnum<["M", "D", "O", "B", "L", "I", "C"]>;
    readonly PathologyType: z.ZodEnum<["caries", "periapical", "periodontal", "restoration", "crown", "implant", "impacted", "retained_root", "fracture", "lesion_cyst", "bone_loss", "other"]>;
    readonly Severity: z.ZodEnum<["mild", "moderate", "severe"]>;
    readonly ConfidenceNumeric: z.ZodNumber;
    readonly ConfidenceCategorical: z.ZodEnum<["low", "medium", "high"]>;
    readonly Urgency: z.ZodEnum<["routine", "soon", "urgent"]>;
    readonly XRayType: z.ZodEnum<["bitewing", "periapical", "opg", "unknown"]>;
    readonly ImageQualityRating: z.ZodEnum<["good", "fair", "poor"]>;
    readonly VisionFinding: z.ZodObject<{
        tooth: z.ZodNullable<z.ZodNumber>;
        tooth_fdi: z.ZodNullable<z.ZodString>;
        surfaces: z.ZodDefault<z.ZodArray<z.ZodEnum<["M", "D", "O", "B", "L", "I", "C"]>, "many">>;
        pathology: z.ZodEnum<["caries", "periapical", "periodontal", "restoration", "crown", "implant", "impacted", "retained_root", "fracture", "lesion_cyst", "bone_loss", "other"]>;
        severity: z.ZodEnum<["mild", "moderate", "severe"]>;
        confidence: z.ZodNumber;
        description: z.ZodString;
        bbox: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            w: z.ZodNumber;
            h: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            w: number;
            h: number;
        }, {
            x: number;
            y: number;
            w: number;
            h: number;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        tooth: number | null;
        tooth_fdi: string | null;
        surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
        pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
        severity: "mild" | "moderate" | "severe";
        confidence: number;
        description: string;
        bbox?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }, {
        tooth: number | null;
        tooth_fdi: string | null;
        pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
        severity: "mild" | "moderate" | "severe";
        confidence: number;
        description: string;
        surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
        bbox?: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null | undefined;
    }>;
    readonly PeriodontalAssessment: z.ZodObject<{
        bone_loss: z.ZodDefault<z.ZodEnum<["none", "mild", "moderate", "severe"]>>;
        teeth_affected: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        bone_loss: "mild" | "moderate" | "severe" | "none";
        teeth_affected: number[];
        description?: string | undefined;
    }, {
        bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
        description?: string | undefined;
        teeth_affected?: number[] | undefined;
    }>;
    readonly ImageQuality: z.ZodObject<{
        adequate: z.ZodBoolean;
        rating: z.ZodEnum<["good", "fair", "poor"]>;
        issues: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        sharpness_score: z.ZodOptional<z.ZodNumber>;
        contrast_score: z.ZodOptional<z.ZodNumber>;
        exposure_score: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        issues: string[];
        adequate: boolean;
        rating: "good" | "fair" | "poor";
        sharpness_score?: number | undefined;
        contrast_score?: number | undefined;
        exposure_score?: number | undefined;
    }, {
        adequate: boolean;
        rating: "good" | "fair" | "poor";
        issues?: string[] | undefined;
        sharpness_score?: number | undefined;
        contrast_score?: number | undefined;
        exposure_score?: number | undefined;
    }>;
    readonly VisionOutput: z.ZodObject<{
        image_quality: z.ZodObject<{
            adequate: z.ZodBoolean;
            rating: z.ZodEnum<["good", "fair", "poor"]>;
            issues: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            sharpness_score: z.ZodOptional<z.ZodNumber>;
            contrast_score: z.ZodOptional<z.ZodNumber>;
            exposure_score: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            issues: string[];
            adequate: boolean;
            rating: "good" | "fair" | "poor";
            sharpness_score?: number | undefined;
            contrast_score?: number | undefined;
            exposure_score?: number | undefined;
        }, {
            adequate: boolean;
            rating: "good" | "fair" | "poor";
            issues?: string[] | undefined;
            sharpness_score?: number | undefined;
            contrast_score?: number | undefined;
            exposure_score?: number | undefined;
        }>;
        teeth_present: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
        teeth_missing: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
        findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
            tooth: z.ZodNullable<z.ZodNumber>;
            tooth_fdi: z.ZodNullable<z.ZodString>;
            surfaces: z.ZodDefault<z.ZodArray<z.ZodEnum<["M", "D", "O", "B", "L", "I", "C"]>, "many">>;
            pathology: z.ZodEnum<["caries", "periapical", "periodontal", "restoration", "crown", "implant", "impacted", "retained_root", "fracture", "lesion_cyst", "bone_loss", "other"]>;
            severity: z.ZodEnum<["mild", "moderate", "severe"]>;
            confidence: z.ZodNumber;
            description: z.ZodString;
            bbox: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                w: z.ZodNumber;
                h: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                w: number;
                h: number;
            }, {
                x: number;
                y: number;
                w: number;
                h: number;
            }>>>;
        }, "strip", z.ZodTypeAny, {
            tooth: number | null;
            tooth_fdi: string | null;
            surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
            pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
            severity: "mild" | "moderate" | "severe";
            confidence: number;
            description: string;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
        }, {
            tooth: number | null;
            tooth_fdi: string | null;
            pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
            severity: "mild" | "moderate" | "severe";
            confidence: number;
            description: string;
            surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
        }>, "many">>;
        periodontal: z.ZodObject<{
            bone_loss: z.ZodDefault<z.ZodEnum<["none", "mild", "moderate", "severe"]>>;
            teeth_affected: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
            description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            bone_loss: "mild" | "moderate" | "severe" | "none";
            teeth_affected: number[];
            description?: string | undefined;
        }, {
            bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
            description?: string | undefined;
            teeth_affected?: number[] | undefined;
        }>;
        restorations: z.ZodDefault<z.ZodArray<z.ZodObject<{
            tooth_fdi: z.ZodString;
            type: z.ZodEnum<["filling", "crown", "bridge", "implant", "root_canal", "ortho"]>;
            condition: z.ZodOptional<z.ZodEnum<["intact", "defective", "recurrent_caries"]>>;
        }, "strip", z.ZodTypeAny, {
            type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
            tooth_fdi: string;
            condition?: "intact" | "defective" | "recurrent_caries" | undefined;
        }, {
            type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
            tooth_fdi: string;
            condition?: "intact" | "defective" | "recurrent_caries" | undefined;
        }>, "many">>;
        other_observations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        processing_metadata: z.ZodOptional<z.ZodObject<{
            model: z.ZodString;
            processing_time_ms: z.ZodNumber;
            tokens_used: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            model: string;
            processing_time_ms: number;
            tokens_used?: number | undefined;
        }, {
            model: string;
            processing_time_ms: number;
            tokens_used?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        periodontal: {
            bone_loss: "mild" | "moderate" | "severe" | "none";
            teeth_affected: number[];
            description?: string | undefined;
        };
        image_quality: {
            issues: string[];
            adequate: boolean;
            rating: "good" | "fair" | "poor";
            sharpness_score?: number | undefined;
            contrast_score?: number | undefined;
            exposure_score?: number | undefined;
        };
        teeth_present: number[];
        teeth_missing: number[];
        findings: {
            tooth: number | null;
            tooth_fdi: string | null;
            surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
            pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
            severity: "mild" | "moderate" | "severe";
            confidence: number;
            description: string;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
        }[];
        restorations: {
            type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
            tooth_fdi: string;
            condition?: "intact" | "defective" | "recurrent_caries" | undefined;
        }[];
        other_observations: string[];
        processing_metadata?: {
            model: string;
            processing_time_ms: number;
            tokens_used?: number | undefined;
        } | undefined;
    }, {
        periodontal: {
            bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
            description?: string | undefined;
            teeth_affected?: number[] | undefined;
        };
        image_quality: {
            adequate: boolean;
            rating: "good" | "fair" | "poor";
            issues?: string[] | undefined;
            sharpness_score?: number | undefined;
            contrast_score?: number | undefined;
            exposure_score?: number | undefined;
        };
        teeth_present?: number[] | undefined;
        teeth_missing?: number[] | undefined;
        findings?: {
            tooth: number | null;
            tooth_fdi: string | null;
            pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
            severity: "mild" | "moderate" | "severe";
            confidence: number;
            description: string;
            surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
        }[] | undefined;
        restorations?: {
            type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
            tooth_fdi: string;
            condition?: "intact" | "defective" | "recurrent_caries" | undefined;
        }[] | undefined;
        other_observations?: string[] | undefined;
        processing_metadata?: {
            model: string;
            processing_time_ms: number;
            tokens_used?: number | undefined;
        } | undefined;
    }>;
    readonly ValidationFlag: z.ZodObject<{
        code: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "critical"]>;
        message: z.ZodString;
        finding_index: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        tooth_fdi: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        tooth_fdi?: string | null | undefined;
        finding_index?: number | null | undefined;
    }, {
        code: string;
        message: string;
        severity: "info" | "warning" | "critical";
        tooth_fdi?: string | null | undefined;
        finding_index?: number | null | undefined;
    }>;
    readonly ValidatedVisionOutput: z.ZodObject<{
        data: z.ZodObject<{
            image_quality: z.ZodObject<{
                adequate: z.ZodBoolean;
                rating: z.ZodEnum<["good", "fair", "poor"]>;
                issues: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                sharpness_score: z.ZodOptional<z.ZodNumber>;
                contrast_score: z.ZodOptional<z.ZodNumber>;
                exposure_score: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                issues: string[];
                adequate: boolean;
                rating: "good" | "fair" | "poor";
                sharpness_score?: number | undefined;
                contrast_score?: number | undefined;
                exposure_score?: number | undefined;
            }, {
                adequate: boolean;
                rating: "good" | "fair" | "poor";
                issues?: string[] | undefined;
                sharpness_score?: number | undefined;
                contrast_score?: number | undefined;
                exposure_score?: number | undefined;
            }>;
            teeth_present: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
            teeth_missing: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
            findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
                tooth: z.ZodNullable<z.ZodNumber>;
                tooth_fdi: z.ZodNullable<z.ZodString>;
                surfaces: z.ZodDefault<z.ZodArray<z.ZodEnum<["M", "D", "O", "B", "L", "I", "C"]>, "many">>;
                pathology: z.ZodEnum<["caries", "periapical", "periodontal", "restoration", "crown", "implant", "impacted", "retained_root", "fracture", "lesion_cyst", "bone_loss", "other"]>;
                severity: z.ZodEnum<["mild", "moderate", "severe"]>;
                confidence: z.ZodNumber;
                description: z.ZodString;
                bbox: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    w: z.ZodNumber;
                    h: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                }, {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                }>>>;
            }, "strip", z.ZodTypeAny, {
                tooth: number | null;
                tooth_fdi: string | null;
                surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
                pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
                severity: "mild" | "moderate" | "severe";
                confidence: number;
                description: string;
                bbox?: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null | undefined;
            }, {
                tooth: number | null;
                tooth_fdi: string | null;
                pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
                severity: "mild" | "moderate" | "severe";
                confidence: number;
                description: string;
                surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
                bbox?: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null | undefined;
            }>, "many">>;
            periodontal: z.ZodObject<{
                bone_loss: z.ZodDefault<z.ZodEnum<["none", "mild", "moderate", "severe"]>>;
                teeth_affected: z.ZodDefault<z.ZodArray<z.ZodNumber, "many">>;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                bone_loss: "mild" | "moderate" | "severe" | "none";
                teeth_affected: number[];
                description?: string | undefined;
            }, {
                bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
                description?: string | undefined;
                teeth_affected?: number[] | undefined;
            }>;
            restorations: z.ZodDefault<z.ZodArray<z.ZodObject<{
                tooth_fdi: z.ZodString;
                type: z.ZodEnum<["filling", "crown", "bridge", "implant", "root_canal", "ortho"]>;
                condition: z.ZodOptional<z.ZodEnum<["intact", "defective", "recurrent_caries"]>>;
            }, "strip", z.ZodTypeAny, {
                type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
                tooth_fdi: string;
                condition?: "intact" | "defective" | "recurrent_caries" | undefined;
            }, {
                type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
                tooth_fdi: string;
                condition?: "intact" | "defective" | "recurrent_caries" | undefined;
            }>, "many">>;
            other_observations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            processing_metadata: z.ZodOptional<z.ZodObject<{
                model: z.ZodString;
                processing_time_ms: z.ZodNumber;
                tokens_used: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                model: string;
                processing_time_ms: number;
                tokens_used?: number | undefined;
            }, {
                model: string;
                processing_time_ms: number;
                tokens_used?: number | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            periodontal: {
                bone_loss: "mild" | "moderate" | "severe" | "none";
                teeth_affected: number[];
                description?: string | undefined;
            };
            image_quality: {
                issues: string[];
                adequate: boolean;
                rating: "good" | "fair" | "poor";
                sharpness_score?: number | undefined;
                contrast_score?: number | undefined;
                exposure_score?: number | undefined;
            };
            teeth_present: number[];
            teeth_missing: number[];
            findings: {
                tooth: number | null;
                tooth_fdi: string | null;
                surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
                pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
                severity: "mild" | "moderate" | "severe";
                confidence: number;
                description: string;
                bbox?: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null | undefined;
            }[];
            restorations: {
                type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
                tooth_fdi: string;
                condition?: "intact" | "defective" | "recurrent_caries" | undefined;
            }[];
            other_observations: string[];
            processing_metadata?: {
                model: string;
                processing_time_ms: number;
                tokens_used?: number | undefined;
            } | undefined;
        }, {
            periodontal: {
                bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
                description?: string | undefined;
                teeth_affected?: number[] | undefined;
            };
            image_quality: {
                adequate: boolean;
                rating: "good" | "fair" | "poor";
                issues?: string[] | undefined;
                sharpness_score?: number | undefined;
                contrast_score?: number | undefined;
                exposure_score?: number | undefined;
            };
            teeth_present?: number[] | undefined;
            teeth_missing?: number[] | undefined;
            findings?: {
                tooth: number | null;
                tooth_fdi: string | null;
                pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
                severity: "mild" | "moderate" | "severe";
                confidence: number;
                description: string;
                surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
                bbox?: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null | undefined;
            }[] | undefined;
            restorations?: {
                type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
                tooth_fdi: string;
                condition?: "intact" | "defective" | "recurrent_caries" | undefined;
            }[] | undefined;
            other_observations?: string[] | undefined;
            processing_metadata?: {
                model: string;
                processing_time_ms: number;
                tokens_used?: number | undefined;
            } | undefined;
        }>;
        flags: z.ZodDefault<z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            severity: z.ZodEnum<["info", "warning", "critical"]>;
            message: z.ZodString;
            finding_index: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            tooth_fdi: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }, {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }>, "many">>;
        passed: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        data: {
            periodontal: {
                bone_loss: "mild" | "moderate" | "severe" | "none";
                teeth_affected: number[];
                description?: string | undefined;
            };
            image_quality: {
                issues: string[];
                adequate: boolean;
                rating: "good" | "fair" | "poor";
                sharpness_score?: number | undefined;
                contrast_score?: number | undefined;
                exposure_score?: number | undefined;
            };
            teeth_present: number[];
            teeth_missing: number[];
            findings: {
                tooth: number | null;
                tooth_fdi: string | null;
                surfaces: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[];
                pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
                severity: "mild" | "moderate" | "severe";
                confidence: number;
                description: string;
                bbox?: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null | undefined;
            }[];
            restorations: {
                type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
                tooth_fdi: string;
                condition?: "intact" | "defective" | "recurrent_caries" | undefined;
            }[];
            other_observations: string[];
            processing_metadata?: {
                model: string;
                processing_time_ms: number;
                tokens_used?: number | undefined;
            } | undefined;
        };
        flags: {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }[];
        passed: boolean;
    }, {
        data: {
            periodontal: {
                bone_loss?: "mild" | "moderate" | "severe" | "none" | undefined;
                description?: string | undefined;
                teeth_affected?: number[] | undefined;
            };
            image_quality: {
                adequate: boolean;
                rating: "good" | "fair" | "poor";
                issues?: string[] | undefined;
                sharpness_score?: number | undefined;
                contrast_score?: number | undefined;
                exposure_score?: number | undefined;
            };
            teeth_present?: number[] | undefined;
            teeth_missing?: number[] | undefined;
            findings?: {
                tooth: number | null;
                tooth_fdi: string | null;
                pathology: "periapical" | "caries" | "periodontal" | "restoration" | "crown" | "implant" | "impacted" | "retained_root" | "fracture" | "lesion_cyst" | "bone_loss" | "other";
                severity: "mild" | "moderate" | "severe";
                confidence: number;
                description: string;
                surfaces?: ("M" | "D" | "O" | "B" | "L" | "I" | "C")[] | undefined;
                bbox?: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null | undefined;
            }[] | undefined;
            restorations?: {
                type: "crown" | "implant" | "filling" | "bridge" | "root_canal" | "ortho";
                tooth_fdi: string;
                condition?: "intact" | "defective" | "recurrent_caries" | undefined;
            }[] | undefined;
            other_observations?: string[] | undefined;
            processing_metadata?: {
                model: string;
                processing_time_ms: number;
                tokens_used?: number | undefined;
            } | undefined;
        };
        passed: boolean;
        flags?: {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }[] | undefined;
    }>;
    readonly ClinicalFinding: z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        tooth_fdi: z.ZodNullable<z.ZodString>;
        location_description: z.ZodString;
        explanation_plain: z.ZodString;
        confidence: z.ZodEnum<["low", "medium", "high"]>;
        urgency: z.ZodEnum<["routine", "soon", "urgent"]>;
        bbox: z.ZodNullable<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            w: z.ZodNumber;
            h: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            w: number;
            h: number;
        }, {
            x: number;
            y: number;
            w: number;
            h: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        tooth_fdi: string | null;
        confidence: "low" | "medium" | "high";
        bbox: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null;
        id: string;
        label: string;
        location_description: string;
        explanation_plain: string;
        urgency: "routine" | "soon" | "urgent";
    }, {
        tooth_fdi: string | null;
        confidence: "low" | "medium" | "high";
        bbox: {
            x: number;
            y: number;
            w: number;
            h: number;
        } | null;
        id: string;
        label: string;
        location_description: string;
        explanation_plain: string;
        urgency: "routine" | "soon" | "urgent";
    }>;
    readonly ClinicalReport: z.ZodObject<{
        is_dental_xray: z.ZodBoolean;
        rejection_reason: z.ZodNullable<z.ZodString>;
        xray_type: z.ZodEnum<["bitewing", "periapical", "opg", "unknown"]>;
        image_quality: z.ZodObject<{
            rating: z.ZodEnum<["good", "fair", "poor"]>;
            issues: z.ZodArray<z.ZodString, "many">;
            usable: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            issues: string[];
            rating: "good" | "fair" | "poor";
            usable: boolean;
        }, {
            issues: string[];
            rating: "good" | "fair" | "poor";
            usable: boolean;
        }>;
        summary: z.ZodString;
        healthy_observations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            tooth_fdi: z.ZodNullable<z.ZodString>;
            location_description: z.ZodString;
            explanation_plain: z.ZodString;
            confidence: z.ZodEnum<["low", "medium", "high"]>;
            urgency: z.ZodEnum<["routine", "soon", "urgent"]>;
            bbox: z.ZodNullable<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                w: z.ZodNumber;
                h: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                w: number;
                h: number;
            }, {
                x: number;
                y: number;
                w: number;
                h: number;
            }>>;
        }, "strip", z.ZodTypeAny, {
            tooth_fdi: string | null;
            confidence: "low" | "medium" | "high";
            bbox: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null;
            id: string;
            label: string;
            location_description: string;
            explanation_plain: string;
            urgency: "routine" | "soon" | "urgent";
        }, {
            tooth_fdi: string | null;
            confidence: "low" | "medium" | "high";
            bbox: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null;
            id: string;
            label: string;
            location_description: string;
            explanation_plain: string;
            urgency: "routine" | "soon" | "urgent";
        }>, "many">>;
        recommended_next_steps: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        limitations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        disclaimer: z.ZodString;
        dentist_review_flags: z.ZodDefault<z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            severity: z.ZodEnum<["info", "warning", "critical"]>;
            message: z.ZodString;
            finding_index: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            tooth_fdi: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }, {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }>, "many">>;
        report_token: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodObject<{
            vision_model: z.ZodString;
            reasoning_model: z.ZodString;
            total_processing_time_ms: z.ZodNumber;
            vision_confidence_avg: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            vision_model: string;
            reasoning_model: string;
            total_processing_time_ms: number;
            vision_confidence_avg?: number | undefined;
        }, {
            vision_model: string;
            reasoning_model: string;
            total_processing_time_ms: number;
            vision_confidence_avg?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        image_quality: {
            issues: string[];
            rating: "good" | "fair" | "poor";
            usable: boolean;
        };
        findings: {
            tooth_fdi: string | null;
            confidence: "low" | "medium" | "high";
            bbox: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null;
            id: string;
            label: string;
            location_description: string;
            explanation_plain: string;
            urgency: "routine" | "soon" | "urgent";
        }[];
        is_dental_xray: boolean;
        rejection_reason: string | null;
        xray_type: "bitewing" | "periapical" | "opg" | "unknown";
        summary: string;
        healthy_observations: string[];
        recommended_next_steps: string[];
        limitations: string[];
        disclaimer: string;
        dentist_review_flags: {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }[];
        report_token?: string | undefined;
        metadata?: {
            vision_model: string;
            reasoning_model: string;
            total_processing_time_ms: number;
            vision_confidence_avg?: number | undefined;
        } | undefined;
    }, {
        image_quality: {
            issues: string[];
            rating: "good" | "fair" | "poor";
            usable: boolean;
        };
        is_dental_xray: boolean;
        rejection_reason: string | null;
        xray_type: "bitewing" | "periapical" | "opg" | "unknown";
        summary: string;
        disclaimer: string;
        findings?: {
            tooth_fdi: string | null;
            confidence: "low" | "medium" | "high";
            bbox: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null;
            id: string;
            label: string;
            location_description: string;
            explanation_plain: string;
            urgency: "routine" | "soon" | "urgent";
        }[] | undefined;
        healthy_observations?: string[] | undefined;
        recommended_next_steps?: string[] | undefined;
        limitations?: string[] | undefined;
        dentist_review_flags?: {
            code: string;
            message: string;
            severity: "info" | "warning" | "critical";
            tooth_fdi?: string | null | undefined;
            finding_index?: number | null | undefined;
        }[] | undefined;
        report_token?: string | undefined;
        metadata?: {
            vision_model: string;
            reasoning_model: string;
            total_processing_time_ms: number;
            vision_confidence_avg?: number | undefined;
        } | undefined;
    }>;
    readonly AnalysisRequest: z.ZodObject<{
        image_base64: z.ZodString;
        mime_type: z.ZodDefault<z.ZodEnum<["image/jpeg", "image/png", "image/webp"]>>;
        xray_type_hint: z.ZodOptional<z.ZodEnum<["bitewing", "periapical", "opg", "unknown"]>>;
        symptoms: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        language: z.ZodDefault<z.ZodEnum<["en", "ml"]>>;
        patient_id: z.ZodOptional<z.ZodString>;
        request_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        image_base64: string;
        mime_type: "image/jpeg" | "image/png" | "image/webp";
        symptoms: string[];
        language: "en" | "ml";
        xray_type_hint?: "bitewing" | "periapical" | "opg" | "unknown" | undefined;
        patient_id?: string | undefined;
        request_id?: string | undefined;
    }, {
        image_base64: string;
        mime_type?: "image/jpeg" | "image/png" | "image/webp" | undefined;
        xray_type_hint?: "bitewing" | "periapical" | "opg" | "unknown" | undefined;
        symptoms?: string[] | undefined;
        language?: "en" | "ml" | undefined;
        patient_id?: string | undefined;
        request_id?: string | undefined;
    }>;
    readonly AnalysisResponse: z.ZodObject<{
        success: z.ZodBoolean;
        report: z.ZodNullable<z.ZodObject<{
            is_dental_xray: z.ZodBoolean;
            rejection_reason: z.ZodNullable<z.ZodString>;
            xray_type: z.ZodEnum<["bitewing", "periapical", "opg", "unknown"]>;
            image_quality: z.ZodObject<{
                rating: z.ZodEnum<["good", "fair", "poor"]>;
                issues: z.ZodArray<z.ZodString, "many">;
                usable: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                issues: string[];
                rating: "good" | "fair" | "poor";
                usable: boolean;
            }, {
                issues: string[];
                rating: "good" | "fair" | "poor";
                usable: boolean;
            }>;
            summary: z.ZodString;
            healthy_observations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                tooth_fdi: z.ZodNullable<z.ZodString>;
                location_description: z.ZodString;
                explanation_plain: z.ZodString;
                confidence: z.ZodEnum<["low", "medium", "high"]>;
                urgency: z.ZodEnum<["routine", "soon", "urgent"]>;
                bbox: z.ZodNullable<z.ZodObject<{
                    x: z.ZodNumber;
                    y: z.ZodNumber;
                    w: z.ZodNumber;
                    h: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                }, {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                }>>;
            }, "strip", z.ZodTypeAny, {
                tooth_fdi: string | null;
                confidence: "low" | "medium" | "high";
                bbox: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null;
                id: string;
                label: string;
                location_description: string;
                explanation_plain: string;
                urgency: "routine" | "soon" | "urgent";
            }, {
                tooth_fdi: string | null;
                confidence: "low" | "medium" | "high";
                bbox: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null;
                id: string;
                label: string;
                location_description: string;
                explanation_plain: string;
                urgency: "routine" | "soon" | "urgent";
            }>, "many">>;
            recommended_next_steps: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            limitations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            disclaimer: z.ZodString;
            dentist_review_flags: z.ZodDefault<z.ZodArray<z.ZodObject<{
                code: z.ZodString;
                severity: z.ZodEnum<["info", "warning", "critical"]>;
                message: z.ZodString;
                finding_index: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                tooth_fdi: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, "strip", z.ZodTypeAny, {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                tooth_fdi?: string | null | undefined;
                finding_index?: number | null | undefined;
            }, {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                tooth_fdi?: string | null | undefined;
                finding_index?: number | null | undefined;
            }>, "many">>;
            report_token: z.ZodOptional<z.ZodString>;
            metadata: z.ZodOptional<z.ZodObject<{
                vision_model: z.ZodString;
                reasoning_model: z.ZodString;
                total_processing_time_ms: z.ZodNumber;
                vision_confidence_avg: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                vision_model: string;
                reasoning_model: string;
                total_processing_time_ms: number;
                vision_confidence_avg?: number | undefined;
            }, {
                vision_model: string;
                reasoning_model: string;
                total_processing_time_ms: number;
                vision_confidence_avg?: number | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            image_quality: {
                issues: string[];
                rating: "good" | "fair" | "poor";
                usable: boolean;
            };
            findings: {
                tooth_fdi: string | null;
                confidence: "low" | "medium" | "high";
                bbox: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null;
                id: string;
                label: string;
                location_description: string;
                explanation_plain: string;
                urgency: "routine" | "soon" | "urgent";
            }[];
            is_dental_xray: boolean;
            rejection_reason: string | null;
            xray_type: "bitewing" | "periapical" | "opg" | "unknown";
            summary: string;
            healthy_observations: string[];
            recommended_next_steps: string[];
            limitations: string[];
            disclaimer: string;
            dentist_review_flags: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                tooth_fdi?: string | null | undefined;
                finding_index?: number | null | undefined;
            }[];
            report_token?: string | undefined;
            metadata?: {
                vision_model: string;
                reasoning_model: string;
                total_processing_time_ms: number;
                vision_confidence_avg?: number | undefined;
            } | undefined;
        }, {
            image_quality: {
                issues: string[];
                rating: "good" | "fair" | "poor";
                usable: boolean;
            };
            is_dental_xray: boolean;
            rejection_reason: string | null;
            xray_type: "bitewing" | "periapical" | "opg" | "unknown";
            summary: string;
            disclaimer: string;
            findings?: {
                tooth_fdi: string | null;
                confidence: "low" | "medium" | "high";
                bbox: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null;
                id: string;
                label: string;
                location_description: string;
                explanation_plain: string;
                urgency: "routine" | "soon" | "urgent";
            }[] | undefined;
            healthy_observations?: string[] | undefined;
            recommended_next_steps?: string[] | undefined;
            limitations?: string[] | undefined;
            dentist_review_flags?: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                tooth_fdi?: string | null | undefined;
                finding_index?: number | null | undefined;
            }[] | undefined;
            report_token?: string | undefined;
            metadata?: {
                vision_model: string;
                reasoning_model: string;
                total_processing_time_ms: number;
                vision_confidence_avg?: number | undefined;
            } | undefined;
        }>>;
        error: z.ZodNullable<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            details?: Record<string, unknown> | undefined;
        }, {
            code: string;
            message: string;
            details?: Record<string, unknown> | undefined;
        }>>;
        request_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        error: {
            code: string;
            message: string;
            details?: Record<string, unknown> | undefined;
        } | null;
        request_id: string;
        success: boolean;
        report: {
            image_quality: {
                issues: string[];
                rating: "good" | "fair" | "poor";
                usable: boolean;
            };
            findings: {
                tooth_fdi: string | null;
                confidence: "low" | "medium" | "high";
                bbox: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null;
                id: string;
                label: string;
                location_description: string;
                explanation_plain: string;
                urgency: "routine" | "soon" | "urgent";
            }[];
            is_dental_xray: boolean;
            rejection_reason: string | null;
            xray_type: "bitewing" | "periapical" | "opg" | "unknown";
            summary: string;
            healthy_observations: string[];
            recommended_next_steps: string[];
            limitations: string[];
            disclaimer: string;
            dentist_review_flags: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                tooth_fdi?: string | null | undefined;
                finding_index?: number | null | undefined;
            }[];
            report_token?: string | undefined;
            metadata?: {
                vision_model: string;
                reasoning_model: string;
                total_processing_time_ms: number;
                vision_confidence_avg?: number | undefined;
            } | undefined;
        } | null;
    }, {
        error: {
            code: string;
            message: string;
            details?: Record<string, unknown> | undefined;
        } | null;
        request_id: string;
        success: boolean;
        report: {
            image_quality: {
                issues: string[];
                rating: "good" | "fair" | "poor";
                usable: boolean;
            };
            is_dental_xray: boolean;
            rejection_reason: string | null;
            xray_type: "bitewing" | "periapical" | "opg" | "unknown";
            summary: string;
            disclaimer: string;
            findings?: {
                tooth_fdi: string | null;
                confidence: "low" | "medium" | "high";
                bbox: {
                    x: number;
                    y: number;
                    w: number;
                    h: number;
                } | null;
                id: string;
                label: string;
                location_description: string;
                explanation_plain: string;
                urgency: "routine" | "soon" | "urgent";
            }[] | undefined;
            healthy_observations?: string[] | undefined;
            recommended_next_steps?: string[] | undefined;
            limitations?: string[] | undefined;
            dentist_review_flags?: {
                code: string;
                message: string;
                severity: "info" | "warning" | "critical";
                tooth_fdi?: string | null | undefined;
                finding_index?: number | null | undefined;
            }[] | undefined;
            report_token?: string | undefined;
            metadata?: {
                vision_model: string;
                reasoning_model: string;
                total_processing_time_ms: number;
                vision_confidence_avg?: number | undefined;
            } | undefined;
        } | null;
    }>;
    readonly DentistCorrection: z.ZodObject<{
        report_id: z.ZodString;
        finding_id: z.ZodString;
        action: z.ZodEnum<["confirm", "modify", "reject"]>;
        corrected_finding: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            label: z.ZodOptional<z.ZodString>;
            tooth_fdi: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            location_description: z.ZodOptional<z.ZodString>;
            explanation_plain: z.ZodOptional<z.ZodString>;
            confidence: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
            urgency: z.ZodOptional<z.ZodEnum<["routine", "soon", "urgent"]>>;
            bbox: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                w: z.ZodNumber;
                h: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                w: number;
                h: number;
            }, {
                x: number;
                y: number;
                w: number;
                h: number;
            }>>>;
        }, "strip", z.ZodTypeAny, {
            tooth_fdi?: string | null | undefined;
            confidence?: "low" | "medium" | "high" | undefined;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
            id?: string | undefined;
            label?: string | undefined;
            location_description?: string | undefined;
            explanation_plain?: string | undefined;
            urgency?: "routine" | "soon" | "urgent" | undefined;
        }, {
            tooth_fdi?: string | null | undefined;
            confidence?: "low" | "medium" | "high" | undefined;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
            id?: string | undefined;
            label?: string | undefined;
            location_description?: string | undefined;
            explanation_plain?: string | undefined;
            urgency?: "routine" | "soon" | "urgent" | undefined;
        }>>;
        notes: z.ZodOptional<z.ZodString>;
        dentist_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        report_id: string;
        finding_id: string;
        action: "confirm" | "modify" | "reject";
        dentist_id: string;
        corrected_finding?: {
            tooth_fdi?: string | null | undefined;
            confidence?: "low" | "medium" | "high" | undefined;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
            id?: string | undefined;
            label?: string | undefined;
            location_description?: string | undefined;
            explanation_plain?: string | undefined;
            urgency?: "routine" | "soon" | "urgent" | undefined;
        } | undefined;
        notes?: string | undefined;
    }, {
        report_id: string;
        finding_id: string;
        action: "confirm" | "modify" | "reject";
        dentist_id: string;
        corrected_finding?: {
            tooth_fdi?: string | null | undefined;
            confidence?: "low" | "medium" | "high" | undefined;
            bbox?: {
                x: number;
                y: number;
                w: number;
                h: number;
            } | null | undefined;
            id?: string | undefined;
            label?: string | undefined;
            location_description?: string | undefined;
            explanation_plain?: string | undefined;
            urgency?: "routine" | "soon" | "urgent" | undefined;
        } | undefined;
        notes?: string | undefined;
    }>;
    readonly HealthCheck: z.ZodObject<{
        status: z.ZodEnum<["healthy", "degraded", "unhealthy"]>;
        timestamp: z.ZodString;
        version: z.ZodString;
        models: z.ZodObject<{
            vision: z.ZodObject<{
                available: z.ZodBoolean;
                latency_ms: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                available: boolean;
                latency_ms?: number | undefined;
            }, {
                available: boolean;
                latency_ms?: number | undefined;
            }>;
            reasoning: z.ZodObject<{
                available: z.ZodBoolean;
                latency_ms: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                available: boolean;
                latency_ms?: number | undefined;
            }, {
                available: boolean;
                latency_ms?: number | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            vision: {
                available: boolean;
                latency_ms?: number | undefined;
            };
            reasoning: {
                available: boolean;
                latency_ms?: number | undefined;
            };
        }, {
            vision: {
                available: boolean;
                latency_ms?: number | undefined;
            };
            reasoning: {
                available: boolean;
                latency_ms?: number | undefined;
            };
        }>;
        checks: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            status: z.ZodEnum<["pass", "fail", "warn"]>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            status: "warn" | "pass" | "fail";
            name: string;
            message?: string | undefined;
        }, {
            status: "warn" | "pass" | "fail";
            name: string;
            message?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: "healthy" | "degraded" | "unhealthy";
        timestamp: string;
        version: string;
        models: {
            vision: {
                available: boolean;
                latency_ms?: number | undefined;
            };
            reasoning: {
                available: boolean;
                latency_ms?: number | undefined;
            };
        };
        checks: {
            status: "warn" | "pass" | "fail";
            name: string;
            message?: string | undefined;
        }[];
    }, {
        status: "healthy" | "degraded" | "unhealthy";
        timestamp: string;
        version: string;
        models: {
            vision: {
                available: boolean;
                latency_ms?: number | undefined;
            };
            reasoning: {
                available: boolean;
                latency_ms?: number | undefined;
            };
        };
        checks: {
            status: "warn" | "pass" | "fail";
            name: string;
            message?: string | undefined;
        }[];
    }>;
};
export type SchemaRegistry = typeof Schemas;
//# sourceMappingURL=schemas.d.ts.map