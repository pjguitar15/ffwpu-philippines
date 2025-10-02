import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function required(name: string, value: string | undefined) {
  const v = (value ?? '').toString().trim()
  if (!v) throw new Error(`${name} is not set`)
  return v
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const rid = () =>
  `upl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/** Configure SDK once (used only in fallback) */
function ensureCloudinarySdkConfigured() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud_name || !api_key || !api_secret) return false
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true })
  return true
}

export async function POST(req: Request) {
  const debugId = rid()
  try {
    console.log(`[cloudinary] [${debugId}] start`)
    const form = await req.formData()
    const file = form.get('file') as File | Blob | null
    if (!file) {
      console.warn(`[cloudinary] [${debugId}] no file provided`)
      return NextResponse.json(
        { error: 'Missing file', debugId },
        { status: 400 },
      )
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

    const maxBytes = Number(
      process.env.CLOUDINARY_MAX_UPLOAD_BYTES || 10 * 1024 * 1024,
    )
    const fileSize = (file as any).size as number | undefined
    const fileType = (file as any).type
    console.log(
      `[cloudinary] [${debugId}] env present: name=${!!cloudName} key=${!!apiKey} secret=${!!apiSecret} preset=${!!unsignedPreset}, folder="${folder}" size=${fileSize} type=${fileType}`,
    )
    if (typeof fileSize === 'number' && fileSize > maxBytes) {
      console.warn(
        `[cloudinary] [${debugId}] file too large: ${fileSize} > ${maxBytes}`,
      )
      return NextResponse.json(
        {
          error: `File too large. Max ${(maxBytes / (1024 * 1024)).toFixed(
            0,
          )}MB`,
          debugId,
        },
        { status: 413 },
      )
    }

    // ----- build multipart form for REST upload -----
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)

    let mode: 'unsigned' | 'signed' = 'signed'
    if (unsignedPreset) {
      mode = 'unsigned'
      fd.append('upload_preset', unsignedPreset)
      console.log(`[cloudinary] [${debugId}] using unsigned preset upload`)
    } else {
      const key = required('CLOUDINARY_API_KEY', apiKey)
      const secret = required('CLOUDINARY_API_SECRET', apiSecret)
      const timestamp = Math.floor(Date.now() / 1000)
      const paramsToSign: Record<string, string | number> = {
        folder,
        timestamp,
      }
      const strToSign = Object.keys(paramsToSign)
        .sort()
        .map((k) => `${k}=${paramsToSign[k]}`)
        .join('&')
      const signature = createHash('sha1')
        .update(strToSign + secret)
        .digest('hex')
      console.log(
        `[cloudinary] [${debugId}] signed upload; params="${strToSign}"`,
      )
      fd.append('api_key', key)
      fd.append('timestamp', String(timestamp))
      fd.append('signature', signature)
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
    console.log(`[cloudinary] [${debugId}] POST ${cloudinaryUrl} mode=${mode}`)

    // ----- try REST upload with retries + longer timeout -----
    let lastErr: unknown = null
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: fd,
          cache: 'no-store',
          // bump total request timeout beyond undici’s default
          signal: AbortSignal.timeout(45_000),
        })

        const text = await res.text()
        let json: any = null
        try {
          json = text ? JSON.parse(text) : null
        } catch {
          json = { raw: text }
        }

        if (!res.ok) {
          // Retry only on 5xx (transient); otherwise return immediately
          if (res.status >= 500 && attempt < 3) {
            console.warn(
              `[cloudinary] [${debugId}] attempt ${attempt} -> ${res.status}; retrying…`,
            )
            await sleep(400 * attempt)
            continue
          }
          console.error(
            `[cloudinary] [${debugId}] error status=${res.status}`,
            json,
          )
          return NextResponse.json(
            {
              error: json?.error?.message || 'Upload failed',
              debugId,
              details: json,
            },
            { status: res.status },
          )
        }

        // success
        return NextResponse.json({
          url: json.secure_url || json.url,
          public_id: json.public_id,
          width: json.width,
          height: json.height,
          format: json.format,
          bytes: json.bytes,
          debugId,
        })
      } catch (e) {
        lastErr = e
        if (attempt < 3) {
          console.warn(
            `[cloudinary] [${debugId}] network error on attempt ${attempt}; retrying…`,
            e,
          )
          await sleep(400 * attempt)
        }
      }
    }

    console.warn(
      `[cloudinary] [${debugId}] REST upload failed after retries`,
      lastErr,
    )

    // ----- fallback: Cloudinary Node SDK (stream) if creds exist -----
    if (ensureCloudinarySdkConfigured()) {
      try {
        const arrayBuffer = await (file as File).arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (err: any, res: any) => (err ? reject(err) : resolve(res)),
          )
          stream.end(buffer)
        })
        console.log(`[cloudinary] [${debugId}] SDK fallback success`, {
          public_id: result?.public_id,
          bytes: result?.bytes,
        })
        return NextResponse.json({
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          debugId,
        })
      } catch (sdkErr: any) {
        console.error(`[cloudinary] [${debugId}] SDK fallback failed`, sdkErr)
        return NextResponse.json(
          { error: sdkErr?.message || 'Upload failed', debugId },
          { status: 500 },
        )
      }
    }

    // No SDK creds available; report network timeout
    return NextResponse.json(
      { error: 'Upload failed (network timeout)', debugId },
      { status: 500 },
    )
  } catch (e: any) {
    console.error(`[cloudinary] [${debugId}] exception`, e)
    return NextResponse.json(
      { error: e?.message || 'Server error', debugId },
      { status: 500 },
    )
  }
}
