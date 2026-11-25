# Dental X-ray Insights

AI-powered preliminary analysis for dental X-rays. **Not a medical diagnosis.**

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template and configure
cp .env.example .env
# Edit .env with your NVIDIA API key

# 3. Run locally
npm run dev
# Server runs at http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NVIDIA_API_KEY` | Yes | API key from https://build.nvidia.com/ |
| `NVIDIA_API_BASE_URL` | No | Default: `https://integrate.api.nvidia.com/v1` |
| `NVIDIA_MODEL` | No | Default: `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` |
| `PORT` | No | Default: `3000` |
| `RATE_LIMIT_MAX` | No | Analyze requests per hour per IP (default: 10) |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window in ms (default: 3600000) |
| `REPORT_SIGNING_SECRET` | For Q&A | HMAC secret for signing report tokens (32+ random bytes) |
| `ASK_ENABLED` | No | Enable Q&A (default: true) |
| `ASK_RATE_LIMIT_MAX` | No | Q&A requests per hour per IP (default: 20) |
| `ASK_RATE_LIMIT_WINDOW_MS` | No | Q&A rate limit window in ms (default: 3600000) |
| `ASK_DAILY_CAP` | No | Optional global daily question cap (default: 0 = disabled) |
| `CLINIC_WHATSAPP` | No | Clinic WhatsApp number with country code (digits only) |

## Deploy

### Render (Recommended)

1. Push to GitHub
2. Create new Web Service on Render
3. Connect repo, set build command: `npm install`, start command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy - HTTPS enabled automatically

### Railway

```bash
railway login
railway init
railway add --env NVIDIA_API_KEY=xxx NVIDIA_API_BASE_URL=... NVIDIA_MODEL=...
railway up
```

### VPS (Docker)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t dental-xray .
docker run -d -p 3000:3000 --env-file .env dental-xray
```

Use nginx/Caddy for HTTPS reverse proxy.

## Test

```bash
# With server running
npm test
# Or with custom image
node test/test-analyze.js /path/to/xray.jpg
```

## API

- `GET /api/health` - Health check
- `POST /api/analyze` - Analyze X-ray (multipart: image, xrayType, symptoms)
- `GET /api/config` - Public config (clinic WhatsApp)
- `POST /api/ask` - Follow-up question (JSON: token, question, language, history)

## Privacy

- Images processed in memory only, never stored
- Sent to NVIDIA API for analysis only
- Not used for training
- No tracking, no accounts, no database
- Follow-up questions sent to NVIDIA API, not stored by this tool

## Disclaimer

**AI-generated preliminary observation, not a medical diagnosis. Please consult a qualified dentist.**