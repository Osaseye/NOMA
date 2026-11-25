import type { Category } from '../../types/commerce'

export interface StudioMockupVariant {
  id: string
  label: string
  file: File
  previewUrl: string
}

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
  mockups: StudioMockupVariant[]
}

function fileToBase64(file: File | Blob): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const commaIdx = result.indexOf(',')
      const base64 = commaIdx >= 0 ? result.slice(commaIdx + 1) : result
      resolve({ base64, mimeType: file.type || 'image/png' })
    }
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to preview transparent PNG'))
    reader.readAsDataURL(blob)
  })
}

/**
 * Runs real neural-network AI background removal (@imgly/background-removal ONNX model)
 * in the admin's browser to strip any messy shop background into a clean transparent PNG.
 * Dynamically imported so storefront visitors never download the segmentation runtime.
 */
async function removeBackgroundWithNeuralAI(rawFile: File): Promise<StudioMockupVariant[]> {
  const { removeBackground } = await import('@imgly/background-removal')

  const transparentBlob = await removeBackground(rawFile, {
    model: 'isnet_fp16',
    output: {
      format: 'image/png',
      quality: 0.95,
    },
  })

  const cleanBaseName = rawFile.name.replace(/\.[^/.]+$/, '') || 'product'
  const transparentFile = new File(
    [transparentBlob],
    `${cleanBaseName}-transparent.png`,
    { type: 'image/png' }
  )
  const previewUrl = await blobToDataUrl(transparentBlob)

  return [
    {
      id: 'neural-transparent',
      label: 'AI Transparent Cutout (No Background)',
      file: transparentFile,
      previewUrl,
    },
  ]
}

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

  const promptText = `You are Noma Marketplace's senior product merchandiser and quality inspector in Nigeria.
Scan this product photo${adminNotes ? ` and the admin's notes: "${adminNotes}"` : ''}.
1. Inspect the image to make sure the product is clear and ready for listing.
2. Write clean, commercial, ready-to-paste product details for our Nigerian retail & wholesale store.
Available store categories: ${categoryListText || 'clothing, kitchen, electronics, appliances, phones, general'}.

Return ONLY a valid JSON object (no markdown fences) with these exact fields:
{
  "qualityStatus": "Short 1-sentence visual quality check (e.g. 'Clear product image, ready for storefront')",
  "name": "Clean, commercial product title",
  "brand": "Detected brand or 'Noma Select'",
  "category": "Exact category id from the available store categories",
  "subCategory": "Matching subcategory id if applicable, or empty string",
  "description": "Detailed, engaging 2-paragraph product write-up covering materials, build quality, everyday/event use in Nigeria, and retail or wholesale bulk availability.",
  "keyFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "whatsInTheBox": ["1 x Main Product", "Protective Packaging"],
  "badge": "Short merchandising badge like 'New Arrival', 'Best Seller', or 'Retail & Bulk'"
}`

  // Run neural-network background removal AND Gemini 3.5 Flash scan in parallel!
  const [{ base64, mimeType }, mockups] = await Promise.all([
    fileToBase64(file),
    removeBackgroundWithNeuralAI(file),
  ])

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
    mockups,
  }
}
