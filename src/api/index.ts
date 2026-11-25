/**
 * API Module - Public Exports
 * Production-ready NIM API clients with retry, timeout, and error handling
 */

export {
  NIMClient,
  NIMError,
  NIMTimeoutError,
  NIMAuthError,
  NIMRateLimitError,
  NIMServerError,
  type NIMRequestOptions,
  type NIMMessage,
  type NIMContentPart,
  type NIMResponse,
  type NIMChoice,
  type NIMUsage,
  type NIMError as NIMErrorResponse,
  bufferToDataUrl,
  validateImageBuffer
} from './nim-client.js';

export {
  VisionClient,
  getVisionClient,
  resetVisionClient
} from './vision-client.js';

export {
  ReasoningClient,
  getReasoningClient,
  resetReasoningClient
} from './reasoning-client.js';

import { NIMClient } from './nim-client.js';
import { VisionClient } from './vision-client.js';
import { ReasoningClient } from './reasoning-client.js';
import { getConfig } from '../config/index.js';

/**
 * API Client Factory
 * Creates configured clients from environment
 */
export class APIClientFactory {
  private static visionInstance: VisionClient | null = null;
  private static reasoningInstance: ReasoningClient | null = null;

  static createVisionClient(): VisionClient {
    if (!this.visionInstance) {
      this.visionInstance = new VisionClient();
    }
    return this.visionInstance;
  }

  static createReasoningClient(): ReasoningClient {
    if (!this.reasoningInstance) {
      this.reasoningInstance = new ReasoningClient();
    }
    return this.reasoningInstance;
  }

  static createBaseClient(): NIMClient {
    const config = getConfig();
    return new NIMClient(
      config.NVIDIA_API_KEY,
      config.NVIDIA_API_BASE_URL,
      config.VISION_API_TIMEOUT_MS,
      config.VISION_MAX_RETRIES
    );
  }

  static reset(): void {
    this.visionInstance = null;
    this.reasoningInstance = null;
  }
}

/**
 * Health check all API clients
 */
export async function checkAPIHealth(): Promise<{
  vision: { available: boolean; latencyMs?: number };
  reasoning: { available: boolean; latencyMs?: number };
}> {
  const visionClient = APIClientFactory.createVisionClient();
  const reasoningClient = APIClientFactory.createReasoningClient();

  const [visionHealth, reasoningHealth] = await Promise.all([
    visionClient.healthCheck(),
    reasoningClient.healthCheck()
  ]);

  return {
    vision: { available: visionHealth.available, latencyMs: visionHealth.latencyMs },
    reasoning: { available: reasoningHealth.available, latencyMs: reasoningHealth.latencyMs }
  };
}