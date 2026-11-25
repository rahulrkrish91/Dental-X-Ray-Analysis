/**
 * Vision Model Client - nemotron-3.5-super-vl-120b-a12b
 * Handles dental X-ray image analysis with structured JSON output
 */

import { NIMClient, type NIMMessage, type NIMResponse, bufferToDataUrl } from './nim-client.js';
import { getConfig } from '../config/index.js';
import type { VisionOutput, VisionFinding } from '../types/schemas.js';
import { VisionOutputSchema } from '../types/schemas.js';
import { extractJson } from '../utils/json-extractor.js';

/**
 * Vision model specific prompt for structured dental analysis
 */
const VISION_SYSTEM_PROMPT = `You are a dental radiology AI that analyzes dental X-rays and outputs structured findings in JSON format.

CRITICAL: Output ONLY valid JSON matching the exact schema below. No markdown, no commentary, no reasoning text.

SCHEMA:
{
  "image_quality": {
    "adequate": boolean,
    "rating": "good" | "fair" | "poor",
    "issues": string[],
    "sharpness_score": number (0-100),
    "contrast_score": number (0-100),
    "exposure_score": number (0-100)
  },
  "teeth_present": number[] (FDI numbers 11-48),
  "teeth_missing": number[] (FDI numbers 11-48),
  "findings": [
    {
      "tooth": number (1-48) | null,
      "tooth_fdi": string (FDI format) | null,
      "surfaces": ["M","D","O","B","L","I","C"],
      "pathology": "caries"|"periapical"|"periodontal"|"restoration"|"crown"|"implant"|"impacted"|"retained_root"|"fracture"|"lesion_cyst"|"bone_loss"|"other",
      "severity": "mild"|"moderate"|"severe",
      "confidence": number (0.0-1.0),
      "description": string (max 500 chars),
      "bbox": {"x": number, "y": number, "w": number, "h": number} | null
    }
  ],
  "periodontal": {
    "bone_loss": "none"|"mild"|"moderate"|"severe",
    "teeth_affected": number[],
    "description": string
  },
  "restorations": [
    {
      "tooth_fdi": string,
      "type": "filling"|"crown"|"bridge"|"implant"|"root_canal"|"ortho",
      "condition": "intact"|"defective"|"recurrent_caries"
    }
  ],
  "other_observations": string[]
}

ANALYSIS RULES:
1. If image is NOT a dental X-ray, set adequate=false, rating="poor", issues=["not_dental_xray"], return empty findings
2. Identify x-ray type from anatomy: bitewing (crowns only), periapical (full tooth + apex), OPG (full jaw)
3. Use FDI notation: upper right 11-18, upper left 21-28, lower left 31-38, lower right 41-48
4. Surfaces: M=mesial, D=distal, O=occlusal/incisal, B=buccal, L=lingual, I=incisal, C=cementoenamel junction
5. Confidence: high (0.8-1.0) for clear findings, medium (0.5-0.79) for probable, low (0.3-0.49) for subtle
6. Bbox: normalized 0-1 coordinates, top-left origin. Null if cannot localize.
7. Max 20 findings. Order by clinical significance.
8. Recognize normal anatomy: mental foramen, mandibular canal, maxillary sinus, nasal fossa, incisive foramen - DO NOT flag as pathology
9. Recognize restorations: fillings, crowns, bridges, implants, RCT, ortho - only flag if defective
10. For OPG: assess both jaws, TMJ, sinuses
11. If quality unusable (blurry, over/under exposed, wrong orientation), set adequate=false, return minimal findings`;

/**
 * Build user message with image and context
 */
function buildVisionUserMessage(
  imageDataUrl: string,
  xrayTypeHint?: string,
  symptoms?: string[]
): NIMMessage {
  const symptomText = symptoms && symptoms.length > 0
    ? `Patient-reported symptoms: ${symptoms.join(', ')}. `
    : '';

  const typeHint = xrayTypeHint ? `X-ray type hint: ${xrayTypeHint}. ` : '';

  return {
    role: 'user',
    content: [
      { type: 'text', text: `${symptomText}${typeHint}Analyze this dental radiograph. Output only the JSON schema specified.` },
      { type: 'image_url', image_url: { url: imageDataUrl } }
    ]
  };
}

/**
 * Vision Model Client
 */
export class VisionClient extends NIMClient {
  private readonly model: string;

  constructor() {
    const config = getConfig();
    super(
      config.NVIDIA_API_KEY,
      config.NVIDIA_API_BASE_URL,
      config.VISION_API_TIMEOUT_MS,
      config.VISION_MAX_RETRIES
    );
    this.model = config.NVIDIA_VISION_MODEL;
  }

  /**
   * Analyze dental X-ray image
   */
  async analyzeImage(
    imageBuffer: Buffer,
    mimeType: string,
    options: {
      xrayTypeHint?: string;
      symptoms?: string[];
      requestId?: string;
    } = {}
  ): Promise<VisionOutput> {
    const startTime = Date.now();

    const imageDataUrl = bufferToDataUrl(imageBuffer, mimeType as any);
    const userMessage = buildVisionUserMessage(imageDataUrl, options.xrayTypeHint, options.symptoms);

    const messages: NIMMessage[] = [
      { role: 'system', content: VISION_SYSTEM_PROMPT },
      userMessage
    ];

    const response = await this.chatCompletion({
      model: this.model,
      messages,
      temperature: 0.3,  // Lower for structured output consistency
      top_p: 0.95,
      max_tokens: 8192,
      timeout_ms: getConfig().VISION_API_TIMEOUT_MS
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from vision model');
    }

    // Parse JSON from response
    let parsed: unknown;
    try {
      parsed = extractJson(content);
    } catch (e) {
      throw new Error(`Failed to parse vision model JSON: ${(e as Error).message}`);
    }

    // Validate against schema
    const validated = VisionOutputSchema.safeParse(parsed);
    if (!validated.success) {
      throw new Error(`Vision output validation failed: ${validated.error.message}`);
    }

    const result = validated.data;

    // Add processing metadata
    (result as any).processing_metadata = {
      model: this.model,
      processing_time_ms: Date.now() - startTime,
      tokens_used: response.usage?.total_tokens
    };

    return result;
  }

  /**
   * Health check for vision model
   */
  async healthCheck(): Promise<{ available: boolean; latencyMs: number }> {
    return super.healthCheck(this.model);
  }
}

/**
 * Singleton instance
 */
let visionClientInstance: VisionClient | null = null;

export function getVisionClient(): VisionClient {
  if (!visionClientInstance) {
    visionClientInstance = new VisionClient();
  }
  return visionClientInstance;
}

export function resetVisionClient(): void {
  visionClientInstance = null;
}