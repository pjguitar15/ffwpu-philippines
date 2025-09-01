export type EmailJsParams = Record<string, any>

// lib/emailjs.ts
export async function sendEmailJs(
  {
    serviceId,
    templateId,
    publicKey,
    privateKey, // <- new
  }: {
    serviceId?: string
    templateId?: string
    publicKey?: string
    privateKey?: string
  },
  templateParams: Record<string, any>,
) {
  if (!serviceId || !templateId || !publicKey) {
    console.warn('[email] EmailJS env vars missing; skipping email send')
    return { ok: false, skipped: true }
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const body: any = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams,
  }

  // Required for server/non-browser (strict) mode
  if (privateKey) {
    headers.Authorization = `Bearer ${privateKey}`
    body.accessToken = privateKey
  }

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.warn('[email] EmailJS send failed:', res.status, text)
    return { ok: false }
  }
  return { ok: true }
}

