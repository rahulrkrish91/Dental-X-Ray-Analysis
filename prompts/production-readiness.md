# Dental X-ray Insights: Production Readiness Checklist

Status when this was written:
- `server.js` is unchanged from the version you attached.
- The new front end (`public/index.html`, `public/styles.css`, `public/app.js`, `public/fonts/*`) is written. **The end-to-end browser tests have not been run yet.** Run them (section 6) before relying on the UI.
- Nothing below is legal advice. Get a professional opinion for section 3.

Work through the sections in order. Sections 1 to 3 are launch blockers.

---

## 1. Fix `server.js` (blockers)

None of these change the analysis logic, the prompt, the schema or the image processing. They fix deployment, privacy and error handling.

### 1.1 Rate limit behind a host's proxy
On Render, Railway, Fly and similar hosts, `req.ip` is the proxy's address unless Express is told to trust it. Every visitor would share one bucket (10 requests per hour in total).

Add this near the top, after `const app = express();`:
```js
app.set('trust proxy', 1); // number of proxy hops in front of the app; check your host
```

### 1.2 Stop logging model output
These two lines write medical content (and possibly reasoning) to your logs, which contradicts the "not stored" wording on the page. Delete both:
```js
console.log('Full API response:', ...);
console.log('Raw model response:', ...);
```
Keep logging errors, but never log images, results, symptoms or IP addresses.

### 1.3 Never use reasoning text as the answer
Current code:
```js
const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.reasoning_content;
```
Change to:
```js
const content = data.choices?.[0]?.message?.content;
```

### 1.4 Robust JSON parsing, with one real repair retry
Right now `JSON.parse(content)` fails if the model wraps the JSON in a code fence. The "repair" branch builds `repairMessages` and never uses them, and the resulting error is wrongly returned as a 400.

Add a tolerant extractor and use it instead of `JSON.parse(content)`:
```js
function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('MODEL_BAD_JSON');
  return JSON.parse(candidate.slice(start, end + 1));
}
```
Then either:
- retry the whole model call once when parsing or schema validation fails (simplest; the loop already does this for schema failures), or
- send a second request that includes the bad output and asks for corrected JSON only.

Delete the dead `repairMessages` code either way.

### 1.5 Do not return internal error text
These currently reach the browser:
```js
throw new Error(`API error ${response.status}: ${errText}`);
...
res.status(status).json({ error: error.message || ... });
```
Use a small error class so only your own validation messages are shown:
```js
class UserError extends Error {}   // safe to show to the user

// in validateAndProcessImage, throw new UserError('Image too small (minimum 100x100px)') etc.

// in the route's catch:
if (error instanceof UserError) {
  return res.status(400).json({ error: error.message });
}
console.error('Analysis error:', error.message);          // message only, no payloads
return res.status(502).json({ error: 'Analysis failed. Please try again.' });
```
Also remove the string matching (`error.message.includes('Invalid')`) that picks the status code.

The new UI already hides server error text. This closes the same hole for anyone calling the API directly.

### 1.6 Validate `xrayType` and `symptoms` (also blocks prompt injection)
`JSON.parse(req.body.symptoms)` can throw, and free text goes straight into the prompt.
```js
const ALLOWED_TYPES = new Set(['unknown', 'bitewing', 'periapical', 'opg']);
const ALLOWED_SYMPTOMS = new Set(['pain', 'swelling', 'fever', 'recent injury', 'bleeding']);

function parseSymptoms(raw) {
  try {
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr.filter((s) => ALLOWED_SYMPTOMS.has(s)).slice(0, 5) : [];
  } catch { return []; }
}

const xrayType = ALLOWED_TYPES.has(req.body.xrayType) ? req.body.xrayType : 'unknown';
const symptoms = parseSymptoms(req.body.symptoms);
```
The new UI already sends only these values.

### 1.7 Upgrade multer
`multer@1.x` is deprecated with known vulnerabilities. Upgrade to 2.x (`npm install multer@2`) and re-test uploads and the file size limit.

### 1.8 Timeouts
The server allows 90 s per model call with up to 3 attempts plus backoff, so one request can run for about 5 minutes. The front end gives up after 200 s (`CONFIG.requestTimeoutMs` in `app.js`).
- Either lower the per-attempt timeout to about 60 s, or raise the client timeout. Keep the two consistent.
- Check your host's request timeout too (some free tiers cut requests at 30 to 60 s, which would break every analysis).

### 1.9 Smaller items
- `temperature: 0.6` is fine for this reasoning model if that is NVIDIA's recommendation. Confirm in their current docs, and re-run your test set if you change it.
- Confirm the current base URL, request fields (`reasoning_budget`) and model name in NVIDIA's docs. They change.
- `helmet` adds `upgrade-insecure-requests`. Production over HTTPS is fine. Plain `http://localhost` in Safari may fail to load CSS and scripts, so test locally in Chrome or Firefox, or temporarily disable that directive for local development.

---

## 2. Cost and abuse protection (blockers)

- Set a hard spending cap and billing alerts on the NVIDIA account or key.
- Rotate any API key that has appeared in a chat, screenshot or repository. Keep `.env` out of git (`.gitignore`).
- Per-IP rate limits (10 per hour) are easy to bypass. If the tool is public, add a CAPTCHA (for example Cloudflare Turnstile) or a daily global request cap.
- Decide what happens when the cap is hit: the UI shows a friendly "try again later" message for HTTP 429.

---

## 3. Legal, privacy and clinical safety (blockers)

- **Privacy policy and terms:** The page only has footer text. Publish real pages and make the "Privacy" link go to them. Cover what is sent, to whom (NVIDIA's hosted API), what is retained (nothing by this tool), and how to contact you.
- **Third-party processing:** Read NVIDIA's data retention and training terms for the hosted API. The footer currently says images are "not used for training by this tool". Only say more once you have confirmed what the provider does.
- **Indian rules:** Check the Digital Personal Data Protection (DPDP) Act obligations for health images and consent. Check whether software that interprets medical images counts as a regulated medical device in India (CDSCO). Get legal advice before a public launch.
- **Wording:** Keep every result as a preliminary observation. Do not describe it as a diagnosis, a screening result or a substitute for a dentist anywhere (page, share cards, ads).
- **Association with a clinic:** Do not imply that a clinic or dentist endorses or reviews each result unless that is true and agreed.
- **Clinical review:** Have Roshna (or another dentist) review output on 20 to 30 real images: bitewing, periapical, OPG, poor scans, non-x-rays, children's x-rays. Look especially for:
  - false reassurance (anything implying the teeth are fine),
  - normal anatomy flagged as disease,
  - wrongly placed markers,
  - urgency that is too high or too low.
- **Markers:** A general-purpose model places boxes imprecisely. If the review shows poor placement, either hide the markers or reword the "approximate" note more strongly. The UI already drops markers that are missing or invalid and still shows the finding.

---

## 4. Tune the quality checks

Thresholds in `public/app.js` (`CONFIG`) are starting guesses.
1. Open the site with `?debug` on the end of the URL. The upload card shows the raw metrics (Laplacian variance, mean brightness, contrast, colour share).
2. Test 10 or more real scans: sharp, slightly blurry, very blurry, dark, glare, colour photos of films.
3. Adjust `blur.block` / `blur.warn`, `light.*` and `resolution.*` until blocking happens only for images a dentist would reject.

---

## 5. Deployment

- [ ] HTTPS on a real domain (the host usually provides it).
- [ ] Environment variables set on the host, not in the repository:

| Variable | Notes |
|---|---|
| `NVIDIA_API_KEY` | required, secret |
| `NVIDIA_API_BASE_URL` | default `https://integrate.api.nvidia.com/v1`; confirm |
| `NVIDIA_MODEL` | default `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` |
| `PORT` | set by most hosts |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` | default 1 hour, 10 requests |
| `MAX_FILE_SIZE` | default 10 MB |

- [ ] `npm ci` (commit `package-lock.json`), `NODE_ENV=production`.
- [ ] Uptime monitoring on `/api/health`.
- [ ] Error alerts, with no image or result content in logs.
- [ ] `public/fonts/` deployed (the CSP only allows fonts from your own domain, so Google Fonts would be blocked).
- [ ] A backup plan if the NVIDIA endpoint is down: the UI shows "Something went wrong, try again" and never partial results.

---

## 6. Test before launch

Run on desktop and phone viewports against a staging deployment, then once on production with a real key.

**Happy path**
- [ ] Pick a good image, confirm quality pills, rotate left and right, choose each x-ray type, select symptoms, tick consent, analyse.
- [ ] Results show summary, markers aligned to the right spots, matching finding cards, fixed disclaimer, next steps and limitations.
- [ ] Clicking a marker highlights its card, and clicking a card highlights its marker.
- [ ] A finding with no marker shows the "couldn't mark this area" note.
- [ ] Print or save as PDF gives a clean one- or two-page report with the image and disclaimer.

**Blocked and warned images**
- [ ] Tiny image: blocked, Analyse stays disabled.
- [ ] Very blurry image: blocked.
- [ ] Very dark image: blocked.
- [ ] Colour photo: warned, but allowed to continue.
- [ ] Changing the x-ray type re-checks the resolution rule (OPG judged on the long side).

**Server responses**
- [ ] AI says "not an x-ray": the "doesn't look like a dental x-ray" screen.
- [ ] AI says image unusable: the "couldn't read this image clearly" screen with its issues.
- [ ] Zero findings: the "No clear areas flagged" card, with no reassuring wording.
- [ ] Symptoms swelling, fever or injury: the urgent banner shows whatever the x-ray says.
- [ ] Simulated 500, bad JSON, timeout, offline: friendly message, "Try again" works, cancel works.
- [ ] Rate limit reached: friendly message, no retry button.
- [ ] Model text containing `<script>` or HTML appears as plain text (the UI inserts all model text as text, never HTML).

**Browsers and devices**
- [ ] Chrome and Firefox desktop, Safari desktop.
- [ ] iPhone Safari: gallery pick, camera, HEIC photos.
- [ ] Android Chrome: gallery and camera.
- [ ] No horizontal scrolling at 360 px wide; keyboard-only use works; screen reader announces progress and errors.
- [ ] Browser console shows no CSP violations.

**Server**
- [ ] Rate limit counts per real client IP (check with two devices after enabling `trust proxy`).
- [ ] Logs contain no image data, model output or symptoms.
- [ ] A 12 MB upload and a non-image file are rejected cleanly.

---

## 7. Launch gate

Do not announce publicly until all of these are true:
- [ ] Section 1 fixes applied and re-tested.
- [ ] Spending cap and abuse protection in place.
- [ ] A dentist has reviewed real outputs, and you have adjusted prompts and wording from that review.
- [ ] Privacy policy and terms published, legal questions answered.
- [ ] Section 6 tests pass on staging and production.

After launch, spot-check a few real (consented) results each week, watch the error rate and costs, and re-run your test set after every prompt or model change.
