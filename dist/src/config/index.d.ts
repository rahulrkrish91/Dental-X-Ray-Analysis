/**
 * Production-ready configuration management
 * Validates all required environment variables at startup
 */
import 'dotenv/config';
import { z } from 'zod';
/**
 * Environment variable schema with validation
 */
declare const EnvSchema: z.ZodObject<{
    NVIDIA_API_KEY: z.ZodString;
    NVIDIA_API_BASE_URL: z.ZodDefault<z.ZodString>;
    NVIDIA_VISION_MODEL: z.ZodDefault<z.ZodString>;
    NVIDIA_REASONING_MODEL: z.ZodDefault<z.ZodString>;
    PORT: z.ZodDefault<z.ZodNumber>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    VISION_API_TIMEOUT_MS: z.ZodDefault<z.ZodNumber>;
    REASONING_API_TIMEOUT_MS: z.ZodDefault<z.ZodNumber>;
    VISION_MAX_RETRIES: z.ZodDefault<z.ZodNumber>;
    REASONING_MAX_RETRIES: z.ZodDefault<z.ZodNumber>;
    RATE_LIMIT_WINDOW_MS: z.ZodDefault<z.ZodNumber>;
    RATE_LIMIT_MAX: z.ZodDefault<z.ZodNumber>;
    ASK_RATE_LIMIT_MAX: z.ZodDefault<z.ZodNumber>;
    ASK_RATE_LIMIT_WINDOW_MS: z.ZodDefault<z.ZodNumber>;
    MAX_FILE_SIZE: z.ZodDefault<z.ZodNumber>;
    MAX_DIMENSION: z.ZodDefault<z.ZodNumber>;
    TARGET_LONG_EDGE: z.ZodDefault<z.ZodNumber>;
    OPG_TARGET_LONG_EDGE: z.ZodDefault<z.ZodNumber>;
    QUALITY_MIN_SHORT_SIDE_BLOCK: z.ZodDefault<z.ZodNumber>;
    QUALITY_MIN_SHORT_SIDE_WARN: z.ZodDefault<z.ZodNumber>;
    QUALITY_BLUR_BLOCK_THRESHOLD: z.ZodDefault<z.ZodNumber>;
    QUALITY_BLUR_WARN_THRESHOLD: z.ZodDefault<z.ZodNumber>;
    QUALITY_DARK_THRESHOLD: z.ZodDefault<z.ZodNumber>;
    QUALITY_BRIGHT_THRESHOLD: z.ZodDefault<z.ZodNumber>;
    QUALITY_CONTRAST_THRESHOLD: z.ZodDefault<z.ZodNumber>;
    QUALITY_XRAY_GRAYSCALE_RATIO: z.ZodDefault<z.ZodNumber>;
    QUALITY_XRAY_DARK_RATIO: z.ZodDefault<z.ZodNumber>;
    REPORT_SIGNING_SECRET: z.ZodString;
    ASK_ENABLED: z.ZodDefault<z.ZodBoolean>;
    ASK_DAILY_CAP: z.ZodDefault<z.ZodNumber>;
    CLINIC_WHATSAPP: z.ZodOptional<z.ZodString>;
    VITE_FIREBASE_API_KEY: z.ZodOptional<z.ZodString>;
    VITE_FIREBASE_AUTH_DOMAIN: z.ZodOptional<z.ZodString>;
    VITE_FIREBASE_PROJECT_ID: z.ZodOptional<z.ZodString>;
    VITE_FIREBASE_STORAGE_BUCKET: z.ZodOptional<z.ZodString>;
    VITE_FIREBASE_MESSAGING_SENDER_ID: z.ZodOptional<z.ZodString>;
    VITE_FIREBASE_APP_ID: z.ZodOptional<z.ZodString>;
    VITE_FIREBASE_MEASUREMENT_ID: z.ZodOptional<z.ZodString>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
    LOG_FORMAT: z.ZodDefault<z.ZodEnum<["json", "pretty"]>>;
    ENABLE_DENTIST_REVIEW: z.ZodDefault<z.ZodBoolean>;
    ENABLE_CORRECTION_STORAGE: z.ZodDefault<z.ZodBoolean>;
    ENABLE_METRICS: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    NVIDIA_API_KEY: string;
    NVIDIA_API_BASE_URL: string;
    NVIDIA_VISION_MODEL: string;
    NVIDIA_REASONING_MODEL: string;
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    VISION_API_TIMEOUT_MS: number;
    REASONING_API_TIMEOUT_MS: number;
    VISION_MAX_RETRIES: number;
    REASONING_MAX_RETRIES: number;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX: number;
    ASK_RATE_LIMIT_MAX: number;
    ASK_RATE_LIMIT_WINDOW_MS: number;
    MAX_FILE_SIZE: number;
    MAX_DIMENSION: number;
    TARGET_LONG_EDGE: number;
    OPG_TARGET_LONG_EDGE: number;
    QUALITY_MIN_SHORT_SIDE_BLOCK: number;
    QUALITY_MIN_SHORT_SIDE_WARN: number;
    QUALITY_BLUR_BLOCK_THRESHOLD: number;
    QUALITY_BLUR_WARN_THRESHOLD: number;
    QUALITY_DARK_THRESHOLD: number;
    QUALITY_BRIGHT_THRESHOLD: number;
    QUALITY_CONTRAST_THRESHOLD: number;
    QUALITY_XRAY_GRAYSCALE_RATIO: number;
    QUALITY_XRAY_DARK_RATIO: number;
    REPORT_SIGNING_SECRET: string;
    ASK_ENABLED: boolean;
    ASK_DAILY_CAP: number;
    LOG_LEVEL: "debug" | "info" | "warn" | "error";
    LOG_FORMAT: "json" | "pretty";
    ENABLE_DENTIST_REVIEW: boolean;
    ENABLE_CORRECTION_STORAGE: boolean;
    ENABLE_METRICS: boolean;
    CLINIC_WHATSAPP?: string | undefined;
    VITE_FIREBASE_API_KEY?: string | undefined;
    VITE_FIREBASE_AUTH_DOMAIN?: string | undefined;
    VITE_FIREBASE_PROJECT_ID?: string | undefined;
    VITE_FIREBASE_STORAGE_BUCKET?: string | undefined;
    VITE_FIREBASE_MESSAGING_SENDER_ID?: string | undefined;
    VITE_FIREBASE_APP_ID?: string | undefined;
    VITE_FIREBASE_MEASUREMENT_ID?: string | undefined;
}, {
    NVIDIA_API_KEY: string;
    REPORT_SIGNING_SECRET: string;
    NVIDIA_API_BASE_URL?: string | undefined;
    NVIDIA_VISION_MODEL?: string | undefined;
    NVIDIA_REASONING_MODEL?: string | undefined;
    PORT?: number | undefined;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    VISION_API_TIMEOUT_MS?: number | undefined;
    REASONING_API_TIMEOUT_MS?: number | undefined;
    VISION_MAX_RETRIES?: number | undefined;
    REASONING_MAX_RETRIES?: number | undefined;
    RATE_LIMIT_WINDOW_MS?: number | undefined;
    RATE_LIMIT_MAX?: number | undefined;
    ASK_RATE_LIMIT_MAX?: number | undefined;
    ASK_RATE_LIMIT_WINDOW_MS?: number | undefined;
    MAX_FILE_SIZE?: number | undefined;
    MAX_DIMENSION?: number | undefined;
    TARGET_LONG_EDGE?: number | undefined;
    OPG_TARGET_LONG_EDGE?: number | undefined;
    QUALITY_MIN_SHORT_SIDE_BLOCK?: number | undefined;
    QUALITY_MIN_SHORT_SIDE_WARN?: number | undefined;
    QUALITY_BLUR_BLOCK_THRESHOLD?: number | undefined;
    QUALITY_BLUR_WARN_THRESHOLD?: number | undefined;
    QUALITY_DARK_THRESHOLD?: number | undefined;
    QUALITY_BRIGHT_THRESHOLD?: number | undefined;
    QUALITY_CONTRAST_THRESHOLD?: number | undefined;
    QUALITY_XRAY_GRAYSCALE_RATIO?: number | undefined;
    QUALITY_XRAY_DARK_RATIO?: number | undefined;
    ASK_ENABLED?: boolean | undefined;
    ASK_DAILY_CAP?: number | undefined;
    CLINIC_WHATSAPP?: string | undefined;
    VITE_FIREBASE_API_KEY?: string | undefined;
    VITE_FIREBASE_AUTH_DOMAIN?: string | undefined;
    VITE_FIREBASE_PROJECT_ID?: string | undefined;
    VITE_FIREBASE_STORAGE_BUCKET?: string | undefined;
    VITE_FIREBASE_MESSAGING_SENDER_ID?: string | undefined;
    VITE_FIREBASE_APP_ID?: string | undefined;
    VITE_FIREBASE_MEASUREMENT_ID?: string | undefined;
    LOG_LEVEL?: "debug" | "info" | "warn" | "error" | undefined;
    LOG_FORMAT?: "json" | "pretty" | undefined;
    ENABLE_DENTIST_REVIEW?: boolean | undefined;
    ENABLE_CORRECTION_STORAGE?: boolean | undefined;
    ENABLE_METRICS?: boolean | undefined;
}>;
/**
 * Parsed and validated configuration
 */
export type Config = z.infer<typeof EnvSchema>;
/**
 * Load and validate configuration
 * Call once at application startup
 */
export declare function loadConfig(): Config;
/**
 * Get current config (throws if not loaded)
 */
export declare function getConfig(): Config;
/**
 * Reset config (for testing)
 */
export declare function resetConfig(): void;
/**
 * Configuration constants derived from env
 */
export declare const CONFIG_CONSTANTS: {
    readonly ALLOWED_MIME_TYPES: readonly ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
    readonly ALLOWED_XRAY_TYPES: readonly ["bitewing", "periapical", "opg", "unknown"];
    readonly ALLOWED_SYMPTOMS: readonly ["pain", "swelling", "fever", "injury", "recent injury", "bleeding"];
    readonly SUPPORTED_LANGUAGES: readonly ["en", "ml"];
    readonly FDI_ADULT_MIN: 11;
    readonly FDI_ADULT_MAX: 48;
    readonly FDI_PRIMARY_MIN: 51;
    readonly FDI_PRIMARY_MAX: 85;
    readonly REPORT_TOKEN_EXPIRY_SECONDS: 7200;
    readonly MAX_QUESTIONS_PER_REPORT: 5;
    readonly MAX_QA_PAYLOAD_SIZE: 6000;
    readonly MAX_FINDINGS_IN_PAYLOAD: 10;
    readonly DEFAULT_MAX_FINDINGS: 6;
    readonly DEFAULT_MAX_HEALTHY_OBSERVATIONS: 10;
    readonly DEFAULT_MAX_NEXT_STEPS: 10;
    readonly DEFAULT_MAX_LIMITATIONS: 10;
};
export type AllowedMimeType = typeof CONFIG_CONSTANTS.ALLOWED_MIME_TYPES[number];
export type AllowedXRayType = typeof CONFIG_CONSTANTS.ALLOWED_XRAY_TYPES[number];
export type AllowedSymptom = typeof CONFIG_CONSTANTS.ALLOWED_SYMPTOMS[number];
export type SupportedLanguage = typeof CONFIG_CONSTANTS.SUPPORTED_LANGUAGES[number];
export {};
//# sourceMappingURL=index.d.ts.map