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

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to decode product photo'))
    img.src = src
  })
}

/**
 * Strips the outer background (messy shop background OR pure white studio backdrop)
 * into a true transparent PNG cutout (`alpha = 0`), with edge feathering so the product
 * sits directly on ANY card surface with zero rectangular box around it.
 */
function isolateToTransparentCanvas(
  img: HTMLImageElement,
  isWhiteBackdrop: boolean
): HTMLCanvasElement {
  const workW = Math.min(720, Math.max(320, img.width))
  const workH = Math.max(1, Math.round((img.height / Math.max(1, img.width)) * workW))
  const maskCanvas = document.createElement('canvas')
  maskCanvas.width = workW
  maskCanvas.height = workH
  const maskCtx = maskCanvas.getContext('2d')!
  maskCtx.drawImage(img, 0, 0, workW, workH)

  const imgData = maskCtx.getImageData(0, 0, workW, workH)
  const data = imgData.data

  const visited = new Uint8Array(workW * workH)
  const queue = new Int32Array(workW * workH)
  let head = 0
  let tail = 0
  const threshold = isWhiteBackdrop ? 38 : 54

  const pushIfBg = (x: number, y: number, refR: number, refG: number, refB: number) => {
    if (x < 0 || x >= workW || y < 0 || y >= workH) return
    const p = y * workW + x
    if (visited[p]) return
    const idx = p * 4
    const r = data[idx]
    const g = data[idx + 1]
    const b = data[idx + 2]
    const dist = Math.hypot(r - refR, g - refG, b - refB)
    const isNearWhite = isWhiteBackdrop && r > 236 && g > 236 && b > 236
    if (dist < threshold || isNearWhite) {
      visited[p] = 1
      queue[tail++] = p
    }
  }

  for (let x = 0; x < workW; x++) {
    const topIdx = x * 4
    pushIfBg(x, 0, data[topIdx], data[topIdx + 1], data[topIdx + 2])
    const botIdx = ((workH - 1) * workW + x) * 4
    pushIfBg(x, workH - 1, data[botIdx], data[botIdx + 1], data[botIdx + 2])
  }
  for (let y = 0; y < workH; y++) {
    const leftIdx = y * workW * 4
    pushIfBg(0, y, data[leftIdx], data[leftIdx + 1], data[leftIdx + 2])
    const rightIdx = (y * workW + (workW - 1)) * 4
    pushIfBg(workW - 1, y, data[rightIdx], data[rightIdx + 1], data[rightIdx + 2])
  }

  while (head < tail) {
    const curr = queue[head++]
    const cx = curr % workW
    const cy = (curr - cx) / workW
    const cIdx = curr * 4
    const cr = data[cIdx]
    const cg = data[cIdx + 1]
    const cb = data[cIdx + 2]

    if (!isWhiteBackdrop) {
      const normX = Math.abs(cx / workW - 0.5) * 2
      const normY = Math.abs(cy / workH - 0.5) * 2
      if (normX < 0.34 && normY < 0.34) continue
    }

    pushIfBg(cx + 1, cy, cr, cg, cb)
    pushIfBg(cx - 1, cy, cr, cg, cb)
    pushIfBg(cx, cy + 1, cr, cg, cb)
    pushIfBg(cx, cy - 1, cr, cg, cb)
  }

  // Apply transparent alpha to removed background and subtle edge feathering
  for (let p = 0; p < workW * workH; p++) {
    if (visited[p]) {
      data[p * 4 + 3] = 0
    } else {
      const cx = p % workW
      const cy = (p - cx) / workW
      let bgNeighbors = 0
      if (cx > 0 && visited[p - 1]) bgNeighbors++
      if (cx < workW - 1 && visited[p + 1]) bgNeighbors++
      if (cy > 0 && visited[p - workW]) bgNeighbors++
      if (cy < workH - 1 && visited[p + workW]) bgNeighbors++
      if (bgNeighbors >= 2) {
        data[p * 4 + 3] = Math.round(data[p * 4 + 3] * 0.45)
      }
    }
  }

  maskCtx.putImageData(imgData, 0, 0)
  return maskCanvas
}

/**
 * Generates 3 true transparent-background PNG cutouts (`image/png`, NO white rectangle)
 * so every product floats directly on any Noma card or page surface.
 */
async function generateTransparentStudioMockupFiles(
  rawFile: File,
  aiGeneratedBase64?: { data: string; mimeType: string }
): Promise<StudioMockupVariant[]> {
  const objectUrl = URL.createObjectURL(rawFile)
  try {
    const rawImg = await loadImageElement(objectUrl)
    const rawCutout = isolateToTransparentCanvas(rawImg, false)

    let aiCutout: HTMLCanvasElement | undefined
    if (aiGeneratedBase64) {
      try {
        const aiImg = await loadImageElement(
          `data:${aiGeneratedBase64.mimeType};base64,${aiGeneratedBase64.data}`
        )
        aiCutout = isolateToTransparentCanvas(aiImg, true)
      } catch {
        aiCutout = undefined
      }
    }

    const size = 1024

    const renderTransparentVariant = async (
      id: string,
      label: string,
      sourceCanvas: HTMLCanvasElement,
      fillRatio: number,
      dropShadow: boolean
    ): Promise<StudioMockupVariant> => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!

      // Pure transparent background (rgba(0,0,0,0)) — ZERO white box!
      ctx.clearRect(0, 0, size, size)

      const scale = Math.min(
        (size * fillRatio) / sourceCanvas.width,
        (size * fillRatio) / sourceCanvas.height
      )
      const drawW = Math.round(sourceCanvas.width * scale)
      const drawH = Math.round(sourceCanvas.height * scale)
      const drawX = Math.round((size - drawW) / 2)
      const drawY = Math.round((size - drawH) / 2)

      ctx.save()
      if (dropShadow) {
        ctx.shadowColor = 'rgba(15, 23, 42, 0.14)'
        ctx.shadowBlur = 24
        ctx.shadowOffsetY = 14
      }
      ctx.drawImage(sourceCanvas, drawX, drawY, drawW, drawH)
      ctx.restore()

      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Failed to encode transparent PNG'))),
          'image/png'
        )
      })

      const cleanBaseName = rawFile.name.replace(/\.[^/.]+$/, '') || 'product'
      const file = new File([blob], `${cleanBaseName}-${id}.png`, { type: 'image/png' })
      const previewUrl = canvas.toDataURL('image/png')
      return { id, label, file, previewUrl }
    }

    const primarySource = aiCutout || rawCutout

    return [
      await renderTransparentVariant(
        'cutout-primary',
        'Transparent Cutout (Main)',
        primarySource,
        0.82,
        true
      ),
      await renderTransparentVariant(
        'cutout-flat',
        'Pure No-Shadow Cutout',
        primarySource,
        0.78,
        false
      ),
      await renderTransparentVariant(
        'cutout-detail',
        'Close-Up Transparent Cutout',
        rawCutout,
        0.92,
        true
      ),
    ]
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
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

  let parsedCopy: Partial<GeminiProductStudioResult> | null = null
  let aiImagePart: { data: string; mimeType: string } | undefined
  let usedKeyLabel: string | undefined

  try {
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
    if (workerRes.ok) {
      const workerJson = (await workerRes.json()) as {
        copy?: Partial<GeminiProductStudioResult>
        studioImage?: { data: string; mimeType: string }
        usedKeyLabel?: string
      }
      if (workerJson.copy) parsedCopy = workerJson.copy
      if (workerJson.studioImage) aiImagePart = workerJson.studioImage
      if (workerJson.usedKeyLabel) usedKeyLabel = workerJson.usedKeyLabel
    }
  } catch {
    // Fallback to local transparent studio isolation if offline
  }

  // Generate 3 true transparent-background PNG cutouts (zero white box!)
  const mockups = await generateTransparentStudioMockupFiles(file, aiImagePart)

  const rawHint =
    (adminNotes || '').trim() ||
    file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

  const defaultCat = categories[0]?.id || 'clothing'
  const matchedCat =
    categories.find(
      (c) =>
        c.id === parsedCopy?.category ||
        rawHint.toLowerCase().includes(c.id.toLowerCase()) ||
        rawHint.toLowerCase().includes(c.label.toLowerCase().split(' ')[0])
    )?.id || defaultCat

  const titleFallback =
    parsedCopy?.name ||
    (rawHint && !/^img|dsc|photo|image|whatsapp/i.test(rawHint)
      ? rawHint
      : 'Premium Studio Edition Product')

  const brandFallback =
    parsedCopy?.brand ||
    titleFallback.split(' ')[0] ||
    'Noma Select'

  const descriptionFallback =
    parsedCopy?.description ||
    `${titleFallback} is built for reliable everyday performance and clean contemporary styling. Sourced directly through Noma's verified supply partners and inspected for quality prior to dispatch.${
      adminNotes ? `\n\nAdditional Details: ${adminNotes.trim()}` : ''
    }\n\nAvailable for both single-unit retail delivery and wholesale bulk orders across all 36 Nigerian states and FCT Abuja.`

  return {
    name: titleFallback,
    brand: brandFallback,
    category: matchedCat,
    subCategory: parsedCopy?.subCategory || '',
    description: descriptionFallback,
    keyFeatures:
      Array.isArray(parsedCopy?.keyFeatures) && parsedCopy.keyFeatures.length > 0
        ? parsedCopy.keyFeatures
        : [
            'Authentic quality verified before dispatch',
            'Available for single retail orders and wholesale bulk quantities',
            'Fast nationwide doorstep delivery across Nigeria',
            'Protective factory packaging included',
          ],
    whatsInTheBox:
      Array.isArray(parsedCopy?.whatsInTheBox) && parsedCopy.whatsInTheBox.length > 0
        ? parsedCopy.whatsInTheBox
        : [`1 x ${titleFallback}`, 'Protective Factory Packaging'],
    badge: parsedCopy?.badge || 'New Arrival',
    usedKeyLabel,
    mockups,
  }
}
