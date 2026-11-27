const SITE_URL = 'https://shopnoma.com.ng'
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-noma-share.jpg`
const FIRESTORE_BASE =
  'https://firestore.googleapis.com/v1/projects/nokenko-1ab8b/databases/noma/documents'

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatNaira(amount) {
  const num = Number(amount) || 0
  return `₦${Math.round(num).toLocaleString('en-NG')}`
}

function readFsString(fields, key) {
  const field = fields?.[key]
  if (!field) return ''
  return typeof field.stringValue === 'string' ? field.stringValue : ''
}

function readFsNumber(fields, key) {
  const field = fields?.[key]
  if (!field) return 0
  if (typeof field.integerValue === 'string' || typeof field.integerValue === 'number') {
    return Number(field.integerValue) || 0
  }
  if (typeof field.doubleValue === 'number') {
    return field.doubleValue
  }
  return 0
}

function readFsCandidateImages(fields) {
  const candidates = []
  const primary = readFsString(fields, 'image')
  if (primary && !primary.includes('unsplash.com')) {
    candidates.push(primary)
  }
  const arr = fields?.images?.arrayValue?.values
  if (Array.isArray(arr)) {
    for (const entry of arr) {
      const url = entry?.stringValue
      if (url && !url.includes('unsplash.com') && !candidates.includes(url)) {
        candidates.push(url)
      }
    }
  }
  return candidates
}

function parseDataImageUri(uri) {
  if (typeof uri !== 'string' || !uri.startsWith('data:image/')) return null
  const match = uri.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s)
  if (!match) return null
  return {
    mimeType: match[1].toLowerCase(),
    base64: match[2],
  }
}

function toAbsoluteHttpUrl(url) {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('data:')) return ''
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

async function isImageReachable(url, timeoutMs = 2500) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    })
    if (res.ok) {
      const ct = (res.headers.get('content-type') || '').toLowerCase()
      return {
        ok: !ct || ct.startsWith('image/'),
        contentType: ct.startsWith('image/') ? ct.split(';')[0] : '',
      }
    }
    // Some origins disallow HEAD (405); treat as reachable rather than dropping valid images
    if (res.status === 405) {
      return { ok: true, contentType: '' }
    }
    return { ok: false, contentType: '' }
  } catch {
    return { ok: false, contentType: '' }
  } finally {
    clearTimeout(timer)
  }
}

async function resolveOgImage(fields, productSlugOrId) {
  const candidates = readFsCandidateImages(fields)
  for (const raw of candidates) {
    const parsedData = parseDataImageUri(raw)
    if (parsedData) {
      return {
        url: `${SITE_URL}/api/og-product?slug=${encodeURIComponent(productSlugOrId)}&image=1`,
        contentType: parsedData.mimeType,
      }
    }

    const absUrl = toAbsoluteHttpUrl(raw)
    if (!absUrl) continue

    if (absUrl.startsWith(`${SITE_URL}/`)) {
      return { url: absUrl, contentType: '' }
    }

    const check = await isImageReachable(absUrl)
    if (check.ok) {
      return { url: absUrl, contentType: check.contentType }
    }
  }

  return { url: DEFAULT_OG_IMAGE, contentType: 'image/jpeg' }
}

function normalizeSlugInput(raw) {
  let decoded = String(raw || '')
  try {
    decoded = decodeURIComponent(decoded)
  } catch {
    // Keep raw string if malformed percent-encoding
  }
  return decoded.trim().replace(/^\/+|\/+$/g, '')
}

async function queryFirestoreBySlug(slugValue) {
  const queryRes = await fetch(`${FIRESTORE_BASE}:runQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'products' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'slug' },
            op: 'EQUAL',
            value: { stringValue: slugValue },
          },
        },
        limit: 1,
      },
    }),
  })
  if (!queryRes.ok) return null
  const rows = await queryRes.json()
  const doc = Array.isArray(rows) ? rows.find((r) => r && r.document)?.document : null
  if (doc?.fields) {
    return { id: doc.name.split('/').pop(), fields: doc.fields }
  }
  return null
}

async function fetchProductBySlugOrId(slugOrId) {
  const clean = normalizeSlugInput(slugOrId)
  if (!clean) return null

  // 1. Try querying by `slug` field (exact, then lowercased if different)
  const slugCandidates = [clean]
  const lower = clean.toLowerCase()
  if (lower !== clean) slugCandidates.push(lower)

  for (const candidate of slugCandidates) {
    try {
      const hit = await queryFirestoreBySlug(candidate)
      if (hit) return hit
    } catch {
      // Fall through
    }
  }

  // 2. Fallback: direct document lookup by ID
  try {
    const docRes = await fetch(
      `${FIRESTORE_BASE}/products/${encodeURIComponent(clean)}`,
      { method: 'GET' },
    )
    if (docRes.ok) {
      const doc = await docRes.json()
      if (doc?.fields) {
        return { id: clean, fields: doc.fields }
      }
    }
  } catch {
    // Fall through
  }

  // 3. Fallback: scan catalog for case-insensitive or trailing-hyphen slug matches
  try {
    const listRes = await fetch(`${FIRESTORE_BASE}/products?pageSize=100`, { method: 'GET' })
    if (listRes.ok) {
      const data = await listRes.json()
      const docs = Array.isArray(data?.documents) ? data.documents : []
      const trimmedLower = lower.replace(/-+$/, '')
      for (const doc of docs) {
        if (!doc?.fields) continue
        const docId = doc.name.split('/').pop()
        const docSlug = readFsString(doc.fields, 'slug').toLowerCase()
        if (
          docId.toLowerCase() === lower ||
          docSlug === lower ||
          (trimmedLower && docSlug.replace(/-+$/, '') === trimmedLower)
        ) {
          return { id: docId, fields: doc.fields }
        }
      }
    }
  } catch {
    // Ignore
  }

  return null
}

export default async function handler(req, res) {
  const rawSlug = Array.isArray(req.query?.slug) ? req.query.slug[0] : req.query?.slug || ''
  const slug = normalizeSlugInput(rawSlug)
  const isImageRequest = req.query?.image === '1' || req.query?.mode === 'image'

  const found = await fetchProductBySlugOrId(slug)
  const fields = found?.fields || null

  // Binary image proxy mode for legacy base64 data-URI product images
  if (isImageRequest) {
    if (fields) {
      const candidates = readFsCandidateImages(fields)
      for (const raw of candidates) {
        const parsed = parseDataImageUri(raw)
        if (parsed) {
          const buffer = Buffer.from(parsed.base64, 'base64')
          res.setHeader('Content-Type', parsed.mimeType)
          res.setHeader('Content-Length', String(buffer.length))
          res.setHeader(
            'Cache-Control',
            'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          )
          res.status(200).send(buffer)
          return
        }
        const absUrl = toAbsoluteHttpUrl(raw)
        if (absUrl) {
          res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
          res.redirect(302, absUrl)
          return
        }
      }
    }
    res.redirect(302, DEFAULT_OG_IMAGE)
    return
  }

  const name = fields ? readFsString(fields, 'name') : ''
  const brand = fields ? readFsString(fields, 'brand') || 'Shop Noma' : 'Shop Noma'
  const finalPrice = fields ? readFsNumber(fields, 'finalPrice') : 0
  const stockQty = fields ? readFsNumber(fields, 'stockQty') : 0
  const rawDesc = fields ? readFsString(fields, 'description') : ''
  const productSlug = fields ? readFsString(fields, 'slug') || found.id : slug

  const resolvedImage = fields
    ? await resolveOgImage(fields, productSlug || found.id)
    : { url: DEFAULT_OG_IMAGE, contentType: 'image/jpeg' }
  const productImage = resolvedImage.url
  const productImageType = resolvedImage.contentType

  const canonicalUrl = `${SITE_URL}/product/${encodeURIComponent(productSlug || slug)}`
  const title = name
    ? `${name} — ${formatNaira(finalPrice)} | Shop Noma`
    : 'Shop Noma | Everyday Living, Delivered Across Nigeria'

  const cleanDesc = rawDesc
    ? rawDesc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
    : name
      ? `Buy ${name} for ${formatNaira(finalPrice)} on Shop Noma with fast nationwide delivery across Nigeria.`
      : 'Shop fashion, footwear, home appliances, kitchen & tech across Nigeria on Shop Noma.'

  const jsonLd = name
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        image: [productImage],
        description: cleanDesc,
        brand: {
          '@type': 'Brand',
          name: brand,
        },
        offers: {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: 'NGN',
          price: String(finalPrice),
          availability:
            stockQty > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
      }
    : null

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="title" content="${escapeHtml(title)}" />
  <meta name="description" content="${escapeHtml(cleanDesc)}" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />

  <meta property="og:type" content="${name ? 'product' : 'website'}" />
  <meta property="og:site_name" content="Shop Noma" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(cleanDesc)}" />
  <meta property="og:image" content="${escapeHtml(productImage)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(productImage)}" />
  ${
    productImageType
      ? `<meta property="og:image:type" content="${escapeHtml(productImageType)}" />`
      : ''
  }
  <meta property="og:image:alt" content="${escapeHtml(name || 'Shop Noma')}" />
  <meta property="og:locale" content="en_NG" />
  ${
    name
      ? `<meta property="product:price:amount" content="${escapeHtml(String(finalPrice))}" />
  <meta property="product:price:currency" content="NGN" />`
      : ''
  }

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(cleanDesc)}" />
  <meta name="twitter:image" content="${escapeHtml(productImage)}" />
  ${
    jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
      : ''
  }
</head>
<body>
  <main style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:40px auto;padding:0 16px;">
    <h1>${escapeHtml(name || 'Shop Noma')}</h1>
    <p>${escapeHtml(cleanDesc)}</p>
    <p><a href="${escapeHtml(canonicalUrl)}">View on Shop Noma</a></p>
  </main>
</body>
</html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  res.status(200).send(html)
}
