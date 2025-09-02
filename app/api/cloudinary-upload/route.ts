import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

export const runtime = 'nodejs'

function required(name: string, value: string | undefined) {
  const v = (value ?? '').toString().trim()
  if (!v) throw new Error(`${name} is not set`)
  return v
}

export async function POST(req: Request) {
  const debugId = `upl-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
  try {
    console.log(`[cloudinary] [${debugId}] start`)
    const form = await req.formData()
    const file = form.get('file') as Blob | null
    if (!file) {
      console.warn(`[cloudinary] [${debugId}] no file provided`)
      return NextResponse.json({ error: 'Missing file', debugId }, { status: 400 })
    }

  const cloudName = required(
      'CLOUDINARY_CLOUD_NAME',
      process.env.CLOUDINARY_CLOUD_NAME,
    )
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()
  const unsignedPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim()
    const folder =
      process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || 'ffwpu-philippines/news'

    // Optional size guard (~10MB by default)
    const maxBytes = Number(process.env.CLOUDINARY_MAX_UPLOAD_BYTES || 10 * 1024 * 1024)
    const fileSize = typeof (file as any).size === 'number' ? (file as any).size : undefined
    const fileType = (file as any).type
    console.log(
      `[cloudinary] [${debugId}] env present: name=${!!cloudName} key=${!!apiKey} secret=${!!apiSecret} preset=${!!unsignedPreset}, folder="${folder}" size=${fileSize} type=${fileType} keyLen=${apiKey?.length ?? 0} secretLen=${apiSecret?.length ?? 0}`,
    )
    if (typeof fileSize === 'number' && fileSize > maxBytes) {
      console.warn(`[cloudinary] [${debugId}] file too large: ${fileSize} > ${maxBytes}`)
      return NextResponse.json(
        { error: `File too large. Max ${(maxBytes / (1024 * 1024)).toFixed(0)}MB`, debugId },
        { status: 413 },
      )
    }

    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)

    let mode: 'unsigned' | 'signed' = 'signed'
    if (unsignedPreset) {
      mode = 'unsigned'
      fd.append('upload_preset', unsignedPreset)
      console.log(`[cloudinary] [${debugId}] using unsigned preset upload`)
    } else {
      // Signed flow requires api key/secret
      const key = required('CLOUDINARY_API_KEY', apiKey)
      const secret = required('CLOUDINARY_API_SECRET', apiSecret)
      const timestamp = Math.floor(Date.now() / 1000)
      const paramsToSign: Record<string, string | number> = { folder, timestamp }
      const strToSign = Object.keys(paramsToSign)
        .sort()
        .map((k) => `${k}=${paramsToSign[k]}`)
        .join('&')
      const signature = createHash('sha1').update(strToSign + secret).digest('hex')
      console.log(
        `[cloudinary] [${debugId}] using signed upload; params: "${strToSign}", sigLen=${signature.length}`,
      )
      fd.append('api_key', key)
      fd.append('timestamp', String(timestamp))
      fd.append('signature', signature)
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
  console.log(`[cloudinary] [${debugId}] POST ${cloudinaryUrl} mode=${mode}`)
    const res = await fetch(cloudinaryUrl, { method: 'POST', body: fd })
    const text = await res.text()
    let json: any = null
    try {
      json = text ? JSON.parse(text) : null
    } catch {
      json = { raw: text }
    }

    if (!res.ok) {
      console.error(
        `[cloudinary] [${debugId}] error status=${res.status} body=`,
        json,
      )
      return NextResponse.json(
        { error: json?.error?.message || 'Upload failed', debugId, details: json },
        { status: res.status },
      )
    }

    console.log(`[cloudinary] [${debugId}] success`, {
      status: res.status,
      public_id: json?.public_id,
      bytes: json?.bytes,
      format: json?.format,
    })

    return NextResponse.json({
      url: json.secure_url || json.url,
      public_id: json.public_id,
      width: json.width,
      height: json.height,
      format: json.format,
      bytes: json.bytes,
      debugId,
    })
  } catch (e: any) {
    console.error(`[cloudinary] [${debugId}] exception`, e)
    return NextResponse.json({ error: e?.message || 'Server error', debugId }, { status: 500 })
  }
}
