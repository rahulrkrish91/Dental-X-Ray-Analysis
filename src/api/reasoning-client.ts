/**
 * Reasoning Model Client - nemotron-3.5-lightning-30b-a3b
 * Generates clinical report from validated vision findings
 */

import { NIMClient, type NIMMessage } from './nim-client.js';
import { getConfig } from '../config/index.js';
import type { VisionOutput, ClinicalReport, ClinicalFinding, ValidationFlag } from '../types/schemas.js';
import { ClinicalReportSchema, ClinicalFindingSchema } from '../types/schemas.js';
import { extractJson } from '../utils/json-extractor.js';

/**
 * Reasoning model prompt for clinical report generation
 */
const REASONING_SYSTEM_PROMPT = `You are a dental AI assistant that generates patient-friendly clinical reports from structured dental X-ray findings.

CRITICAL: Output ONLY valid JSON matching the exact schema below. No markdown, no commentary, no reasoning text.

SCHEMA:
{
  "is_dental_xray": boolean,
  "rejection_reason": string | null,
  "xray_type": "bitewing"|"periapical"|"opg"|"unknown",
  "image_quality": {
    "rating": "good"|"fair"|"poor",
    "issues": string[],
    "usable": boolean
  },
  "summary": string (max 500 chars, plain language, 2-3 sentences),
  "healthy_observations": string[] (max 10, plain language observations),
  "findings": [
    {
      "id": string (unique identifier),
      "label": string (short clinical label, e.g., "Possible caries upper left first molar"),
      "tooth_fdi": string (FDI format) | null,
      "location_description": string (plain language location),
      "explanation_plain": string (max 500 chars, plain language explanation for patient),
      "confidence": "low"|"medium"|"high",
      "urgency": "routine"|"soon"|"urgent",
      "bbox": {"x": number, "y": number, "w": number, "h": number} | null
    }
  ],
  "recommended_next_steps": string[] (max 10, actionable steps for patient),
  "limitations": string[] (max 10, what this analysis cannot detect),
  "disclaimer": string (standard medical disclaimer),
  "dentist_review_flags": [
    {
      "code": string,
      "severity": "info"|"warning"|"critical",
      "message": string,
      "finding_index": number | null,
      "tooth_fdi": string | null
    }
  ]
}

WRITING RULES:
1. Plain language for general public (grade 8 reading level)
2. Use cautious wording: "possible", "may indicate", "appears to show", "could be"
3. NEVER write: "you have", "diagnosis", "confirmed", "definitely"
4. Explain dental terms first time used (e.g., "caries (tooth decay)")
5. Summary: 2-3 sentences, under 60 words
6. Each explanation_plain: under 50 words
7. Each list item: under 25 words
8. Urgency mapping:
   - routine: no obvious infection, normal check-up sufficient
   - soon: possible decay, bone loss, lesion needing assessment within weeks
   - urgent: large lesion/infection AND/OR symptoms include swelling, fever, spreading pain
9. Confidence mapping from vision numeric:
   - high (0.8-1.0) -> "high"
   - medium (0.5-0.79) -> "medium"
   - low (0.3-0.49) -> "low"
10. Include standard disclaimer about AI limitations
11. Pass through dentist_review_flags from validation layer
12. Max 10 findings, ordered by urgency then confidence
13. If no findings, state "No clear abnormalities visible in this image" but NEVER say teeth are healthy

OUTPUT FORMAT: JSON only, no extra keys`;

/**
 * Build user message with vision findings and validation flags
 */
function buildReasoningUserMessage(
  visionOutput: VisionOutput,
  validationFlags: ValidationFlag[],
  language: 'en' | 'ml' = 'en'
): NIMMessage {
  const langInstruction = language === 'ml'
    ? 'Respond in Malayalam (simple everyday Malayalam, keep OPG, AI, FDI tooth numbers unchanged).'
    : 'Respond in English.';

  // Format findings for the prompt
  const findingsText = visionOutput.findings.map((f, i) =>
    `${i + 1}. Tooth ${f.tooth_fdi || f.tooth || 'unknown'}: ${f.pathology} (${f.severity}) on surfaces [${f.surfaces.join(',') || 'N/A'}]. ${f.description}. Confidence: ${f.confidence.toFixed(2)}`
  ).join('\n') || 'None';

  const periodontalText = visionOutput.periodontal.bone_loss !== 'none'
    ? `Periodontal: ${visionOutput.periodontal.bone_loss} bone loss affecting teeth ${visionOutput.periodontal.teeth_affected.join(', ') || 'multiple'}. ${visionOutput.periodontal.description || ''}`
    : 'Periodontal: No significant bone loss detected.';

  const restorationsText = visionOutput.restorations.length > 0
    ? visionOutput.restorations.map(r => `${r.tooth_fdi}: ${r.type} (${r.condition || 'intact'})`).join('; ')
    : 'No restorations detected.';

  const qualityText = `Image quality: ${visionOutput.image_quality.rating} (adequate: ${visionOutput.image_quality.adequate}). Issues: ${visionOutput.image_quality.issues.join(', ') || 'none'}.`;

  const flagsText = validationFlags.length > 0
    ? `VALIDATION FLAGS FOR DENTIST REVIEW:\n${validationFlags.map(f => `- [${f.severity.toUpperCase()}] ${f.code}: ${f.message}`).join('\n')}`
    : 'No validation flags.';

  const content = `STRUCTURED VISION FINDINGS:
${qualityText}
Teeth present: ${visionOutput.teeth_present.join(', ') || 'unknown'}
Teeth missing: ${visionOutput.teeth_missing.join(', ') || 'none'}
Findings:
${findingsText}
${periodontalText}
Restorations: ${restorationsText}
Other observations: ${visionOutput.other_observations.join('; ') || 'none'}

${flagsText}

${langInstruction}`;

  return { role: 'user', content };
}

/**
 * Reasoning Model Client
 */
export class ReasoningClient extends NIMClient {
  private readonly model: string;

  constructor() {
    const config = getConfig();
    super(
      config.NVIDIA_API_KEY,
      config.NVIDIA_API_BASE_URL,
      config.REASONING_API_TIMEOUT_MS,
      config.REASONING_MAX_RETRIES
    );
    this.model = config.NVIDIA_REASONING_MODEL;
  }

  /**
   * Generate clinical report from validated vision output
   */
  async generateReport(
    visionOutput: VisionOutput,
    validationFlags: ValidationFlag[],
    language: 'en' | 'ml' = 'en'
  ): Promise<ClinicalReport> {
    const startTime = Date.now();

    const userMessage = buildReasoningUserMessage(visionOutput, validationFlags, language);

    const messages: NIMMessage[] = [
      { role: 'system', content: REASONING_SYSTEM_PROMPT },
      userMessage
    ];

    const response = await this.chatCompletion({
      model: this.model,
      messages,
      temperature: 0.4,  // Slightly higher for natural language variation
      top_p: 0.95,
      max_tokens: 4096,
      timeout_ms: getConfig().REASONING_API_TIMEOUT_MS,
      reasoning_budget: 1024
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from reasoning model');
    }

    // Parse JSON from response
    let parsed: unknown;
    try {
      parsed = extractJson(content);
    } catch (e) {
      throw new Error(`Failed to parse reasoning model JSON: ${(e as Error).message}`);
    }

    // Validate against schema
    const validated = ClinicalReportSchema.safeParse(parsed);
    if (!validated.success) {
      throw new Error(`Clinical report validation failed: ${validated.error.message}`);
    }

    const result = validated.data;

    // Add processing metadata
    (result as any).metadata = {
      vision_model: visionOutput.processing_metadata?.model || 'unknown',
      reasoning_model: this.model,
      total_processing_time_ms: Date.now() - startTime + (visionOutput.processing_metadata?.processing_time_ms || 0),
      vision_confidence_avg: visionOutput.findings.length > 0
        ? visionOutput.findings.reduce((sum, f) => sum + f.confidence, 0) / visionOutput.findings.length
        : 0
    };

    return result;
  }

  /**
   * Health check for reasoning model
   */
  async healthCheck(): Promise<{ available: boolean; latencyMs: number }> {
    return super.healthCheck(this.model);
  }
}

/**
 * Singleton instance
 */
let reasoningClientInstance: ReasoningClient | null = null;

export function getReasoningClient(): ReasoningClient {
  if (!reasoningClientInstance) {
    reasoningClientInstance = new ReasoningClient();
  }
  return reasoningClientInstance;
}

export function resetReasoningClient(): void {
  reasoningClientInstance = null;
}