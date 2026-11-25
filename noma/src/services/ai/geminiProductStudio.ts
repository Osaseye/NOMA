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
  usedKeyLabel?: string
  mockups: StudioMockupVariant[]
}

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
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

function base64ToFile(
  base64: string,
  mimeType: string,
  filename: string
): { file: File; previewUrl: string } {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const blob = new Blob([bytes], { type: mimeType })
  const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg'
  const file = new File([blob], `${filename}.${ext}`, { type: mimeType })
  const previewUrl = `data:${mimeType};base64,${base64}`
  return { file, previewUrl }
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
  const { base64, mimeType } = await fileToBase64(file)
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

  const promptText = `You are Noma Marketplace's senior product merchandiser and copywriter in Nigeria.
Analyze this raw shop product photo${adminNotes ? ` and the admin's notes: "${adminNotes}"` : ''}.
Available store categories: ${categoryListText || 'clothing, kitchen, electronics, appliances, phones, general'}.

Return ONLY a valid JSON object (no markdown fences) with these exact fields:
{
  "name": "Clean, commercial product title",
  "brand": "Detected or appropriate brand name",
  "category": "Exact category id from the available store categories",
  "subCategory": "Matching subcategory id if applicable, or empty string",
  "description": "Engaging 2-paragraph product write-up highlighting build quality, everyday use in Nigerian homes/wardrobes, and retail or wholesale bulk availability.",
  "keyFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
  "whatsInTheBox": ["Main product", "Factory packaging / accessories"],
  "badge": "Short merchandising badge like 'New Arrival', 'Best Seller', or 'Retail & Bulk'"
}`

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
    studioImages?: Array<{ id: string; label: string; data: string; mimeType: string }>
    studioImage?: { data: string; mimeType: string }
    usedKeyLabel?: string
  } | null

  if (!workerRes.ok || !payload) {
    throw new Error(
      payload?.error ||
        `Gemini Product Studio failed (HTTP ${workerRes.status}). Check your API keys in Admin → Settings.`
    )
  }

  const rawImages = Array.isArray(payload.studioImages) && payload.studioImages.length > 0
    ? payload.studioImages
    : payload.studioImage?.data
    ? [{ id: 'studio-hero', label: 'Studio Hero Shot', ...payload.studioImage }]
    : []

  if (rawImages.length === 0) {
    throw new Error(
      'Gemini did not return any studio images. Check billing/quota on your keys in Admin → Settings.'
    )
  }

  const cleanBaseName = file.name.replace(/\.[^/.]+$/, '') || 'product'
  const mockups: StudioMockupVariant[] = rawImages.map((img) => {
    const { file: imgFile, previewUrl } = base64ToFile(
      img.data,
      img.mimeType || 'image/png',
      `${cleanBaseName}-${img.id}`
    )
    return {
      id: img.id,
      label: img.label,
      file: imgFile,
      previewUrl,
    }
  })

  const parsedCopy = payload.copy || {}
  const defaultCat = categories[0]?.id || 'general'
  const matchedCat =
    categories.find((c) => c.id === parsedCopy.category)?.id || defaultCat

  return {
    name: parsedCopy.name || '',
    brand: parsedCopy.brand || 'Noma',
    category: matchedCat,
    subCategory: parsedCopy.subCategory || '',
    description: parsedCopy.description || '',
    keyFeatures: Array.isArray(parsedCopy.keyFeatures) ? parsedCopy.keyFeatures : [],
    whatsInTheBox: Array.isArray(parsedCopy.whatsInTheBox) ? parsedCopy.whatsInTheBox : [],
    badge: parsedCopy.badge || 'New Arrival',
    usedKeyLabel: payload.usedKeyLabel,
    mockups,
  }
}
