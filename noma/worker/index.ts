export interface Env {
  ASSETS: Fetcher
  NOMA_MEDIA: R2Bucket
  R2_PUBLIC_URL?: string
  FIREBASE_PROJECT_ID?: string
  ALLOWED_ORIGIN?: string
  GEMINI_API_KEY?: string
}

interface VerifiedFirebaseUser {
  uid: string
  email?: string
}

interface JwtHeader {
  alg?: string
  kid?: string
  typ?: string
}

interface FirebaseJwtPayload {
  aud?: string
  iss?: string
  sub?: string
  exp?: number
  iat?: number
  auth_time?: number
  email?: string
  firebase?: {
    sign_in_provider?: string
  }
}

interface JwkKey extends JsonWebKey {
  kid?: string
}

interface JwkSetResponse {
  keys?: JwkKey[]
}

const DEFAULT_FIREBASE_PROJECT_ID = 'nokenko-1ab8b'
const FIREBASE_JWK_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

const ALLOWED_IMAGE_MIME_TYPES: Readonly<Record<string, string>> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

function resolveAllowedOrigin(request: Request, requestUrl: URL, env: Env): string | null {
  const origin = request.headers.get('origin')
  if (!origin) return null

  if (origin === requestUrl.origin) {
    return origin
  }

  try {
    const parsedOrigin = new URL(origin)
    if (
      parsedOrigin.hostname === 'localhost' ||
      parsedOrigin.hostname === '127.0.0.1'
    ) {
      return origin
    }
  } catch {
    return null
  }

  const configured = (env.ALLOWED_ORIGIN || '').trim()
  if (!configured) return null
  if (configured === '*') return '*'

  const allowList = configured
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)

  return allowList.includes(origin) ? origin : null
}

function buildCorsHeaders(request: Request, requestUrl: URL, env: Env): Headers {
  const headers = new Headers()
  const allowedOrigin = resolveAllowedOrigin(request, requestUrl, env)
  if (allowedOrigin) {
    headers.set('Access-Control-Allow-Origin', allowedOrigin)
    if (allowedOrigin !== '*') {
      headers.set('Vary', 'Origin')
    }
  }
  headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Gemini-Api-Key')
  headers.set('Access-Control-Max-Age', '86400')
  return headers
}

function jsonResponse(
  data: Record<string, unknown>,
  status: number,
  request: Request,
  requestUrl: URL,
  env: Env
): Response {
  const headers = buildCorsHeaders(request, requestUrl, env)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return new Response(JSON.stringify(data), { status, headers })
}

function base64UrlToUint8Array(segment: string): Uint8Array<ArrayBuffer> {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const paddingLength = (4 - (base64.length % 4)) % 4
  const padded = base64 + '='.repeat(paddingLength)
  const binary = atob(padded)
  const buffer = new ArrayBuffer(binary.length)
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function parseJsonSegment<T>(segment: string): T | null {
  try {
    const decoded = new TextDecoder().decode(base64UrlToUint8Array(segment))
    return JSON.parse(decoded) as T
  } catch {
    return null
  }
}

function parseMaxAgeSeconds(cacheControl: string | null): number {
  if (!cacheControl) return 3600
  const match = cacheControl.match(/max-age=(\d+)/i)
  if (!match) return 3600
  const parsed = Number.parseInt(match[1], 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return 3600
  return Math.min(Math.max(parsed, 60), 86400)
}

async function fetchFirebaseJwks(
  ctx: ExecutionContext,
  bypassCache: boolean
): Promise<JwkKey[]> {
  const cache = caches.default
  const cacheKey = new Request(FIREBASE_JWK_URL, { method: 'GET' })

  if (!bypassCache) {
    const cached = await cache.match(cacheKey)
    if (cached) {
      const cachedData = (await cached.json().catch(() => null)) as JwkSetResponse | null
      if (cachedData && Array.isArray(cachedData.keys)) {
        return cachedData.keys
      }
    }
  }

  const upstream = await fetch(FIREBASE_JWK_URL, {
    headers: { Accept: 'application/json' },
  })
  if (!upstream.ok) {
    throw new Error(`Failed to fetch Firebase JWKs (${upstream.status})`)
  }

  const maxAge = parseMaxAgeSeconds(upstream.headers.get('cache-control'))
  const bodyBuffer = await upstream.arrayBuffer()

  const cacheHeaders = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': `public, max-age=${maxAge}`,
  })
  ctx.waitUntil(cache.put(cacheKey, new Response(bodyBuffer, { status: 200, headers: cacheHeaders })))

  const parsed = JSON.parse(new TextDecoder().decode(bodyBuffer)) as JwkSetResponse
  if (!parsed || !Array.isArray(parsed.keys)) {
    throw new Error('Malformed Firebase JWK response')
  }
  return parsed.keys
}

async function verifyFirebaseBearerToken(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<VerifiedFirebaseUser | null> {
  const authHeader = request.headers.get('authorization') || ''
  const match = authHeader.match(/^Bearer\s+(\S+)$/i)
  if (!match) {
    return null
  }

  const token = match[1]
  const parts = token.split('.')
  if (parts.length !== 3) {
    return null
  }

  const [headerB64, payloadB64, signatureB64] = parts
  const header = parseJsonSegment<JwtHeader>(headerB64)
  const payload = parseJsonSegment<FirebaseJwtPayload>(payloadB64)
  if (!header || !payload) {
    return null
  }

  if (header.alg !== 'RS256' || typeof header.kid !== 'string' || header.kid.length === 0) {
    return null
  }

  const projectId = (env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID).trim()
  const nowSec = Math.floor(Date.now() / 1000)

  if (
    payload.aud !== projectId ||
    payload.iss !== `https://securetoken.google.com/${projectId}` ||
    typeof payload.sub !== 'string' ||
    payload.sub.length === 0 ||
    payload.sub.length > 128 ||
    typeof payload.exp !== 'number' ||
    payload.exp <= nowSec ||
    typeof payload.iat !== 'number' ||
    payload.iat > nowSec + 60 ||
    typeof payload.auth_time !== 'number' ||
    payload.auth_time > nowSec + 60 ||
    payload.firebase?.sign_in_provider === 'anonymous'
  ) {
    return null
  }

  let keys = await fetchFirebaseJwks(ctx, false)
  let matchingJwk = keys.find((k) => k.kid === header.kid && k.kty === 'RSA')

  if (!matchingJwk) {
    keys = await fetchFirebaseJwks(ctx, true)
    matchingJwk = keys.find((k) => k.kid === header.kid && k.kty === 'RSA')
  }

  if (!matchingJwk) {
    return null
  }

  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    matchingJwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  const signature = base64UrlToUint8Array(signatureB64)
  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signature,
    signingInput
  )

  if (!isValid) {
    return null
  }

  return {
    uid: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : undefined,
  }
}

function sanitizeFolder(raw: ReturnType<FormData['get']>): string {
  if (typeof raw !== 'string') return 'products'
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/\.\.+/g, '')
    .replace(/[^a-z0-9/_-]+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^\/+|\/+$/g, '')
  return cleaned || 'products'
}

function extractMediaKey(pathname: string, prefix: string): string | null {
  const rawSegment = pathname.slice(prefix.length)
  if (!rawSegment) return null
  let decoded: string
  try {
    decoded = decodeURIComponent(rawSegment)
  } catch {
    return null
  }
  const normalized = decoded.replace(/^\/+/, '').replace(/\/+$/, '')
  if (!normalized || normalized.includes('..') || normalized.includes('\0')) {
    return null
  }
  return normalized
}

function isUploadedFile(entry: ReturnType<FormData['get']>): entry is File {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    'stream' in entry &&
    'size' in entry &&
    'type' in entry
  )
}

function computeDeliveryEstimate(stateParam: string, bulky: boolean): {
  standardFee: number
  expressFee: number
  etaDays: string
  zone: string
} {
  const normalized = stateParam.trim().toLowerCase()
  let baseFee = 7500
  let zone = 'Nationwide Interstate'
  let etaDays = '3-5 business days'

  if (normalized === 'lagos') {
    baseFee = 3500
    zone = 'Lagos Metro'
    etaDays = '1-2 business days'
  } else if (normalized === 'ogun' || normalized === 'oyo') {
    baseFee = 4500
    zone = 'Southwest Corridor'
    etaDays = '2-3 business days'
  } else if (
    normalized === 'fct - abuja' ||
    normalized === 'abuja' ||
    normalized === 'fct' ||
    normalized === 'rivers'
  ) {
    baseFee = 6000
    zone = 'Major Hub Express'
    etaDays = '2-4 business days'
  }

  const standardFee = baseFee + (bulky ? 4000 : 0)
  const expressFee = Math.round(standardFee * 1.5)

  return { standardFee, expressFee, etaDays, zone }
}

async function handleGeminiProductStudio(
  request: Request,
  requestUrl: URL,
  env: Env
): Promise<Response> {
  const apiKey = (
    request.headers.get('x-gemini-api-key') ||
    env.GEMINI_API_KEY ||
    ''
  ).trim()

  if (!apiKey) {
    return jsonResponse(
      { error: 'GEMINI_API_KEY not configured on worker.' },
      503,
      request,
      requestUrl,
      env
    )
  }

  const body = (await request.json().catch(() => null)) as {
    imageBase64?: string
    mimeType?: string
    prompt?: string
  } | null

  if (!body || !body.imageBase64 || !body.prompt) {
    return jsonResponse(
      { error: 'Missing imageBase64 or prompt in request payload.' },
      400,
      request,
      requestUrl,
      env
    )
  }

  const mimeType = body.mimeType || 'image/jpeg'

  const copyRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
      apiKey
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: body.prompt },
              { inlineData: { mimeType, data: body.imageBase64 } },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    }
  )

  let copy: Record<string, unknown> | undefined
  if (copyRes.ok) {
    const copyJson = (await copyRes.json().catch(() => null)) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    } | null
    const rawText = copyJson?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (rawText) {
      try {
        const cleaned = rawText
          .replace(/^```json\s*/i, '')
          .replace(/```\s*$/, '')
          .trim()
        copy = JSON.parse(cleaned) as Record<string, unknown>
      } catch {
        copy = undefined
      }
    }
  }

  let studioImage: { data: string; mimeType: string } | undefined
  try {
    const imgRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Place this exact product on a pure, clean solid white e-commerce photography studio background (#FFFFFF) with soft natural studio lighting and a subtle contact shadow. Remove all background clutter.',
                },
                { inlineData: { mimeType, data: body.imageBase64 } },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }),
      }
    )

    if (imgRes.ok) {
      const imgJson = (await imgRes.json().catch(() => null)) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ inlineData?: { mimeType?: string; data?: string } }>
          }
        }>
      } | null
      const parts = imgJson?.candidates?.[0]?.content?.parts || []
      const found = parts.find((p) => p.inlineData?.data)
      if (found?.inlineData?.data) {
        studioImage = {
          data: found.inlineData.data,
          mimeType: found.inlineData.mimeType || 'image/png',
        }
      }
    }
  } catch {
    studioImage = undefined
  }

  return jsonResponse({ copy, studioImage }, 200, request, requestUrl, env)
}

async function handleMediaUpload(
  request: Request,
  requestUrl: URL,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const authUser = await verifyFirebaseBearerToken(request, env, ctx)
  if (!authUser) {
    return jsonResponse({ error: 'Unauthorized: valid Firebase ID token required.' }, 401, request, requestUrl, env)
  }

  const contentType = request.headers.get('content-type') || ''
  if (!contentType.toLowerCase().includes('multipart/form-data')) {
    return jsonResponse({ error: 'Expected multipart/form-data payload.' }, 400, request, requestUrl, env)
  }

  const formData = await request.formData()
  const fileEntry = formData.get('file')
  if (!isUploadedFile(fileEntry)) {
    return jsonResponse({ error: 'Missing file field in upload form data.' }, 400, request, requestUrl, env)
  }

  if (fileEntry.size <= 0) {
    return jsonResponse({ error: 'Uploaded file is empty.' }, 400, request, requestUrl, env)
  }

  if (fileEntry.size > MAX_UPLOAD_BYTES) {
    return jsonResponse({ error: 'File exceeds the 10 MB maximum upload limit.' }, 413, request, requestUrl, env)
  }

  const normalizedMime = fileEntry.type.toLowerCase().split(';')[0].trim()
  const ext = ALLOWED_IMAGE_MIME_TYPES[normalizedMime]
  if (!ext) {
    return jsonResponse(
      { error: 'Unsupported media type. Allowed: image/jpeg, image/png, image/webp, image/avif.' },
      415,
      request,
      requestUrl,
      env
    )
  }

  const safeFolder = sanitizeFolder(formData.get('folder'))
  const key = `${safeFolder}/${crypto.randomUUID()}.${ext}`
  const putOptions: R2PutOptions = {
    httpMetadata: {
      contentType: normalizedMime,
      cacheControl: 'public, max-age=31536000, immutable',
    },
    customMetadata: {
      uploadedBy: authUser.uid,
      originalName: (fileEntry.name || 'upload').slice(0, 120),
    },
  }

  const fileStream = fileEntry.stream()
  if (typeof FixedLengthStream !== 'undefined') {
    const fixed = new FixedLengthStream(fileEntry.size)
    await Promise.all([
      fileStream.pipeTo(fixed.writable),
      env.NOMA_MEDIA.put(key, fixed.readable, putOptions),
    ])
  } else {
    await env.NOMA_MEDIA.put(key, fileStream, putOptions)
  }

  const publicBase = (env.R2_PUBLIC_URL || '').trim().replace(/\/+$/, '')
  const publicUrl = publicBase ? `${publicBase}/${key}` : `${requestUrl.origin}/media/${key}`

  console.log(
    JSON.stringify({
      event: 'media.upload',
      key,
      size: fileEntry.size,
      mimeType: normalizedMime,
      uid: authUser.uid,
    })
  )

  return jsonResponse({ url: publicUrl, key }, 201, request, requestUrl, env)
}

async function handleMediaDelete(
  request: Request,
  requestUrl: URL,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const authUser = await verifyFirebaseBearerToken(request, env, ctx)
  if (!authUser) {
    return jsonResponse({ error: 'Unauthorized: valid Firebase ID token required.' }, 401, request, requestUrl, env)
  }

  const key = extractMediaKey(requestUrl.pathname, '/api/media/')
  if (!key) {
    return jsonResponse({ error: 'Invalid media object key.' }, 400, request, requestUrl, env)
  }

  await env.NOMA_MEDIA.delete(key)

  console.log(
    JSON.stringify({
      event: 'media.delete',
      key,
      uid: authUser.uid,
    })
  )

  return jsonResponse({ deleted: true, key }, 200, request, requestUrl, env)
}

async function handleMediaServe(
  request: Request,
  requestUrl: URL,
  env: Env
): Promise<Response> {
  const key = extractMediaKey(requestUrl.pathname, '/media/')
  if (!key) {
    return jsonResponse({ error: 'Invalid media path.' }, 400, request, requestUrl, env)
  }

  if (request.method === 'HEAD') {
    const headObj = await env.NOMA_MEDIA.head(key)
    if (!headObj) {
      return jsonResponse({ error: 'Media object not found.' }, 404, request, requestUrl, env)
    }

    const headers = buildCorsHeaders(request, requestUrl, env)
    headObj.writeHttpMetadata(headers)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/octet-stream')
    }
    headers.set('ETag', headObj.httpEtag)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
    headers.set('X-Content-Type-Options', 'nosniff')

    if (request.headers.get('if-none-match') === headObj.httpEtag) {
      return new Response(null, { status: 304, headers })
    }
    return new Response(null, { status: 200, headers })
  }

  const object = await env.NOMA_MEDIA.get(key)
  if (!object) {
    return jsonResponse({ error: 'Media object not found.' }, 404, request, requestUrl, env)
  }

  const headers = buildCorsHeaders(request, requestUrl, env)
  object.writeHttpMetadata(headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/octet-stream')
  }
  headers.set('ETag', object.httpEtag)
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
  headers.set('X-Content-Type-Options', 'nosniff')

  if (request.headers.get('if-none-match') === object.httpEtag) {
    return new Response(null, { status: 304, headers })
  }

  return new Response(object.body, { status: 200, headers })
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const requestUrl = new URL(request.url)

    try {
      if (request.method === 'OPTIONS') {
        const headers = buildCorsHeaders(request, requestUrl, env)
        return new Response(null, { status: 204, headers })
      }

      if (request.method === 'GET' && requestUrl.pathname === '/api/health') {
        return jsonResponse(
          {
            ok: true,
            service: 'noma-edge-worker',
            timestamp: new Date().toISOString(),
            r2Bound: Boolean(env.NOMA_MEDIA),
          },
          200,
          request,
          requestUrl,
          env
        )
      }

      if (request.method === 'GET' && requestUrl.pathname === '/api/delivery-estimate') {
        const stateParam = requestUrl.searchParams.get('state') || ''
        const bulkyParam = (requestUrl.searchParams.get('bulky') || 'false').toLowerCase()
        const bulky = bulkyParam === 'true' || bulkyParam === '1' || bulkyParam === 'yes'
        const estimate = computeDeliveryEstimate(stateParam, bulky)

        return jsonResponse(
          {
            ...estimate,
            state: stateParam.trim() || 'Other',
            bulky,
            currency: 'NGN',
          },
          200,
          request,
          requestUrl,
          env
        )
      }

      if (request.method === 'POST' && requestUrl.pathname === '/api/media/upload') {
        return await handleMediaUpload(request, requestUrl, env, ctx)
      }

      if (request.method === 'POST' && requestUrl.pathname === '/api/ai/product-studio') {
        return await handleGeminiProductStudio(request, requestUrl, env)
      }

      if (request.method === 'DELETE' && requestUrl.pathname.startsWith('/api/media/')) {
        return await handleMediaDelete(request, requestUrl, env, ctx)
      }

      if (
        (request.method === 'GET' || request.method === 'HEAD') &&
        requestUrl.pathname.startsWith('/media/')
      ) {
        return await handleMediaServe(request, requestUrl, env)
      }

      if (requestUrl.pathname.startsWith('/api/')) {
        return jsonResponse(
          { error: 'API endpoint not found.' },
          404,
          request,
          requestUrl,
          env
        )
      }

      return await env.ASSETS.fetch(request)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(
        JSON.stringify({
          event: 'worker.unhandled_error',
          method: request.method,
          path: requestUrl.pathname,
          error: message,
        })
      )
      return jsonResponse(
        { error: 'Internal server error.' },
        500,
        request,
        requestUrl,
        env
      )
    }
  },
} satisfies ExportedHandler<Env>
