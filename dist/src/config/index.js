/**
 * Production-ready configuration management
 * Validates all required environment variables at startup
 */
import 'dotenv/config';
import { z } from 'zod';
/**
 * Environment variable schema with validation
 */
const EnvSchema = z.object({
    // NVIDIA NIM API Configuration
    NVIDIA_API_KEY: z.string().min(1, 'NVIDIA_API_KEY is required'),
    NVIDIA_API_BASE_URL: z.string().url().default('https://integrate.api.nvidia.com/v1'),
    // Model names (NIM endpoints)
    NVIDIA_VISION_MODEL: z.string().default('nvidia/nemotron-3-5-super-vl-120b-a12b'),
    NVIDIA_REASONING_MODEL: z.string().default('nvidia/nemotron-3-5-lightning-30b-a3b'),
    // Server Configuration
    PORT: z.coerce.number().int().positive().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    // Request Timeouts (ms)
    VISION_API_TIMEOUT_MS: z.coerce.number().int().positive().default(60000),
    REASONING_API_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),
    VISION_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
    REASONING_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(2),
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(3600000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
    ASK_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
    ASK_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(3600000),
    // Image Processing
    MAX_FILE_SIZE: z.coerce.number().int().positive().default(10485760),
    MAX_DIMENSION: z.coerce.number().int().positive().default(8192),
    TARGET_LONG_EDGE: z.coerce.number().int().positive().default(2048),
    OPG_TARGET_LONG_EDGE: z.coerce.number().int().positive().default(3072),
    // Quality Thresholds
    QUALITY_MIN_SHORT_SIDE_BLOCK: z.coerce.number().int().positive().default(600),
    QUALITY_MIN_SHORT_SIDE_WARN: z.coerce.number().int().positive().default(900),
    QUALITY_BLUR_BLOCK_THRESHOLD: z.coerce.number().min(0).max(1000).default(50),
    QUALITY_BLUR_WARN_THRESHOLD: z.coerce.number().min(0).max(1000).default(100),
    QUALITY_DARK_THRESHOLD: z.coerce.number().min(0).max(255).default(30),
    QUALITY_BRIGHT_THRESHOLD: z.coerce.number().min(0).max(255).default(225),
    QUALITY_CONTRAST_THRESHOLD: z.coerce.number().min(0).max(255).default(30),
    QUALITY_XRAY_GRAYSCALE_RATIO: z.coerce.number().min(0).max(1).default(0.85),
    QUALITY_XRAY_DARK_RATIO: z.coerce.number().min(0).max(1).default(0.6),
    // Q&A Configuration
    REPORT_SIGNING_SECRET: z.string().min(32, 'REPORT_SIGNING_SECRET must be at least 32 chars'),
    ASK_ENABLED: z.coerce.boolean().default(true),
    ASK_DAILY_CAP: z.coerce.number().int().min(0).default(0),
    CLINIC_WHATSAPP: z.string().optional(),
    // Firebase (optional, for analytics)
    VITE_FIREBASE_API_KEY: z.string().optional(),
    VITE_FIREBASE_AUTH_DOMAIN: z.string().optional(),
    VITE_FIREBASE_PROJECT_ID: z.string().optional(),
    VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
    VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
    VITE_FIREBASE_APP_ID: z.string().optional(),
    VITE_FIREBASE_MEASUREMENT_ID: z.string().optional(),
    // Logging
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    LOG_FORMAT: z.enum(['json', 'pretty']).default('pretty'),
    // Feature Flags
    ENABLE_DENTIST_REVIEW: z.coerce.boolean().default(true),
    ENABLE_CORRECTION_STORAGE: z.coerce.boolean().default(false),
    ENABLE_METRICS: z.coerce.boolean().default(true)
});
/**
 * Singleton config instance
 */
let configInstance = null;
/**
 * Load and validate configuration
 * Call once at application startup
 */
export function loadConfig() {
    if (configInstance) {
        return configInstance;
    }
    const result = EnvSchema.safeParse(process.env);
    if (!result.success) {
        const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
        throw new Error(`Configuration validation failed:\n${errors}`);
    }
    configInstance = result.data;
    return configInstance;
}
/**
 * Get current config (throws if not loaded)
 */
export function getConfig() {
    if (!configInstance) {
        return loadConfig();
    }
    return configInstance;
}
/**
 * Reset config (for testing)
 */
export function resetConfig() {
    configInstance = null;
}
/**
 * Configuration constants derived from env
 */
export const CONFIG_CONSTANTS = {
    // Supported MIME types
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
    // Supported X-ray types
    ALLOWED_XRAY_TYPES: ['bitewing', 'periapical', 'opg', 'unknown'],
    // Supported symptoms
    ALLOWED_SYMPTOMS: ['pain', 'swelling', 'fever', 'injury', 'recent injury', 'bleeding'],
    // Supported languages
    SUPPORTED_LANGUAGES: ['en', 'ml'],
    // FDI tooth ranges
    FDI_ADULT_MIN: 11,
    FDI_ADULT_MAX: 48,
    FDI_PRIMARY_MIN: 51,
    FDI_PRIMARY_MAX: 85,
    // Report signing
    REPORT_TOKEN_EXPIRY_SECONDS: 7200, // 2 hours
    MAX_QUESTIONS_PER_REPORT: 5,
    // Payload size limits
    MAX_QA_PAYLOAD_SIZE: 6000,
    MAX_FINDINGS_IN_PAYLOAD: 10,
    // Default limits
    DEFAULT_MAX_FINDINGS: 6,
    DEFAULT_MAX_HEALTHY_OBSERVATIONS: 10,
    DEFAULT_MAX_NEXT_STEPS: 10,
    DEFAULT_MAX_LIMITATIONS: 10
};
//# sourceMappingURL=index.js.map