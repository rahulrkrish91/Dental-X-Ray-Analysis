import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testAnalyze() {
  const imagePath = process.argv[2] || join(__dirname, 'sample-xray.jpg');
  let imageBuffer;

  try {
    imageBuffer = readFileSync(imagePath);
    console.log(`Loaded test image: ${imagePath} (${imageBuffer.length} bytes)`);
  } catch {
    console.error('Could not read test image. Provide path as argument: node test/test-analyze.js /path/to/xray.jpg');
    console.error('Or place a sample-xray.jpg in the test/ directory.');
    process.exit(1);
  }

  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
  formData.append('image', blob, 'test-xray.jpg');
  formData.append('xrayType', 'unknown');
  formData.append('symptoms', JSON.stringify(['pain']));

  console.log('Sending analysis request...');
  const start = Date.now();

  try {
    const port = process.env.PORT || 3000;
const response = await fetch(`http://localhost:${port}/api/analyze`, {
      method: 'POST',
      body: formData
    });

    const elapsed = Date.now() - start;
    console.log(`Response received in ${elapsed}ms (status: ${response.status})`);

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Error:', err.error);
      process.exit(1);
    }

    const result = await response.json();
    console.log('\n=== ANALYSIS RESULT ===');
    console.log(JSON.stringify(result, null, 2));

    if (result.is_dental_xray) {
      console.log('\n=== SUMMARY ===');
      console.log(result.summary);
      console.log(`\nX-ray type: ${result.xray_type}`);
      console.log(`Quality: ${result.image_quality.rating} (usable: ${result.image_quality.usable})`);
      console.log(`Findings: ${result.findings.length}`);
      result.findings.forEach((f, i) => {
        console.log(`  ${i+1}. ${f.label} (${f.confidence} confidence, ${f.urgency} urgency) - ${f.tooth_fdi || f.location_description}`);
      });
    } else {
      console.log('\nRejection reason:', result.rejection_reason);
    }

  } catch (error) {
    console.error('Request failed:', error.message);
    process.exit(1);
  }
}

import { dirname } from 'path';
testAnalyze();