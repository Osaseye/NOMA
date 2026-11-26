import type { Category } from '../../types/commerce'

export interface GeminiProductStudioResult {
  name: string
  brand: string
  category: string
  subCategory?: string
  description: string
  keyFeatures: string[]
  whatsInTheBox: string[]
  badge: string
  qualityStatus?: string
  usedKeyLabel?: string
  usedModel?: string
}

function fileToBase64(file: File | Blob): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const commaIdx = result.indexOf(',')
      const base64 = commaIdx >= 0 ? result.slice(commaIdx + 1) : result
      resolve({ base64, mimeType: file.type || 'image/jpeg' })
    }
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Scans the uploaded product photo with Gemini 3.5 Flash (via noma-r2-api 4-key smart shuffle)
 * and generates clean, commercial product title, brand, category, description, key features,
 * and box contents — without altering or cropping the photo.
 */
export async function runGeminiProductStudio({
  file,
  adminNotes,
  categories,
  apiKey,
  extraApiKeys = [],
}: {
  file: File
  adminNotes?: string
  categories: Category[]
  apiKey?: string
  extraApiKeys?: string[]
}): Promise<GeminiProductStudioResult> {
  const categoryListText = categories
    .map((c) => {
      const subs = (c.subcategories || []).map((s) => s.id).join(', ')
      return `${c.id} (${c.label}${subs ? ` -> subcategories: ${subs}` : ''})`
    })
    .join('; ')

  const combinedExtraKeys = [
    ...(apiKey ? [apiKey.trim()] : []),
    ...extraApiKeys.map((k) => k.trim()).filter(Boolean),
  ].filter(Boolean)

  const promptText = `You are Noma Marketplace's senior product merchandiser in Nigeria.
Look carefully at this product photo${adminNotes ? ` and the admin's notes: "${adminNotes}"` : ''}.
Write clean, commercial, ready-to-publish product details for our Nigerian retail & wholesale store.
Available store categories: ${categoryListText || 'clothing, kitchen, electronics, appliances, phones, general'}.

Return ONLY a valid JSON object (no markdown fences) with these exact fields:
{
  "qualityStatus": "Short 1-sentence note confirming what product is shown",
  "name": "Clean, commercial product title",
  "brand": "Detected brand or 'Noma Select'",
  "category": "Exact category id from the available store categories",
  "subCategory": "Matching subcategory id if applicable, or empty string",
  "description": "Detailed, engaging 2-paragraph product write-up covering materials, build quality, everyday use in Nigeria, and retail or wholesale bulk availability.",
  "keyFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "whatsInTheBox": ["1 x Main Product", "Protective Packaging"],
  "badge": "Short merchandising badge like 'New Arrival', 'Best Seller', or 'Retail & Bulk'"
}`

  const { base64, mimeType } = await fileToBase64(file)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (combinedExtraKeys.length > 0) {
    headers['X-Gemini-Api-Keys'] = combinedExtraKeys.join(',')
  }

  const workerRes = await fetch(
    'https://noma-r2-api.inventra.workers.dev/api/ai/product-studio',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        imageBase64: base64,
        mimeType,
        adminNotes: adminNotes || '',
        prompt: promptText,
      }),
    }
  )

  const payload = (await workerRes.json().catch(() => null)) as {
    error?: string
    copy?: Partial<GeminiProductStudioResult>
    usedKeyLabel?: string
    usedModel?: string
  } | null

  if (!workerRes.ok || !payload) {
    throw new Error(
      payload?.error ||
        `Gemini scan failed (HTTP ${workerRes.status}). Check your API keys in Admin → Settings.`
    )
  }

  const parsedCopy = payload.copy || {}
  const defaultCat = categories[0]?.id || 'general'
  const matchedCat =
    categories.find((c) => c.id === parsedCopy.category)?.id || defaultCat

  return {
    name: parsedCopy.name || '',
    brand: parsedCopy.brand || 'Noma Select',
    category: matchedCat,
    subCategory: parsedCopy.subCategory || '',
    description: parsedCopy.description || '',
    keyFeatures: Array.isArray(parsedCopy.keyFeatures) ? parsedCopy.keyFeatures : [],
    whatsInTheBox: Array.isArray(parsedCopy.whatsInTheBox) ? parsedCopy.whatsInTheBox : [],
    badge: parsedCopy.badge || 'New Arrival',
    qualityStatus: parsedCopy.qualityStatus,
    usedKeyLabel: payload.usedKeyLabel,
    usedModel: payload.usedModel,
  }
}
