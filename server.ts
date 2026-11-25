/**
 * Express Server - Production-ready HTTP API
 * Uses new pipeline architecture with nemotron models
 */

import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { createHmac, timingSafeEqual } from 'crypto';
import 'dotenv/config';

// Load config early
import { loadConfig, getConfig, CONFIG_CONSTANTS } from './src/config/index.js';
import { runAnalysisPipeline, healthCheck } from './src/pipeline/index.js';
import {
  buildQAPayload,
  signToken,
  verifyToken,
  checkEmergency,
  postFilterAnswer,
  FALLBACK_ANSWERS,
  parseSymptoms,
  extractJson,
  ASK_SYSTEM_PROMPT
} from './src/utils/qa-helpers.js';
import type { AnalysisRequest, ClinicalReport, ValidationFlag } from './src/types/schemas.js';

loadConfig();
const config = getConfig();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase config for frontend
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

function injectFirebaseConfig(html: string): string {
  const configScript = `<script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
    import { getAnalytics, logEvent, isSupported } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js';

    const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 6)};

    let analytics = null;
    let analyticsReady = false;

    async function initAnalytics() {
      try {
        if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
          console.warn('[Firebase] Missing config, skipping analytics init');
          return;
        }
        console.log('[Firebase] Checking isSupported()...');
        const supported = await isSupported();
        console.log('[Firebase] isSupported() =', supported);
        if (!supported) {
          console.warn('[Firebase] Analytics not supported in this environment');
          return;
        }
        const app = initializeApp(firebaseConfig);
        console.log('[Firebase] App initialized, measurementId:', firebaseConfig.measurementId);
        analytics = firebaseConfig.measurementId
          ? getAnalytics(app, { measurementId: firebaseConfig.measurementId })
          : getAnalytics(app);
        window.firebaseAnalytics = analytics;
        analyticsReady = true;
        var msg = firebaseConfig.measurementId ? 'with measurementId ' + firebaseConfig.measurementId : '';
        console.log('[Firebase] Analytics initialized successfully', msg);
      } catch (err) {
        console.error('[Firebase] Analytics init failed:', err);
      }
    }
    window.logFirebaseEvent = (name, params) => {
      if (analyticsReady && analytics) {
        logEvent(analytics, name, params).catch(err => console.error('[Firebase] logEvent failed:', err));
      } else {
        console.debug('[Firebase] Event queued but analytics not ready:', name, params);
      }
    };
    initAnalytics();
  </script>`;
  return html.replace('</head>', configScript + '\n</head>');
}

const app = express();
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "https://www.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "https://www.google-analytics.com", "https://region1.google-analytics.com", "https://firebase.googleapis.com", "https://firebaselogging.googleapis.com", "https://firebaselogging-pa.googleapis.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "same-origin" }
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting
const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => req.ip || 'unknown'
});

app.use('/api/', rateLimiter);

// Multer config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.MAX_FILE_SIZE,
    files: 1
  },
  fileFilter: (_req, file, cb) => {
    if (CONFIG_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}

// Q&A Configuration
const REPORT_SIGNING_SECRET = config.REPORT_SIGNING_SECRET;
const ASK_ENABLED = config.ASK_ENABLED;
const ASK_RATE_LIMIT_MAX = config.ASK_RATE_LIMIT_MAX;
const ASK_RATE_LIMIT_WINDOW_MS = config.ASK_RATE_LIMIT_WINDOW_MS;
const ASK_DAILY_CAP = config.ASK_DAILY_CAP;
const CLINIC_WHATSAPP = config.CLINIC_WHATSAPP;

// In-memory daily counter
let dailyAskCount = 0;
let dailyAskReset = Date.now() + 86400000;

function resetDailyCounter(): void {
  const now = Date.now();
  if (now >= dailyAskReset) {
    dailyAskCount = 0;
    dailyAskReset = now + 86400000;
  }
}

function checkDailyCap(): boolean {
  if (!ASK_DAILY_CAP) return true;
  resetDailyCounter();
  return dailyAskCount < ASK_DAILY_CAP;
}

function incrementDailyCap(): void {
  if (ASK_DAILY_CAP) dailyAskCount++;
}

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const health = await healthCheck();
    res.status(health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: (error as Error).message
    });
  }
});

// Config endpoint
app.get('/api/config', (req: Request, res: Response) => {
  res.json({ clinicWhatsapp: CLINIC_WHATSAPP || null });
});

// Main analysis endpoint
app.post('/api/analyze', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const xrayType = CONFIG_CONSTANTS.ALLOWED_XRAY_TYPES.includes(req.body.xrayType as any)
      ? req.body.xrayType
      : 'unknown';
    const symptoms = parseSymptoms(req.body.symptoms);
    const language = CONFIG_CONSTANTS.SUPPORTED_LANGUAGES.includes(req.body.lang as any)
      ? req.body.lang
      : 'en';

    // Convert buffer to base64 for pipeline
    const imageBase64 = req.file.buffer.toString('base64');

    const request: AnalysisRequest = {
      image_base64: imageBase64,
      mime_type: req.file.mimetype as any,
      xray_type_hint: xrayType,
      symptoms,
      language,
      request_id: req.headers['x-request-id'] as string || undefined
    };

    const result = await runAnalysisPipeline(request);

    // Add report_token for Q&A if enabled
    if (ASK_ENABLED && REPORT_SIGNING_SECRET && result.success && result.report) {
      const report = result.report;
      if (report.is_dental_xray && report.image_quality?.usable) {
        const payload = buildQAPayload(report, language);
        (report as any).report_token = signToken(payload, REPORT_SIGNING_SECRET);
      }
    }

    const statusCode = result.success ? 200 :
      result.error?.code === 'INVALID_IMAGE' || result.error?.code === 'IMAGE_TOO_LARGE'
        ? 400 : 502;

    res.status(statusCode).json(result);

  } catch (error) {
    console.error('Analysis error:', (error as Error).message);
    if (error instanceof UserError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large (max 10MB)' });
      }
      return res.status(400).json({ error: error.message });
    }
    return res.status(502).json({ error: 'Analysis failed. Please try again.' });
  }
});

// Q&A endpoint
const askRateLimiter = rateLimit({
  windowMs: ASK_RATE_LIMIT_WINDOW_MS,
  max: ASK_RATE_LIMIT_MAX,
  message: { error: 'Too many questions right now, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request): string => req.ip || 'unknown'
});

interface QAPayload {
  r: {
    xray_type: string;
    summary: string;
    healthy_observations: string[];
    findings: Array<{
      id: string;
      label: string;
      tooth_fdi: string | null;
      explanation_plain: string;
      confidence: string;
      urgency: string;
    }>;
    recommended_next_steps: string[];
    limitations: string[];
  };
  lang: 'en' | 'ml';
  exp: number;
  q: number;
}

app.post('/api/ask', askRateLimiter, express.json({ limit: '16kb' }), async (req: Request, res: Response) => {
  // Kill switch
  if (!ASK_ENABLED || !REPORT_SIGNING_SECRET) {
    return res.status(503).json({ error: 'Q&A is currently unavailable' });
  }
  if (!checkDailyCap()) {
    return res.status(429).json({ error: 'Daily question limit reached. Please try again tomorrow.' });
  }

  try {
    const { token, question, language, history } = req.body;

    // Validate input
    if (!token || !question || !language) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    if (language !== 'en' && language !== 'ml') {
      return res.status(400).json({ error: 'Invalid language' });
    }

    // Verify token
    const payload = verifyToken(token, REPORT_SIGNING_SECRET) as QAPayload | null;
    if (!payload) {
      return res.status(400).json({ error: 'Invalid or expired session' });
    }
    if (typeof payload.q !== 'number' || payload.q >= 5) {
      return res.status(400).json({ error: 'Question limit reached for this report' });
    }

    // Validate question
    const trimmedQuestion = question.trim().replace(/[\x00-\x1F\x7F]/g, '');
    if (trimmedQuestion.length < 3 || trimmedQuestion.length > 300) {
      return res.status(400).json({ error: 'Question must be 3-300 characters' });
    }

    // Validate history
    let validHistory: Array<{ q: string; a: string }> = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-3)) {
        if (turn && typeof turn.q === 'string' && typeof turn.a === 'string') {
          const q = turn.q.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 300);
          const a = turn.a.trim().slice(0, 1200);
          if (q && a) validHistory.push({ q, a });
        }
      }
    }

    // Emergency pre-check
    if (checkEmergency(trimmedQuestion, language)) {
      const urgentMsg = language === 'ml'
        ? 'ഇത് അടിയന്തരമായിരിക്കാം. എന്തായാലും ഒരു ഡെന്റിസ്റ്റിനെയോ അതിയന്തര സേവനങ്ങളെയോ ഉടൻ ബന്ധപ്പെടുക. കാത്തിരിക്കരുത്.'
        : 'This could be urgent. Please contact a dentist or emergency service now. Do not wait.';
      const newPayload = { ...payload, q: payload.q + 1 };
      return res.json({
        answer: urgentMsg,
        suggest_dentist: true,
        urgent: true,
        remaining: 4 - payload.q,
        report_token: signToken(newPayload, REPORT_SIGNING_SECRET)
      });
    }

    incrementDailyCap();

    // Call NVIDIA API for Q&A
    const apiKey = config.NVIDIA_API_KEY;
    const baseUrl = config.NVIDIA_API_BASE_URL;
    const model = config.NVIDIA_REASONING_MODEL;

    if (!apiKey) {
      throw new Error('NVIDIA_API_KEY not configured');
    }

    // Format report context
    const reportCtx = payload.r;
    const findingsText = reportCtx.findings?.map((f: any, i: number) =>
      `${i + 1}. ${f.label}${f.tooth_fdi ? ` (Tooth ${f.tooth_fdi})` : ''}: ${f.explanation_plain} [${f.confidence} confidence, ${f.urgency} urgency]`
    ).join('\n') || 'None';

    const historyText = validHistory.map((t, i) => `Q${i + 1}: ${t.q}\nA${i + 1}: ${t.a}`).join('\n\n') || 'None';

    const userContent = `REPORT:
X-ray type: ${reportCtx.xray_type}
Summary: ${reportCtx.summary}
Healthy observations: ${(reportCtx.healthy_observations || []).join('; ') || 'None'}
Findings:
${findingsText}
Recommended next steps: ${(reportCtx.recommended_next_steps || []).join('; ') || 'None'}
Limitations: ${(reportCtx.limitations || []).join('; ') || 'None'}

PREVIOUS QUESTIONS:
${historyText}

CURRENT QUESTION: ${trimmedQuestion}

Respond in ${language === 'ml' ? 'Malayalam (simple everyday Malayalam, keep OPG, AI, FDI unchanged)' : 'English'}.`;

    const messages = [
      { role: 'system', content: ASK_SYSTEM_PROMPT },
      { role: 'user', content: userContent }
    ];

    let answer = null;
    let suggestDentist = false;
    let outOfScope = false;

    for (let attempt = 0; attempt <= 1; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.3,
            top_p: 0.95,
            max_tokens: 700,
            reasoning_budget: 1024,
            stream: false
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.status === 429 || response.status >= 500) {
          if (attempt < 1) {
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
            continue;
          }
          throw new Error(`API error: ${response.status}`);
        }

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`API error ${response.status}: ${errText}`);
        }

        const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error('Empty response from API');
        }

        let parsed: { answer: string; suggest_dentist: boolean; out_of_scope: boolean } | null = null;
        try {
          const extracted = extractJson(content);
          if (extracted && typeof extracted === 'object') {
            parsed = extracted as { answer: string; suggest_dentist: boolean; out_of_scope: boolean };
          }
        } catch (e) {
          if (attempt < 1) continue;
          throw new Error('MODEL_BAD_JSON');
        }

        if (!parsed) {
          if (attempt < 1) continue;
          throw new Error('Failed to parse response');
        }

        // Validate response structure
        if (typeof parsed.answer !== 'string' ||
            typeof parsed.suggest_dentist !== 'boolean' ||
            typeof parsed.out_of_scope !== 'boolean') {
          if (attempt < 1) continue;
          throw new Error('Invalid response structure');
        }

        // Post-filter
        if (!postFilterAnswer(parsed.answer)) {
          answer = language === 'ml' ? FALLBACK_ANSWERS.ml : FALLBACK_ANSWERS.en;
          suggestDentist = true;
        } else {
          answer = parsed.answer.slice(0, 900);
          suggestDentist = parsed.suggest_dentist;
        }
        outOfScope = parsed.out_of_scope;
        break;

      } catch (error) {
        if (attempt >= 1) throw error;
      }
    }

    if (answer === null) {
      return res.status(502).json({ error: 'Failed to get answer. Please try again.' });
    }

    // Return new token with incremented count
    const newPayload = { ...payload, q: payload.q + 1 };
    const newToken = signToken(newPayload, REPORT_SIGNING_SECRET);

    res.json({
      answer,
      suggest_dentist: suggestDentist,
      urgent: false,
      out_of_scope: outOfScope,
      remaining: 4 - payload.q,
      report_token: newToken
    });

  } catch (error) {
    console.error('Ask error:', (error as Error).message);
    if ((error as Error).name === 'AbortError' || (error as Error).name === 'TimeoutError') {
      return res.status(504).json({ error: 'Request timed out. Please try again.' });
    }
    return res.status(502).json({ error: 'Failed to get answer. Please try again.' });
  }
});

// Serve frontend
const publicDir = join(__dirname, 'public');
app.get('/', (req: Request, res: Response) => {
  const html = readFileSync(join(publicDir, 'index.html'), 'utf-8');
  res.send(injectFirebaseConfig(html));
});
app.use(express.static(publicDir));

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err.message);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large (max 10MB)' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
  console.log(`Vision model: ${config.NVIDIA_VISION_MODEL}`);
  console.log(`Reasoning model: ${config.NVIDIA_REASONING_MODEL}`);
});

export { app };