# Contact form setup

This project wires the contact page (`/contact`) to a secure API endpoint at `/api/contact`.

What’s included now:
- Server route with validation (zod)
- Anti-bot basics: honeypot fields, minimum fill time (2s), and per-IP rate limiting (5 per 10 minutes)
- Email delivery via EmailJS server API

Environment variables:
- CONTACT_FORM_TO (recommended) — recipient or group email
- EMAILJS_SERVICE_ID
- EMAILJS_TEMPLATE_ID_CONTACT (or fallback to EMAILJS_TEMPLATE_ID)
- EMAILJS_PUBLIC_KEY
- EMAILJS_PRIVATE_KEY (recommended for server-side calls)

Template params expected by the template:
- to_email, reply_to, from_name, from_email, from_phone, subject, message, submitted_at, ip, user_agent, referer

Production anti-bot recommendations:
- Add Cloudflare Turnstile (free) or hCaptcha. Store site key/secret and verify on the server before sending.
- For stronger rate limiting, use an external store (e.g., Upstash Ratelimit or Redis) instead of the in-memory limiter.
- Keep the honeypot fields and minimum-fill-time as cheap, layered defenses.

Where to change things:
- API route: `app/api/contact/route.ts`
- Frontend page: `app/contact/page.tsx`

Notes:
- If EmailJS env vars are missing, the API will skip sending but still return success to avoid leaking signals to bots. Configure the envs to actually deliver mail.
- The API reads CONTACT_FORM_TO, or falls back to CONTACT_FORM_EMAIL_RECEIVER for backward compatibility.
