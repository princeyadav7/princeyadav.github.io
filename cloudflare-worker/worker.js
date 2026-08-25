/**
 * Cloudflare Worker — Contact Form API
 * Prince Yadav Portfolio
 *
 * Handles POST /api/contact from the portfolio site.
 * Dispatches a formatted email via Resend API.
 *
 * Environment variables (set in Cloudflare dashboard or wrangler.toml):
 *   RESEND_API_KEY  — Your Resend API key (set as a secret, never in code)
 *
 * Deploy: wrangler deploy
 */

const EMAIL_TO   = 'princeyadav841@gmail.com';
const EMAIL_FROM = 'Prince Yadav Portfolio <info@protonvix.com>';

// ── Allowed origins (update if you add a custom domain) ──────────────────────
const ALLOWED_ORIGINS = [
  'https://princeyadav7.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
];

// ── Simple in-memory rate limiter (per IP, resets each Worker invocation) ────
// For production-grade limiting, use Cloudflare's Rate Limiting product.
const rateLimitStore = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  rateLimitStore.set(ip, entry);
  return entry.count > RATE_LIMIT_MAX;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.35);border:1px solid #1E293B;">

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

              <tr>
                <td style="padding:36px 36px 28px;background:#FFFFFF;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:18px 20px;margin-bottom:24px;">
                    <tr>
                      <td style="padding-bottom:12px;border-bottom:1px solid #EDF2F7;">
                        <div style="font-size:11px;font-family:'Courier New',Courier,monospace;text-transform:uppercase;color:#64748B;letter-spacing:0.08em;font-weight:600;margin-bottom:4px;">Client / Organization</div>
                        <div style="font-size:18px;color:#0F172A;font-weight:700;">${escapeHtml(name)}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:12px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="50%" valign="top">
                              <div style="font-size:11px;font-family:'Courier New',Courier,monospace;text-transform:uppercase;color:#64748B;letter-spacing:0.08em;font-weight:600;margin-bottom:4px;">Email Address</div>
                              <div style="font-size:14px;color:#2563EB;font-weight:600;">
                                <a href="mailto:${escapeHtml(email)}" style="color:#2563EB;text-decoration:none;">${escapeHtml(email)}</a>
                              </div>
                            </td>
                            <td width="50%" valign="top">
                              <div style="font-size:11px;font-family:'Courier New',Courier,monospace;text-transform:uppercase;color:#64748B;letter-spacing:0.08em;font-weight:600;margin-bottom:4px;">Received Time</div>
                              <div style="font-size:13px;color:#475569;">${escapeHtml(timestamp)}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <div style="font-size:11px;font-family:'Courier New',Courier,monospace;text-transform:uppercase;color:#64748B;letter-spacing:0.08em;font-weight:700;margin-bottom:8px;">
                    Project Scope &amp; Requirements
                  </div>
                  <div style="background:#FFFFFF;border-left:4px solid #9E7649;border-top:1px solid #E2E8F0;border-right:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;border-radius:0 8px 8px 0;padding:18px 20px;font-size:14px;line-height:1.65;color:#1E293B;white-space:pre-wrap;margin-bottom:28px;">
${escapeHtml(requirement)}
                  </div>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent('Re: Project Requirement Discussion \u2014 Prince Yadav')}" style="display:inline-block;background:#121316;color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:600;padding:14px 28px;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,0.15);">
                          Reply Directly to ${escapeHtml(name)} &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

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

export default {
  async fetch(request, env) {
    const url    = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    // ── CORS preflight ─────────────────────────────────────────────────────────
    const isAllowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.github.io');
    const allowOriginHeader = isAllowedOrigin ? (origin || '*') : '';

    const corsHeaders = {
      'Access-Control-Allow-Methods':  'POST, OPTIONS',
      'Access-Control-Allow-Headers':  'Content-Type, Accept',
      'Access-Control-Allow-Origin':   allowOriginHeader,
      'Vary':                          'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ── Only handle POST /api/contact ──────────────────────────────────────────
    if (url.pathname !== '/api/contact' || request.method !== 'POST') {
      return new Response('Not Found', { status: 404 });
    }

    // ── Rate limiting ──────────────────────────────────────────────────────────
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Too many requests. Please wait a moment and try again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Parse + validate body ──────────────────────────────────────────────────
    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, requirement } = payload;

    if (!name || !email || !requirement) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields: name, email, requirement' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── Build and dispatch email via Resend ────────────────────────────────────
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const subject   = `Urgent - ${name} - Prince Portfolio`;
    const emailHtml = buildEmailHtml(name, email, requirement, timestamp);

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:     EMAIL_FROM,
        to:       [EMAIL_TO],
        reply_to: email,
        subject:  subject,
        html:     emailHtml,
      }),
    });

    const resendData = await resendRes.json();

    if (resendRes.ok || resendData.id) {
      console.log(`[Resend] Email dispatched. ID: ${resendData.id}`);
      return new Response(
        JSON.stringify({ success: true, id: resendData.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.error('[Resend Error]', resendData);
    return new Response(
      JSON.stringify({ success: false, error: resendData.message || 'Email dispatch failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};
