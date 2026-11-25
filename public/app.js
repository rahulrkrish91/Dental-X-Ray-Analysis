const CONFIG = {
  quality: {
    minShortSideBlock: 600,
    minShortSideWarn: 900,
    blurBlockThreshold: 50,
    blurWarnThreshold: 100,
    darkThreshold: 30,
    brightThreshold: 225,
    contrastThreshold: 30,
    xrayGrayscaleRatio: 0.85,
    xrayDarkRatio: 0.6
  },
  maxFileSize: 10 * 1024 * 1024,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
  analysisTimeout: 180000
};

let currentImage = null;
let currentRotation = 0;
let currentFindings = [];
let highlightedFindingId = null;
let selectedXrayType = 'unknown';
let selectedSymptoms = new Set(['none']);

// Ask panel state
let askState = {
  reportToken: null,
  questionCount: 0,
  history: [],
  threadLang: null
};

// Glossary state
let matchedTerms = new Map(); // termId -> { firstEl, count }

// DOM elements
const fileInput = document.getElementById('file-input');
const uploadArea = document.getElementById('upload-area');
const previewContainer = document.getElementById('preview-container');
const previewCanvas = document.getElementById('preview-canvas');
const previewCtx = previewCanvas.getContext('2d');
const rotateLeftBtn = document.getElementById('rotate-left');
const rotateRightBtn = document.getElementById('rotate-right');
const changeImageBtn = document.getElementById('change-image-btn');
const qualityIndicators = document.getElementById('quality-indicators');
const analyzeBtn = document.getElementById('analyze-btn');
const consentCheckbox = document.getElementById('consent');
const xrayTypeInput = document.getElementById('xray-type-input');
const xrayTypeCards = document.querySelectorAll('.xray-type-card');
const symptomPills = document.querySelectorAll('.symptom-pill');

const uploadSection = document.getElementById('upload-section');
const loadingSection = document.getElementById('loading-section');
const errorSection = document.getElementById('error-section');
const resultsSection = document.getElementById('results-section');

const uploadProgress = document.getElementById('upload-progress');
const progressText = document.getElementById('progress-text');
const errorTitle = document.getElementById('error-title');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');
const errorResetBtn = document.getElementById('error-reset-btn');

const rejectionMessage = document.getElementById('rejection-message');
const resultsContent = document.getElementById('results-content');
const resultTags = document.getElementById('result-tags');
const summaryText = document.getElementById('summary-text');
const urgentBanner = document.getElementById('urgent-banner');
const annotatedCanvas = document.getElementById('annotated-canvas');
const annotatedCtx = annotatedCanvas.getContext('2d');
const markersSvg = document.getElementById('markers-svg');
const findingsList = document.getElementById('findings-list');
const healthyList = document.getElementById('healthy-list');
const nextStepsList = document.getElementById('next-steps-list');
const limitationsList = document.getElementById('limitations-list');
const printBtn = document.getElementById('print-btn');
const analyzeAnotherBtn = document.getElementById('analyze-another-btn');

// Ask panel elements
const askPanel = document.getElementById('ask-panel');
const askChips = document.querySelector('.ask-chips');
const askThread = document.querySelector('.ask-thread');
const askRemaining = document.querySelector('.ask-remaining');
const askForm = document.getElementById('ask-form');
const askInput = document.getElementById('ask-input');
const askCounter = document.getElementById('ask-counter');
const askSubmit = document.getElementById('ask-submit');
const askDentistBanner = document.getElementById('ask-dentist-banner');

// Glossary elements
const glossarySection = document.getElementById('glossary-section');
const glossaryTerms = document.getElementById('glossary-terms');
const glossaryDialog = document.getElementById('glossary-dialog');
const glossaryDialogTitle = document.getElementById('glossary-dialog-title');
const glossaryPlain = document.getElementById('glossary-plain');
const glossaryWhat = document.getElementById('glossary-what');
const glossaryWhy = document.getElementById('glossary-why');
const glossaryUsually = document.getElementById('glossary-usually');
const glossaryArt = document.getElementById('glossary-art');
const glossaryAskBtn = document.getElementById('glossary-ask-btn');
const glossaryCloseBtn = document.querySelector('.glossary-close');

function showSection(section) {
  [uploadSection, loadingSection, errorSection, resultsSection].forEach(s => s.classList.add('hidden'));
  section.classList.remove('hidden');
}

function resetAll() {
  currentImage = null;
  currentRotation = 0;
  currentFindings = [];
  highlightedFindingId = null;
  selectedXrayType = 'unknown';
  selectedSymptoms = new Set(['none']);
  askState = { reportToken: null, questionCount: 0, history: [], threadLang: null };
  matchedTerms.clear();

  fileInput.value = '';
  qualityIndicators.innerHTML = '';
  qualityIndicators.classList.add('hidden');
  analyzeBtn.disabled = true;
  consentCheckbox.checked = false;

  document.querySelector('.xray-type-card[data-value="unknown"]').click();
  document.querySelector('.symptom-pill[data-value="none"]').click();

  previewContainer.classList.add('hidden');
  uploadArea.classList.remove('hidden');
  changeImageBtn.classList.add('hidden');
  URL.revokeObjectURL(currentImage?.src);

  // Reset ask panel
  askPanel.classList.add('hidden');
  askChips.innerHTML = '';
  askThread.innerHTML = '';
  askRemaining.textContent = '';
  askInput.value = '';
  askCounter.textContent = '0';
  askInput.disabled = false;
  askSubmit.disabled = false;
  askDentistBanner.classList.add('hidden');
  askDentistBanner.innerHTML = '';

  // Reset glossary
  glossarySection.classList.add('hidden');
  glossaryTerms.innerHTML = '';

  showSection(uploadSection);
}

function handleFile(file) {
  if (!file) return;
  if (!CONFIG.acceptedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(heic|heif)$/i)) {
    showError('Unsupported file type', 'Please upload JPEG, PNG, WebP, or HEIC image.');
    return;
  }
  if (file.size > CONFIG.maxFileSize) {
    showError('File too large', 'Maximum file size is 10 MB.');
    return;
  }

  const img = new Image();
  img.onload = () => {
    currentImage = img;
    currentRotation = 0;
    drawPreview();
    previewContainer.classList.remove('hidden');
    uploadArea.classList.add('hidden');
    changeImageBtn.classList.remove('hidden');
    runQualityChecks(img);
    updateAnalyzeButton();
    updateImageMeta();
  };
  img.onerror = () => {
    showError('Invalid image', 'Could not load the selected image. Please try another.');
  };
  img.src = URL.createObjectURL(file);
}

function drawPreview() {
  if (!currentImage) return;
  const radians = (currentRotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  const w = currentImage.width * cos + currentImage.height * sin;
  const h = currentImage.height * cos + currentImage.width * sin;
  const maxDim = Math.max(w, h);
  const scale = maxDim > 600 ? 600 / maxDim : 1;
  previewCanvas.width = Math.round(w * scale);
  previewCanvas.height = Math.round(h * scale);
  previewCtx.save();
  previewCtx.translate(previewCanvas.width / 2, previewCanvas.height / 2);
  previewCtx.rotate(radians);
  previewCtx.drawImage(currentImage, -currentImage.width / 2 * scale, -currentImage.height / 2 * scale, currentImage.width * scale, currentImage.height * scale);
  previewCtx.restore();
}

function updateImageMeta() {
  const metaEl = document.getElementById('image-meta');
  if (metaEl && currentImage) {
    metaEl.textContent = `${currentImage.width} × ${currentImage.height} px`;
  }
}

function rotate(degrees) {
  currentRotation = (currentRotation + degrees + 360) % 360;
  drawPreview();
}

function getRotatedImageData() {
  if (!currentImage) return null;
  const radians = (currentRotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  const w = currentImage.width * cos + currentImage.height * sin;
  const h = currentImage.height * cos + currentImage.width * sin;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.translate(w / 2, h / 2);
  ctx.rotate(radians);
  ctx.drawImage(currentImage, -currentImage.width / 2, -currentImage.height / 2);
  return canvas.toDataURL('image/jpeg', 0.9);
}

function getRotatedBlob() {
  return new Promise(resolve => {
    if (!currentImage) { resolve(null); return; }
    const radians = (currentRotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));
    const w = currentImage.width * cos + currentImage.height * sin;
    const h = currentImage.height * cos + currentImage.width * sin;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.translate(w / 2, h / 2);
    ctx.rotate(radians);
    ctx.drawImage(currentImage, -currentImage.width / 2, -currentImage.height / 2);
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.9);
  });
}

async function runQualityChecks(img) {
  qualityIndicators.innerHTML = '';
  const canvas = document.createElement('canvas');
  const maxCheckDim = 400;
  const scale = Math.min(maxCheckDim / img.width, maxCheckDim / img.height, 1);
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let grayscaleSum = 0;
  let darkPixels = 0;
  let brightPixels = 0;
  let minVal = 255, maxVal = 0;
  const grayValues = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    grayValues.push(gray);
    grayscaleSum += gray;
    if (gray < CONFIG.quality.darkThreshold) darkPixels++;
    if (gray > CONFIG.quality.brightThreshold) brightPixels++;
    minVal = Math.min(minVal, gray);
    maxVal = Math.max(maxVal, gray);
  }

  const avgGray = grayscaleSum / grayValues.length;
  const contrast = maxVal - minVal;
  const totalPixels = grayValues.length;
  const darkRatio = darkPixels / totalPixels;
  const brightRatio = brightPixels / totalPixels;

  let isGrayscale = true;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    if (Math.abs(r - g) > 15 || Math.abs(g - b) > 15 || Math.abs(r - b) > 15) {
      isGrayscale = false; break;
    }
  }

  const shortSide = Math.min(img.width, img.height);
  const indicators = [];

  if (shortSide >= CONFIG.quality.minShortSideWarn) {
    indicators.push({ type: 'good', title: 'Resolution good', icon: 'check' });
  } else if (shortSide >= CONFIG.quality.minShortSideBlock) {
    indicators.push({ type: 'warn', title: `Low resolution: ${shortSide}px`, icon: 'alert' });
  } else {
    indicators.push({ type: 'warn', title: `Resolution too low: ${shortSide}px`, icon: 'alert' });
  }

  const blurScore = calculateBlurScore(grayValues, canvas.width, canvas.height);
  if (blurScore >= CONFIG.quality.blurWarnThreshold) {
    indicators.push({ type: 'good', title: 'Sharpness good', icon: 'check' });
  } else if (blurScore >= CONFIG.quality.blurBlockThreshold) {
    indicators.push({ type: 'warn', title: `Slightly blurry (${blurScore.toFixed(1)})`, icon: 'alert' });
  } else {
    indicators.push({ type: 'warn', title: `Too blurry (${blurScore.toFixed(1)})`, icon: 'alert' });
  }

  if (avgGray >= CONFIG.quality.darkThreshold && avgGray <= CONFIG.quality.brightThreshold) {
    indicators.push({ type: 'good', title: 'Exposure good', icon: 'check' });
  } else if (avgGray < CONFIG.quality.darkThreshold) {
    indicators.push({ type: 'warn', title: 'Slightly dark', icon: 'alert' });
  } else {
    indicators.push({ type: 'warn', title: 'Slightly bright', icon: 'alert' });
  }

  if (contrast >= CONFIG.quality.contrastThreshold) {
    indicators.push({ type: 'good', title: 'Contrast good', icon: 'check' });
  } else {
    indicators.push({ type: 'warn', title: 'Low contrast', icon: 'alert' });
  }

  indicators.forEach(item => {
    const pill = document.createElement('div');
    pill.className = `quality-pill ${item.type}`;
    const iconSvg = item.icon === 'check'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"></path></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4l9 16H3z"></path><path d="M12 10v4M12 17v.01"></path></svg>';
    pill.innerHTML = `${iconSvg}${item.title}`;
    qualityIndicators.appendChild(pill);
  });

  if (indicators.length > 0) {
    qualityIndicators.classList.remove('hidden');
  } else {
    qualityIndicators.classList.add('hidden');
  }

  return { indicators, blurScore, avgGray, contrast, isGrayscale, darkRatio };
}

function calculateBlurScore(grayValues, width, height) {
  const kernel = [[0, 1, 0], [1, -4, 1], [0, 1, 0]];
  let sum = 0;
  let count = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let val = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = (y + ky) * width + (x + kx);
          val += grayValues[idx] * kernel[ky + 1][kx + 1];
        }
      }
      sum += val * val;
      count++;
    }
  }
  return count > 0 ? sum / count : 0;
}

function updateAnalyzeButton() {
  const hasImage = currentImage !== null;
  const hasConsent = consentCheckbox.checked;
  const hasBlockingIssue = qualityIndicators.querySelector('.quality-pill.warn[title*="too low"], .quality-pill.warn[title*="Too blurry"]');
  analyzeBtn.disabled = !(hasImage && hasConsent && !hasBlockingIssue);
}

function selectXrayType(value) {
  selectedXrayType = value;
  xrayTypeInput.value = value;
  xrayTypeCards.forEach(card => {
    const isSelected = card.dataset.value === value;
    card.classList.toggle('selected', isSelected);
    card.setAttribute('aria-checked', isSelected);
    card.tabIndex = isSelected ? 0 : -1;
  });
}

function toggleSymptom(value) {
  if (value === 'none') {
    if (selectedSymptoms.has('none')) return;
    selectedSymptoms.clear();
    selectedSymptoms.add('none');
  } else {
    selectedSymptoms.delete('none');
    if (selectedSymptoms.has(value)) {
      selectedSymptoms.delete(value);
      if (selectedSymptoms.size === 0) selectedSymptoms.add('none');
    } else {
      selectedSymptoms.add(value);
    }
  }

  symptomPills.forEach(pill => {
    const isSelected = selectedSymptoms.has(pill.dataset.value);
    pill.classList.toggle('selected', isSelected);
    pill.setAttribute('aria-checked', isSelected);
    if (pill.dataset.value === 'none') {
      pill.tabIndex = isSelected ? 0 : -1;
    } else if (isSelected) {
      pill.tabIndex = 0;
    }
  });
}

function getSelectedSymptoms() {
  const symptoms = [...selectedSymptoms].filter(s => s !== 'none');
  return symptoms;
}

async function analyzeImage() {
  if (!currentImage) return;
  showSection(loadingSection);
  uploadProgress.classList.remove('hidden');
  progressText.classList.remove('hidden');
  progressText.textContent = 'Uploading...';

  const blob = await getRotatedBlob();
  if (!blob) { showError('Processing error', 'Could not prepare image for upload.'); return; }

  const formData = new FormData();
  formData.append('image', blob, 'xray.jpg');
  formData.append('xrayType', selectedXrayType);
  formData.append('symptoms', JSON.stringify(getSelectedSymptoms()));
  formData.append('lang', I18N.currentLang);

  let analysisProgressInterval = null;
  let analysisProgress = 0;

  function startAnalysisProgress() {
    uploadProgress.classList.add('hidden');
    progressText.textContent = 'Analysing... 0%';
    analysisProgress = 0;
    analysisProgressInterval = setInterval(() => {
      analysisProgress += Math.random() * 8 + 2;
      if (analysisProgress > 95) analysisProgress = 95;
      progressText.textContent = `Analysing... ${Math.round(analysisProgress)}%`;
    }, 1500);
  }

  function stopAnalysisProgress() {
    if (analysisProgressInterval) {
      clearInterval(analysisProgressInterval);
      analysisProgressInterval = null;
    }
    progressText.textContent = 'Analysing... 100%';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.analysisTimeout);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      stopAnalysisProgress();
      const err = await response.json().catch(() => ({ error: 'Analysis failed' }));
      throw new Error(err.error || `Server error: ${response.status}`);
    }

    // Upload complete, start analysis progress simulation
    startAnalysisProgress();

    const result = await response.json();

    stopAnalysisProgress();
    uploadProgress.classList.add('hidden');
    progressText.textContent = 'Analysing your X-ray…';

    const report = result.report;
    window.logFirebaseEvent?.('xray_analyzed', {
      xray_type: selectedXrayType,
      findings_count: report?.findings?.length || 0,
      has_urgent: report?.findings?.some(f => f.urgency === 'urgent') || false,
      is_dental_xray: report?.is_dental_xray,
      image_quality: report?.image_quality?.rating
    });

    displayResults(result);

  } catch (error) {
    clearTimeout(timeoutId);
    stopAnalysisProgress();
    window.logFirebaseEvent?.('analysis_error', {
      error: error.message,
      xray_type: selectedXrayType
    });
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      showError('Request timed out', 'Analysis took too long. Please try again with a smaller image or check your connection.');
    } else {
      showError('Analysis failed', error.message);
    }
  }
}

function displayResults(result) {
  showSection(resultsSection);

  // API returns AnalysisResponse with nested report field
  const report = result.report;
  if (!report) {
    resultsContent.classList.add('hidden');
    rejectionMessage.classList.remove('hidden');
    let html = `<h2>${I18N.t('results.analysis_failed')}</h2>`;
    html += `<p>${result.error?.message || I18N.t('results.unknown_error')}</p>`;
    html += `<p>${I18N.t('results.retry')}</p>`;
    rejectionMessage.innerHTML = html;
    askPanel.classList.add('hidden');
    glossarySection.classList.add('hidden');
    return;
  }

  if (!report.is_dental_xray || !report.image_quality.usable) {
    resultsContent.classList.add('hidden');
    rejectionMessage.classList.remove('hidden');
    let html = `<h2>${!report.is_dental_xray ? I18N.t('results.not_dental') : I18N.t('results.poor_quality')}</h2>`;
    html += `<p>${report.rejection_reason || report.image_quality.issues.join('. ')}</p>`;
    html += `<p>${I18N.t('results.retry')}</p>`;
    rejectionMessage.innerHTML = html;
    askPanel.classList.add('hidden');
    glossarySection.classList.add('hidden');
    return;
  }

  rejectionMessage.classList.add('hidden');
  resultsContent.classList.remove('hidden');

  // Result tags
  resultTags.innerHTML = '';
  const tags = [
    { text: `${report.xray_type.charAt(0).toUpperCase() + report.xray_type.slice(1)}, detected by AI`, type: 'info' },
    { text: `Image quality: ${report.image_quality.rating}`, type: 'info' },
    { text: `${report.findings.length} area${report.findings.length !== 1 ? 's' : ''} to ask about`, type: 'info' }
  ];
  tags.forEach(tag => {
    const el = document.createElement('span');
    el.className = 'result-tag';
    el.textContent = tag.text;
    resultTags.appendChild(el);
  });

  summaryText.textContent = report.summary;
  if (report.findings.some(f => f.urgency === 'urgent')) {
    urgentBanner.classList.remove('hidden');
  } else {
    urgentBanner.classList.add('hidden');
  }

  drawAnnotatedImage(report);
  renderFindingsGrid(report);
  renderDetailList(healthyList, report.healthy_observations);
  renderDetailList(nextStepsList, report.recommended_next_steps);
  renderDetailList(limitationsList, report.limitations);

  // Initialize ask panel (Part 1)
  initAskPanel(result);

  // Initialize glossary (Part 2)
  initGlossary(report);
}

function drawAnnotatedImage(result) {
  if (!currentImage) return;
  const radians = (currentRotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  const w = currentImage.width * cos + currentImage.height * sin;
  const h = currentImage.height * cos + currentImage.width * sin;
  const maxDim = Math.max(w, h);
  const scale = maxDim > 700 ? 700 / maxDim : 1;
  annotatedCanvas.width = Math.round(w * scale);
  annotatedCanvas.height = Math.round(h * scale);
  annotatedCtx.save();
  annotatedCtx.translate(annotatedCanvas.width / 2, annotatedCanvas.height / 2);
  annotatedCtx.rotate(radians);
  annotatedCtx.drawImage(currentImage, -currentImage.width / 2 * scale, -currentImage.height / 2 * scale, currentImage.width * scale, currentImage.height * scale);
  annotatedCtx.restore();

  markersSvg.innerHTML = '';
  markersSvg.setAttribute('viewBox', `0 0 ${annotatedCanvas.width} ${annotatedCanvas.height}`);
  markersSvg.style.width = `${annotatedCanvas.width}px`;
  markersSvg.style.height = `${annotatedCanvas.height}px`;

  result.findings.forEach((finding, idx) => {
    if (!finding.bbox) return;
    const cx = finding.bbox.x * annotatedCanvas.width + finding.bbox.w * annotatedCanvas.width / 2;
    const cy = finding.bbox.y * annotatedCanvas.height + finding.bbox.h * annotatedCanvas.height / 2;
    const r = Math.max(14, Math.min(finding.bbox.w, finding.bbox.h) * Math.min(annotatedCanvas.width, annotatedCanvas.height) / 3);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('marker');
    g.dataset.findingId = finding.id;
    g.setAttribute('role', 'button');
    g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', `Finding ${idx + 1}: ${finding.label}`);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.classList.add('marker-circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    g.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.classList.add('marker-number');
    text.setAttribute('x', cx);
    text.setAttribute('y', cy + 3);
    text.textContent = idx + 1;
    g.appendChild(text);

    g.addEventListener('click', () => highlightFinding(finding.id));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); highlightFinding(finding.id); } });
    markersSvg.appendChild(g);
  });
}

function renderFindingsGrid(result) {
  currentFindings = result.findings;
  findingsList.innerHTML = '';
  findingsList.className = 'findings-grid';

  if (result.findings.length === 0) {
    findingsList.innerHTML = `<p class="no-findings">${I18N.t('results.no_findings')}</p>`;
    return;
  }

  result.findings.forEach((finding, idx) => {
    const card = document.createElement('div');
    card.className = 'finding-card';
    card.dataset.findingId = finding.id;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Finding ${idx + 1}: ${finding.label}`);

    const confidenceClass = `badge-confidence-${finding.confidence}`;
    const urgencyClass = `badge-urgency-${finding.urgency}`;
    const urgencyLabel = finding.urgency.charAt(0).toUpperCase() + finding.urgency.slice(1);
    const confidenceLabel = finding.confidence.charAt(0).toUpperCase() + finding.confidence.slice(1);

    // Add "Ask about this" button
    const askBtnHtml = `
      <button type="button" class="btn-icon ask-about-finding" data-finding-id="${finding.id}" data-finding-index="${idx}" data-finding-label="${escapeHtml(finding.label)}" aria-label="${I18N.t('ask.ask_about')}: ${escapeHtml(finding.label)}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>
      </button>
    `;

    card.innerHTML = `
      <div class="finding-header">
        <div class="finding-number">${idx + 1}</div>
        <div class="finding-title">
          <h3>${finding.label}</h3>
        </div>
        <div class="finding-badges">
          <span class="badge ${confidenceClass}">${confidenceLabel} confidence</span>
          <span class="badge ${urgencyClass}">${urgencyLabel} urgency</span>
        </div>
      </div>
      <div class="finding-tooth">${finding.tooth_fdi ? `<strong>Tooth ${finding.tooth_fdi}</strong> — ` : ''}${finding.location_description}</div>
      <div class="finding-explanation">${finding.explanation_plain}</div>
      <div class="finding-actions">${askBtnHtml}</div>
    `;

    card.addEventListener('click', (e) => {
      if (!e.target.closest('.ask-about-finding')) {
        highlightFinding(finding.id);
      }
    });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); highlightFinding(finding.id); } });
    findingsList.appendChild(card);
  });

  // Attach event listeners to "Ask about this" buttons
  document.querySelectorAll('.ask-about-finding').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const findingId = btn.dataset.findingId;
      const findingIndex = parseInt(btn.dataset.findingIndex, 10);
      const findingLabel = btn.dataset.findingLabel;
      prefillAskInput(findingIndex, findingLabel);
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function highlightFinding(findingId) {
  if (highlightedFindingId === findingId) {
    highlightedFindingId = null;
  } else {
    highlightedFindingId = findingId;
  }
  document.querySelectorAll('.finding-card').forEach(card => {
    card.classList.toggle('highlighted', card.dataset.findingId === highlightedFindingId);
  });
  document.querySelectorAll('.marker').forEach(marker => {
    marker.classList.toggle('focused', marker.dataset.findingId === highlightedFindingId);
  });
}

function renderDetailList(listEl, items) {
  listEl.innerHTML = '';
  if (!items || items.length === 0) {
    listEl.innerHTML = `<li>${I18N.t('results.none')}</li>`;
    return;
  }
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    listEl.appendChild(li);
  });
}

function showError(title, message) {
  showSection(errorSection);
  errorTitle.textContent = title;
  errorMessage.textContent = message;
}

async function handlePrint() {
  window.print();
}

// ========== PART 1: Follow-up Questions ==========

function initAskPanel(result) {
  // Store report token (from nested report field)
  const report = result.report;
  if (report?.report_token) {
    askState.reportToken = report.report_token;
    askState.questionCount = 0;
    askState.history = [];
    askState.threadLang = I18N.currentLang;
    askPanel.classList.remove('hidden');
    renderAskChips();
    renderAskRemaining();
  } else {
    askPanel.classList.add('hidden');
  }
}

function renderAskChips() {
  const chips = [
    { key: 'ask.chip.1' },
    { key: 'ask.chip.2' },
    { key: 'ask.chip.3' },
    { key: 'ask.chip.4' }
  ];
  askChips.innerHTML = '';
  chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ask-chip';
    btn.textContent = I18N.t(chip.key);
    btn.addEventListener('click', () => {
      askInput.value = I18N.t(chip.key);
      askInput.dispatchEvent(new Event('input'));
      askForm.dispatchEvent(new Event('submit'));
    });
    askChips.appendChild(btn);
  });
}

function renderAskRemaining() {
  const remaining = 5 - askState.questionCount;
  if (remaining > 0) {
    askRemaining.textContent = I18N.t('ask.remaining', { count: remaining, plural: remaining !== 1 ? 's' : '' });
  } else {
    askRemaining.textContent = I18N.t('ask.limit_reached');
    askInput.disabled = true;
    askSubmit.disabled = true;
    askInput.placeholder = I18N.t('ask.limit_reached');
  }
}

function prefillAskInput(findingIndex, findingLabel) {
  const text = I18N.t('ask.chip.1').replace('this', `finding ${findingIndex + 1}: ${findingLabel}`);
  // Simpler: "Tell me more about finding {n}: {label}"
  const prefill = `Tell me more about finding ${findingIndex + 1}: ${findingLabel}`;
  askInput.value = prefill;
  askInput.dispatchEvent(new Event('input'));
  askInput.focus();
}

function addAskMessage(role, text) {
  const bubble = document.createElement('div');
  bubble.className = `ask-bubble ask-bubble-${role}`;
  bubble.textContent = text;
  askThread.appendChild(bubble);
  askThread.scrollTop = askThread.scrollHeight;
  return bubble;
}

function showAskTyping() {
  const typing = document.createElement('div');
  typing.className = 'ask-bubble ask-bubble-assistant ask-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  askThread.appendChild(typing);
  askThread.scrollTop = askThread.scrollHeight;
  return typing;
}

function removeAskTyping(typingEl) {
  typingEl.remove();
}

function showAskError(message) {
  const error = document.createElement('div');
  error.className = 'ask-bubble ask-bubble-error';
  error.textContent = message;
  askThread.appendChild(error);
  askThread.scrollTop = askThread.scrollHeight;
}

async function submitAskQuestion(question) {
  if (!askState.reportToken) return;
  if (askState.questionCount >= 5) return;

  // Disable form while waiting
  askInput.disabled = true;
  askSubmit.disabled = true;

  // Add user message
  addAskMessage('user', question);
  askInput.value = '';
  askCounter.textContent = '0';

  // Show typing indicator
  const typing = showAskTyping();

  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: askState.reportToken,
        question: question,
        language: I18N.currentLang,
        history: askState.history
      })
    });

    removeAskTyping(typing);

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: I18N.t('ask.errors.generic') }));
      throw new Error(err.error);
    }

    const data = await response.json();

    // Add assistant message
    addAskMessage('assistant', data.answer);

    // Update state
    askState.reportToken = data.report_token;
    askState.questionCount = 5 - data.remaining;
    askState.history.push({ q: question, a: data.answer });
    if (askState.history.length > 3) askState.history.shift();
    askState.threadLang = I18N.currentLang;

    // Show remaining
    renderAskRemaining();

    // Show dentist banner if needed
    if (data.suggest_dentist || data.urgent) {
      showDentistBanner(data.urgent, data.answer);
    }

    // Show language note if thread language differs from UI
    if (askState.threadLang !== I18N.currentLang) {
      showLanguageNote();
    }

  } catch (error) {
    removeAskTyping(typing);
    const msg = mapAskError(error.message);
    showAskError(msg);
  } finally {
    if (askState.questionCount < 5) {
      askInput.disabled = false;
      askSubmit.disabled = false;
    }
    askInput.focus();
  }
}

function mapAskError(errorMsg) {
  const msg = errorMsg.toLowerCase();
  if (msg.includes('network') || msg.includes('fetch')) return I18N.t('ask.errors.network');
  if (msg.includes('timeout') || msg.includes('timed out')) return I18N.t('ask.errors.timeout');
  if (msg.includes('429') || msg.includes('too many')) return I18N.t('ask.errors.too_many');
  if (msg.includes('invalid') || msg.includes('expired') || msg.includes('session')) return I18N.t('ask.errors.invalid');
  if (msg.includes('limit') || msg.includes('reached')) return I18N.t('ask.errors.limit');
  return I18N.t('ask.errors.generic');
}

function showDentistBanner(urgent, answer) {
  askDentistBanner.classList.remove('hidden');
  let html = '';
  if (urgent) {
    html += `<p class="ask-urgent">${I18N.t('ask.dentist_urgent')}</p>`;
  } else {
    html += `<p>${I18N.t('ask.dentist_note')}</p>`;
  }
  // Add WhatsApp link if clinic number available
  fetch('/api/config').then(r => r.json()).then(cfg => {
    if (cfg.clinicWhatsapp) {
      const text = encodeURIComponent('Hello, I have a question about my dental x-ray analysis.');
      html += `<a href="https://wa.me/${cfg.clinicWhatsapp}?text=${text}" target="_blank" rel="noopener" class="btn btn-secondary ask-whatsapp">${I18N.t('ask.whatsapp')}</a>`;
      askDentistBanner.innerHTML = html;
    }
  }).catch(() => {
    askDentistBanner.innerHTML = html;
  });
}

function showLanguageNote() {
  const existing = askThread.querySelector('.ask-lang-note');
  if (existing) existing.remove();
  const note = document.createElement('div');
  note.className = 'ask-bubble ask-lang-note';
  note.textContent = I18N.t('ask.lang_note', { lang: askState.threadLang === 'ml' ? 'Malayalam' : 'English' });
  askThread.appendChild(note);
  askThread.scrollTop = askThread.scrollHeight;
}

// ========== PART 2: Glossary ==========

function initGlossary(result) {
  matchedTerms.clear();
  glossaryTerms.innerHTML = '';

  // Collect all report text
  const texts = [
    { text: result.summary, context: 'summary' },
    ...result.healthy_observations.map((t, i) => ({ text: t, context: `healthy_${i}` })),
    ...result.findings.map((f, i) => ({ text: f.explanation_plain, context: `finding_${f.id}` })),
    ...result.recommended_next_steps.map((t, i) => ({ text: t, context: `next_${i}` })),
    ...result.limitations.map((t, i) => ({ text: t, context: `limit_${i}` }))
  ];

  // Find matching terms in each text
  const termMatches = new Map(); // termId -> { term, contexts: [] }

  for (const { text, context } of texts) {
    if (!text) continue;
    for (const entry of GLOSSARY) {
      const aliases = entry[I18N.currentLang]?.aliases || entry.en.aliases;
      for (const alias of aliases) {
        const regex = I18N.currentLang === 'ml'
          ? new RegExp(escapeRegex(alias), 'gi') // prefix match for Malayalam
          : new RegExp(`\\b${escapeRegex(alias)}\\b`, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
          if (!termMatches.has(entry.id)) {
            termMatches.set(entry.id, { term: entry, contexts: [] });
          }
          termMatches.get(entry.id).contexts.push({ text, context, match: match[0], index: match.index });
          // For first occurrence per finding card, we'll link it later
        }
      }
    }
  }

  // Build glossary terms list (unique terms)
  const sortedTerms = Array.from(termMatches.values())
    .sort((a, b) => a.term.en.term.localeCompare(b.term.en.term));

  sortedTerms.forEach(({ term }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'glossary-term-btn';
    btn.dataset.termId = term.id;
    btn.textContent = term[I18N.currentLang]?.term || term.en.term;
    btn.addEventListener('click', () => openGlossaryDialog(term));
    glossaryTerms.appendChild(btn);
  });

  if (sortedTerms.length > 0) {
    glossarySection.classList.remove('hidden');
  }

  // Now link first occurrence per finding card
  linkGlossaryTerms(result);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function linkGlossaryTerms(result) {
  // Link terms in finding explanations (first occurrence per card)
  result.findings.forEach(finding => {
    const card = document.querySelector(`.finding-card[data-finding-id="${finding.id}"]`);
    if (!card) return;
    const explanationEl = card.querySelector('.finding-explanation');
    if (!explanationEl) return;
    linkTextInElement(explanationEl, finding.id, true); // firstOnly = true
  });

  // Link terms in summary, healthy observations, next steps, limitations (all occurrences)
  const summaryEl = document.getElementById('summary-text');
  if (summaryEl) linkTextInElement(summaryEl, 'summary', false);

  document.querySelectorAll('#healthy-list li, #next-steps-list li, #limitations-list li').forEach(li => {
    linkTextInElement(li, li.textContent.slice(0, 20), false);
  });
}

function linkTextInElement(el, contextKey, firstOnly) {
  const text = el.textContent;
  if (!text.trim()) return;

  // Find all matches across all glossary terms
  const matches = [];
  for (const entry of GLOSSARY) {
    const aliases = entry[I18N.currentLang]?.aliases || entry.en.aliases;
    for (const alias of aliases) {
      const regex = I18N.currentLang === 'ml'
        ? new RegExp(escapeRegex(alias), 'gi')
        : new RegExp(`\\b${escapeRegex(alias)}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          termId: entry.id,
          term: entry,
          alias: alias,
          match: match[0],
          index: match.index,
          length: match[0].length
        });
      }
    }
  }

  // Sort by index, then by length (longest first)
  matches.sort((a, b) => a.index - b.index || b.length - a.length);

  // Filter overlapping matches (keep longest at each position)
  const filtered = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.index >= lastEnd) {
      filtered.push(m);
      lastEnd = m.index + m.length;
    }
  }

  if (filtered.length === 0) return;

  // If firstOnly, keep only first match per term per context
  if (firstOnly) {
    const seenTerms = new Set();
    const firstOnlyFiltered = [];
    for (const m of filtered) {
      const key = `${contextKey}:${m.termId}`;
      if (!seenTerms.has(key)) {
        seenTerms.add(key);
        firstOnlyFiltered.push(m);
      }
    }
    filtered.length = 0;
    filtered.push(...firstOnlyFiltered);
  }

  // Rebuild element with wrapped terms
  let lastPos = 0;
  const frag = document.createDocumentFragment();
  for (const m of filtered) {
    if (m.index > lastPos) {
      frag.appendChild(document.createTextNode(text.slice(lastPos, m.index)));
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'glossary-term-inline';
    btn.dataset.termId = m.termId;
    btn.textContent = m.match;
    btn.setAttribute('aria-label', `${I18N.t('glossary.open')}: ${m.term[I18N.currentLang]?.term || m.term.en.term}`);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openGlossaryDialog(m.term);
    });
    frag.appendChild(btn);
    lastPos = m.index + m.length;
  }
  if (lastPos < text.length) {
    frag.appendChild(document.createTextNode(text.slice(lastPos)));
  }

  el.textContent = '';
  el.appendChild(frag);
}

function openGlossaryDialog(term) {
  const loc = term[I18N.currentLang] || term.en;
  glossaryDialogTitle.textContent = loc.term;
  glossaryPlain.textContent = I18N.t('glossary.plain', { plain: loc.plain });
  glossaryWhat.textContent = loc.what;
  glossaryWhy.textContent = loc.why;
  glossaryUsually.textContent = loc.usually;

  // Art
  if (term.art && GLOSSARY_ART[term.art]) {
    glossaryArt.innerHTML = GLOSSARY_ART[term.art];
    glossaryArt.classList.remove('hidden');
  } else {
    glossaryArt.innerHTML = '';
    glossaryArt.classList.add('hidden');
  }

  // Ask button
  glossaryAskBtn.dataset.termId = term.id;
  glossaryAskBtn.dataset.termLabel = loc.term;
  glossaryAskBtn.classList.toggle('hidden', !askState.reportToken);

  glossaryDialog.showModal();
  // Focus close button for accessibility
  glossaryCloseBtn.focus();
}

function closeGlossaryDialog() {
  glossaryDialog.close();
}

glossaryCloseBtn?.addEventListener('click', closeGlossaryDialog);

glossaryDialog?.addEventListener('click', (e) => {
  if (e.target === glossaryDialog) closeGlossaryDialog();
});

glossaryDialog?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGlossaryDialog();
});

// Glossary ask button
glossaryAskBtn?.addEventListener('click', () => {
  const termLabel = glossaryAskBtn.dataset.termLabel;
  const question = `What does ${termLabel} mean for me?`;
  closeGlossaryDialog();
  prefillAskInput(0, termLabel); // Use finding index 0 as generic
  askInput.value = question;
  askInput.dispatchEvent(new Event('input'));
  askForm.dispatchEvent(new Event('submit'));
});

// Language change handling for glossary
window.addEventListener('langchange', (e) => {
  // Re-render glossary terms list
  if (matchedTerms.size > 0) {
    // We'd need the original result to re-init; for simplicity, just update visible text
    const openTermId = glossaryDialogTitle.dataset.termId;
    if (openTermId) {
      const term = GLOSSARY.find(t => t.id === openTermId);
      if (term) openGlossaryDialog(term);
    }
  }
  // Update ask panel language note
  if (askState.threadLang && askState.threadLang !== I18N.currentLang) {
    showLanguageNote();
  }
});

// Ask form handler
askForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = askInput.value.trim();
  if (!question) return;
  if (question.length > 300) return;
  await submitAskQuestion(question);
});

// Ask input counter
askInput?.addEventListener('input', () => {
  askCounter.textContent = askInput.value.length;
});

// Enter to submit, Shift+Enter for newline
askInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    askForm.dispatchEvent(new Event('submit'));
  }
});

// Event Listeners
const uploadBtn = document.getElementById('upload-btn');
uploadBtn?.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea.addEventListener('dragleave', e => { e.preventDefault(); uploadArea.classList.remove('drag-over'); });
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

rotateLeftBtn.addEventListener('click', () => rotate(-90));
rotateRightBtn.addEventListener('click', () => rotate(90));

function handleChangeImage() {
  previewContainer.classList.add('hidden');
  uploadArea.classList.remove('hidden');
  changeImageBtn.classList.add('hidden');
  URL.revokeObjectURL(currentImage?.src);
  currentImage = null;
  currentRotation = 0;
  updateAnalyzeButton();
}

changeImageBtn.addEventListener('click', handleChangeImage);

consentCheckbox.addEventListener('change', () => {
  updateAnalyzeButton();
  if (consentCheckbox.checked) {
    window.logFirebaseEvent?.('consent_given');
  }
});

xrayTypeCards.forEach(card => {
  card.addEventListener('click', () => selectXrayType(card.dataset.value));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectXrayType(card.dataset.value);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const cards = Array.from(xrayTypeCards);
      const idx = cards.indexOf(card);
      const next = cards[(idx + 1) % cards.length];
      next.focus();
      next.click();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const cards = Array.from(xrayTypeCards);
      const idx = cards.indexOf(card);
      const prev = cards[(idx - 1 + cards.length) % cards.length];
      prev.focus();
      prev.click();
    }
  });
});

symptomPills.forEach(pill => {
  pill.addEventListener('click', () => toggleSymptom(pill.dataset.value));
  pill.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSymptom(pill.dataset.value);
    }
  });
});

analyzeBtn.addEventListener('click', analyzeImage);
retryBtn.addEventListener('click', analyzeImage);
errorResetBtn.addEventListener('click', resetAll);
printBtn.addEventListener('click', handlePrint);
analyzeAnotherBtn.addEventListener('click', resetAll);

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initial);
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// Initialize I18N
document.addEventListener('DOMContentLoaded', () => {
  I18N.init();
});