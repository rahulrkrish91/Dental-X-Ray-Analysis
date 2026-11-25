/**
 * Robust JSON extraction from model responses
 * Handles markdown code blocks, partial JSON, and common formatting issues
 */

export function extractJson(text: string): unknown {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty or invalid input');
  }

  // Try 1: Direct JSON parse (ideal case)
  try {
    return JSON.parse(text.trim());
  } catch {
    // Continue to other strategies
  }

  // Try 2: Extract from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch) {
    const candidate = codeBlockMatch[1].trim();
    try {
      return JSON.parse(candidate);
    } catch {
      // Continue
    }
  }

  // Try 3: Find first { to last } (handles leading/trailing text)
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start !== -1 && end !== -1 && end > start) {
    const candidate = text.slice(start, end + 1).trim();
    try {
      return JSON.parse(candidate);
    } catch {
      // Continue
    }
  }

  // Try 4: Find first [ to last ] (for array responses)
  const arrStart = text.indexOf('[');
  const arrEnd = text.lastIndexOf(']');

  if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
    const candidate = text.slice(arrStart, arrEnd + 1).trim();
    try {
      return JSON.parse(candidate);
    } catch {
      // Continue
    }
  }

  // Try 5: Clean common formatting issues and retry
  const cleaned = cleanJsonText(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    // Continue
  }

  throw new Error('MODEL_BAD_JSON: Could not extract valid JSON from response');
}

/**
 * Clean common JSON formatting issues from model output
 */
function cleanJsonText(text: string): string {
  let cleaned = text.trim();

  // Remove markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

  // Remove leading/trailing non-JSON text (keep only first { to last })
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // Fix common issues:
  // - Trailing commas in objects/arrays
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

  // - Single quotes to double quotes (for keys and strings)
  // This is risky, only do for obvious cases
  cleaned = cleaned.replace(/'([^']+)':/g, '"$1":');

  // - Unquoted keys (simple alphanumeric)
  cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

  // - Remove comments
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  cleaned = cleaned.replace(/\/\/.*$/gm, '');

  // - Fix newlines in strings
  cleaned = cleaned.replace(/"([^"]*)\n([^"]*)"/g, '"$1 $2"');

  // - Remove control characters except newlines/tabs in strings
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return cleaned;
}

/**
 * Safe JSON parse with detailed error info
 */
export function safeParseJson<T>(text: string): { success: true; data: T } | { success: false; error: string } {
  try {
    const data = extractJson(text) as T;
    return { success: true, data };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

/**
 * Validate JSON matches expected schema structure (lightweight)
 */
export function validateJsonStructure(obj: unknown, requiredKeys: string[]): { valid: boolean; missing: string[] } {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, missing: requiredKeys };
  }

  const objKeys = Object.keys(obj as Record<string, unknown>);
  const missing = requiredKeys.filter(key => !objKeys.includes(key));

  return { valid: missing.length === 0, missing };
}