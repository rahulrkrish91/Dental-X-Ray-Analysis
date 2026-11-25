/**
 * Main Entry Point - CLI and Server
 * Production-ready entry with proper error handling
 */
import 'dotenv/config';
import { loadConfig } from './config/index.js';
import { runAnalysisPipeline, healthCheck } from './pipeline/index.js';
import { resetVisionClient } from './api/vision-client.js';
import { resetReasoningClient } from './api/reasoning-client.js';
// Load config at startup
loadConfig();
/**
 * CLI Analysis Function
 * For direct usage or testing
 */
export async function analyzeImage(request) {
    return runAnalysisPipeline(request);
}
/**
 * CLI Health Check
 */
export async function checkHealth() {
    return healthCheck();
}
/**
 * Graceful shutdown handler
 */
let shuttingDown = false;
async function shutdown(signal) {
    if (shuttingDown)
        return;
    shuttingDown = true;
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    // Reset clients (closes any persistent connections)
    resetVisionClient();
    resetReasoningClient();
    console.log('Shutdown complete');
    process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    shutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    shutdown('unhandledRejection');
});
// CLI support
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    if (args[0] === 'health') {
        const health = await checkHealth();
        console.log(JSON.stringify(health, null, 2));
        process.exit(health.status === 'healthy' ? 0 : 1);
    }
    if (args[0] === 'analyze' && args[1]) {
        // Read image from file
        const fs = await import('fs/promises');
        const imageBuffer = await fs.readFile(args[1]);
        const base64 = imageBuffer.toString('base64');
        const request = {
            image_base64: base64,
            mime_type: 'image/jpeg',
            xray_type_hint: args[2] || 'unknown',
            symptoms: args[3] ? args[3].split(',') : [],
            language: args[4] || 'en'
        };
        const result = await analyzeImage(request);
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.success ? 0 : 1);
    }
    console.log(`
Usage:
  npm run analyze <image-path> [xray-type] [symptoms] [language]
  npm run health

Examples:
  npm run analyze ./xray.jpg bitewing "pain,swelling" en
  npm run health
  `);
    process.exit(1);
}
export { loadConfig, getConfig, resetConfig } from './config/index.js';
export { getVisionClient, resetVisionClient } from './api/vision-client.js';
export { getReasoningClient, resetReasoningClient } from './api/reasoning-client.js';
export { runAnalysisPipeline, healthCheck, processImage } from './pipeline/index.js';
export { validateVisionOutput } from './validation/index.js';
//# sourceMappingURL=main.js.map