import { readFileSync } from 'fs';

const imageBuffer = readFileSync('test/sample-xray.jpg');
const formData = new FormData();
const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
formData.append('image', blob, 'test-xray.jpg');
formData.append('xrayType', 'unknown');
formData.append('symptoms', JSON.stringify(['pain']));
formData.append('lang', 'en');

fetch('http://localhost:3000/api/analyze', { method: 'POST', body: formData })
  .then(r => r.json())
  .then(result => {
    console.log('report_token present:', !!result.report_token);
    if (result.report_token) {
      console.log('token length:', result.report_token.length);
      return fetch('http://localhost:3000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: result.report_token,
          question: 'What does this mean in simple words?',
          language: 'en',
          history: []
        })
      }).then(r => r.json());
    }
  })
  .then(data => {
    if (data) console.log('Ask response:', JSON.stringify(data, null, 2));
  })
  .catch(e => console.error('Error:', e.message));