/**
 * Prince Yadav Portfolio — Local Development Server
 * Handles static asset serving and Resend API transactional email dispatch.
 *
 * NOTE: This server is for local development only.
 * In production, the contact form is handled by a Cloudflare Worker.
 * Never commit secrets — set RESEND_API_KEY via environment variable.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_TO = 'princeyadav841@gmail.com';
const EMAIL_FROM = 'Prince Yadav Portfolio <info@protonvix.com>';

// ── Simple in-memory rate limiter (dev server only) ─────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://princeyadav7.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000'
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildEmailHtml(name, email, requirement, timestamp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Project Inquiry</title>
    </head>
    <body style="margin:0;padding:0;background-color:#0B0E14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0E14;padding:40px 16px;">
        <tr>
          <td align="center">
            
            <!-- Container Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.35);border:1px solid #1E293B;">
              
              <!-- Obsidian Header -->
              <tr>
                <td style="background:#121316;padding:32px 36px;border-bottom:3px solid #9E7649;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <div style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#9E7649;font-weight:700;margin-bottom:8px;">
                          PRINCE YADAV &bull; SYSTEMS ARCHITECT
                        </div>
                        <h1 style="margin:0;font-size:22px;color:#FFFFFF;font-weight:600;letter-spacing:-0.02em;line-height:1.25;">
                          New Client Inquiry Received
                        </h1>
                      </td>
                      <td align="right" valign="middle">
                        <span style="display:inline-block;background:rgba(158,118,73,0.15);color:#D4B38C;font-family:'Courier New',Courier,monospace;font-size:10px;padding:4px 10px;border-radius:4px;border:1px solid rgba(158,118,73,0.3);letter-spacing:0.06em;font-weight:600;">
                          PORTFOLIO LEAD
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Content Area -->
              <tr>
                <td style="padding:36px 36px 28px;background:#FFFFFF;">
                  
                  <!-- Client Overview Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:18px 20px;margin-bottom:24px;">
                    <tr>
                      <td style="padding-bottom:12px;border-bottom:1px solid #EDF2F7;">
                        <div style="font-size:11px;font-family:'Courier New',Courier,monospace;text-transform:uppercase;color:#64748B;letter-spacing:0.08em;font-weight:600;margin-bottom:4px;">
                          Client / Organization
                        </div>
                        <div style="font-size:18px;color:#0F172A;font-weight:700;">
                          ${escapeHtml(name)}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:12px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="50%" valign="top">
                              <div style="font-size:11px;font-family:'Courier New',Courier,monospace;text-transform:uppercase;color:#64748B;letter-spacing:0.08em;font-weight:600;margin-bottom:4px;">
                                Email Address
                              </div>
                              <div style="font-size:14px;color:#2563EB;font-weight:600;">
                                <a href="mailto:${escapeHtml(email)}" style="color:#2563EB;text-decoration:none;">${escapeHtml(email)}</a>
                              </div>
                            </td>
                            <td width="50%" valign="top">
                              <div style="font-size:11px;font-family:'Courier New',Courier,monospace;text-transform:uppercase;color:#64748B;letter-spacing:0.08em;font-weight:600;margin-bottom:4px;">
                                Received Time
                              </div>
                              <div style="font-size:13px;color:#475569;">
                                ${escapeHtml(timestamp)}
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Project Requirement Section -->
                  <div style="font-size:11px;font-family:'Courier New',Courier,monospace;text-transform:uppercase;color:#64748B;letter-spacing:0.08em;font-weight:700;margin-bottom:8px;">
                    Project Scope &amp; Requirements
                  </div>
                  <div style="background:#FFFFFF;border-left:4px solid #9E7649;border-top:1px solid #E2E8F0;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;border-radius:0 8px 8px 0;padding:18px 20px;font-size:14px;line-height:1.65;color:#1E293B;white-space:pre-wrap;margin-bottom:28px;">
${escapeHtml(requirement)}
                  </div>

                  <!-- Action Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent('Re: Project Requirement Discussion — Prince Yadav')}" style="display:inline-block;background:#121316;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:14px 28px;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,0.15);">
                          Reply Directly to ${escapeHtml(name)} &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#0F172A;padding:22px 36px;border-top:1px solid #1E293B;text-align:center;">
                  <div style="font-size:12px;color:#94A3B8;line-height:1.5;">
                    Automated Lead Delivery &bull; Delivered via Resend API to <span style="color:#FFFFFF;font-weight:600;">princeyadav841@gmail.com</span>
                  </div>
                  <div style="font-size:11px;color:#64748B;margin-top:4px;">
                    &copy; 2026 Prince Yadav &bull; Independent Zoho Systems Consultant &amp; Developer
                  </div>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

const server = http.createServer(async (req, res) => {
  // ── Security Headers ────────────────────────────────────────────────────────
  const origin = req.headers['origin'] || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle Contact Form Submission
  if (req.url === '/api/contact' && req.method === 'POST') {
    // Rate limiting check
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Too many requests. Please wait a moment and try again.' }));
      return;
    }

    // Ensure API key is configured
    if (!RESEND_API_KEY) {
      console.error('[Config Error] RESEND_API_KEY environment variable is not set.');
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Server misconfiguration — contact admin.' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { name, email, requirement } = data;

        // Basic validation
        if (!name || !email || !requirement) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Missing required fields' }));
          return;
        }

        // Basic email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid email address' }));
          return;
        }

        const timestamp = new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'short'
        });

        const subject = `Urgent - ${name} - Prince Portfolio`;
        const html = buildEmailHtml(name, email, requirement, timestamp);

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: [EMAIL_TO],
            reply_to: email,
            subject: subject,
            html: html
          })
        });

        const resendData = await resendRes.json();

        if (resendRes.ok || resendData.id) {
          console.log(`[Resend] Email successfully dispatched to ${EMAIL_TO}. ID: ${resendData.id}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, id: resendData.id }));
        } else {
          console.error('[Resend Error]', resendData);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: resendData.message || 'Resend dispatch failed' }));
        }
      } catch (err) {
        console.error('[Server Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Serve Static Files
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath.endsWith('/')) reqPath += 'index.html';

  let filePath = path.join(__dirname, reqPath);

  // If path has no extension and directory exists, try index.html
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`Prince Portfolio Server running on http://localhost:${PORT}`);
  console.log(`Resend API Dispatch endpoint active at /api/contact`);
  console.log(`Directing inquiries to: ${EMAIL_TO}`);
  console.log(`======================================================\n`);
});
