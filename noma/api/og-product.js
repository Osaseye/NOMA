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

function readFsFirstImage(fields) {
  const primary = readFsString(fields, 'image')
  if (primary && !primary.includes('unsplash.com')) return primary
  const arr = fields?.images?.arrayValue?.values
  if (Array.isArray(arr)) {
    for (const entry of arr) {
      const url = entry?.stringValue
      if (url && !url.includes('unsplash.com')) return url
    }
  }
  return ''
}

function toAbsoluteUrl(url) {
  if (!url) return DEFAULT_OG_IMAGE
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

async function fetchProductBySlugOrId(slugOrId) {
  const clean = String(slugOrId || '').trim()
  if (!clean) return null

  // 1. Try querying by `slug` field in Firestore
  try {
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
              value: { stringValue: clean },
            },
          },
          limit: 1,
        },
      }),
    })
    if (queryRes.ok) {
      const rows = await queryRes.json()
      const doc = Array.isArray(rows) ? rows.find((r) => r && r.document)?.document : null
      if (doc?.fields) {
        return { id: doc.name.split('/').pop(), fields: doc.fields }
      }
    }
  } catch {
    // Fall through to direct document lookup
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
    // Ignore
  }

  return null
}

export default async function handler(req, res) {
  const rawSlug = Array.isArray(req.query?.slug) ? req.query.slug[0] : req.query?.slug || ''
  const slug = String(rawSlug).trim()

  const found = await fetchProductBySlugOrId(slug)
  const fields = found?.fields || null

  const name = fields ? readFsString(fields, 'name') : ''
  const brand = fields ? readFsString(fields, 'brand') || 'Shop Noma' : 'Shop Noma'
  const finalPrice = fields ? readFsNumber(fields, 'finalPrice') : 0
  const stockQty = fields ? readFsNumber(fields, 'stockQty') : 0
  const rawDesc = fields ? readFsString(fields, 'description') : ''
  const productSlug = fields ? readFsString(fields, 'slug') || found.id : slug
  const productImage = fields ? toAbsoluteUrl(readFsFirstImage(fields)) : DEFAULT_OG_IMAGE

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
