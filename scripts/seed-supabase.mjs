// scripts/seed-supabase.mjs
import https from 'https';

const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'qtsmotzgazgpsboljhjy';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

if (!SUPABASE_ACCESS_TOKEN) {
  console.log('Please provide SUPABASE_ACCESS_TOKEN environment variable.');
}

async function runQuery(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql });
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${SUPABASE_PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}
