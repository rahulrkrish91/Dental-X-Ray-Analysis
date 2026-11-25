/**
 * Robust JSON extraction from model responses
 * Handles markdown code blocks, partial JSON, and common formatting issues
 */
export declare function extractJson(text: string): unknown;
/**
 * Safe JSON parse with detailed error info
 */
export declare function safeParseJson<T>(text: string): {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
};
/**
 * Validate JSON matches expected schema structure (lightweight)
 */
export declare function validateJsonStructure(obj: unknown, requiredKeys: string[]): {
    valid: boolean;
    missing: string[];
};
//# sourceMappingURL=json-extractor.d.ts.map