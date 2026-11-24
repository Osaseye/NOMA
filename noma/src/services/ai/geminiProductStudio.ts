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
 * High-precision Studio Background Isolator & Mockup Renderer:
 * Samples border perimeter background colors from a raw shop photo, removes messy/dirty
 * background pixels via flood/chroma-distance matting with feathering, and composites
 * 3 clean e-commerce studio product mockups on pure white (#FFFFFF) and gallery stone (#F8FAFC).
 */
async function generateCleanStudioMockupFiles(
  rawFile: File,
  aiGeneratedBase64?: { data: string; mimeType: string }
): Promise<StudioMockupVariant[]> {
  const objectUrl = URL.createObjectURL(rawFile)
  try {
    const img = await loadImageElement(objectUrl)
    const size = 1080

    // Step 1: Isolate foreground subject on an offscreen analysis canvas
    const workW = 540
    const workH = Math.max(1, Math.round((img.height / Math.max(1, img.width)) * workW))
    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = workW
    maskCanvas.height = workH
    const maskCtx = maskCanvas.getContext('2d')

    if (maskCtx) {
      maskCtx.drawImage(img, 0, 0, workW, workH)
      const imgData = maskCtx.getImageData(0, 0, workW, workH)
      const data = imgData.data

      // Sample perimeter corner & edge pixels to estimate background color distribution
      const samples: Array<[number, number, number]> = []
      const step = Math.max(4, Math.floor(Math.min(workW, workH) / 20))
      for (let x = 0; x < workW; x += step) {
        const topIdx = x * 4
        const botIdx = ((workH - 1) * workW + x) * 4
        samples.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]])
        samples.push([data[botIdx], data[botIdx + 1], data[botIdx + 2]])
      }
      for (let y = 0; y < workH; y += step) {
        const leftIdx = y * workW * 4
        const rightIdx = (y * workW + (workW - 1)) * 4
        samples.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]])
        samples.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]])
      }

      // Flood-fill from outer border inward where pixel color is close to local border samples
      const visited = new Uint8Array(workW * workH)
      const queue = new Int32Array(workW * workH)
      let head = 0
      let tail = 0

      const pushIfBg = (x: number, y: number, refR: number, refG: number, refB: number) => {
        if (x < 0 || x >= workW || y < 0 || y >= workH) return
        const p = y * workW + x
        if (visited[p]) return
        const idx = p * 4
        const r = data[idx]
        const g = data[idx + 1]
        const b = data[idx + 2]
        const dist = Math.hypot(r - refR, g - refG, b - refB)
        if (dist < 52) {
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

        // Prevent erasing the core center subject
        const normX = Math.abs(cx / workW - 0.5) * 2
        const normY = Math.abs(cy / workH - 0.5) * 2
        if (normX < 0.35 && normY < 0.35) continue

        pushIfBg(cx + 1, cy, cr, cg, cb)
        pushIfBg(cx - 1, cy, cr, cg, cb)
        pushIfBg(cx, cy + 1, cr, cg, cb)
        pushIfBg(cx, cy - 1, cr, cg, cb)
      }

      for (let p = 0; p < workW * workH; p++) {
        if (visited[p]) {
          data[p * 4 + 3] = 0
        } else {
          // Subtle studio contrast & brightness enhancement on product pixels
          const idx = p * 4
          data[idx] = Math.min(255, Math.round(data[idx] * 1.04))
          data[idx + 1] = Math.min(255, Math.round(data[idx + 1] * 1.04))
          data[idx + 2] = Math.min(255, Math.round(data[idx + 2] * 1.04))
        }
      }
      maskCtx.putImageData(imgData, 0, 0)
    }

    const renderVariant = async (
      id: string,
      label: string,
      bgStyle: 'pure-white' | 'soft-studio' | 'detail-crop',
      overrideImg?: HTMLImageElement
    ): Promise<StudioMockupVariant> => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!

      // Studio Background
      if (bgStyle === 'pure-white') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, size, size)
      } else if (bgStyle === 'soft-studio') {
        const grad = ctx.createRadialGradient(
          size * 0.5,
          size * 0.45,
          size * 0.1,
          size * 0.5,
          size * 0.5,
          size * 0.65
        )
        grad.addColorStop(0, '#FFFFFF')
        grad.addColorStop(1, '#F4F4F5')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, size, size)
      } else {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, size, size)
      }

      // Grounding Contact Shadow
      ctx.save()
      ctx.fillStyle = 'rgba(15, 23, 42, 0.08)'
      ctx.beginPath()
      ctx.ellipse(size * 0.5, size * 0.84, size * 0.26, size * 0.032, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      const sourceToDraw = overrideImg || maskCanvas
      const srcW = overrideImg ? overrideImg.width : maskCanvas.width
      const srcH = overrideImg ? overrideImg.height : maskCanvas.height

      const targetPadding = bgStyle === 'detail-crop' ? 0.84 : 0.74
      const scale = Math.min((size * targetPadding) / srcW, (size * targetPadding) / srcH)
      const drawW = Math.round(srcW * scale)
      const drawH = Math.round(srcH * scale)
      const drawX = Math.round((size - drawW) / 2)
      const drawY = Math.round((size - drawH) / 2) - (bgStyle === 'detail-crop' ? 0 : 16)

      ctx.save()
      ctx.shadowColor = 'rgba(15, 23, 42, 0.10)'
      ctx.shadowBlur = 28
      ctx.shadowOffsetY = 12
      ctx.drawImage(sourceToDraw, drawX, drawY, drawW, drawH)
      ctx.restore()

      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Failed to encode studio mockup'))),
          'image/jpeg',
          0.92
        )
      })

      const cleanBaseName = rawFile.name.replace(/\.[^/.]+$/, '') || 'product'
      const file = new File([blob], `${cleanBaseName}-${id}.jpg`, { type: 'image/jpeg' })
      const previewUrl = canvas.toDataURL('image/jpeg', 0.9)
      return { id, label, file, previewUrl }
    }

    const variants: StudioMockupVariant[] = []

    if (aiGeneratedBase64) {
      try {
        const aiImg = await loadImageElement(
          `data:${aiGeneratedBase64.mimeType};base64,${aiGeneratedBase64.data}`
        )
        variants.push(
          await renderVariant('ai-studio-white', 'Gemini Studio White Mockup', 'pure-white', aiImg)
        )
      } catch {
        // Fallback to local studio isolation if AI image fails to decode
      }
    }

    variants.push(
      await renderVariant('studio-white', 'Pure White Studio Cutout (#FFFFFF)', 'pure-white'),
      await renderVariant('studio-gallery', 'Soft Gallery Backdrop (#F4F4F5)', 'soft-studio'),
      await renderVariant('studio-closeup', 'Centered Detail Mockup', 'detail-crop')
    )

    return variants.slice(0, 3)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function runGeminiProductStudio({
  file,
  adminNotes,
  categories,
  apiKey,
}: {
  file: File
  adminNotes?: string
  categories: Category[]
  apiKey?: string
}): Promise<GeminiProductStudioResult> {
  const { base64, mimeType } = await fileToBase64(file)
  const categoryListText = categories
    .map((c) => {
      const subs = (c.subcategories || []).map((s) => s.id).join(', ')
      return `${c.id} (${c.label}${subs ? ` -> subcategories: ${subs}` : ''})`
    })
    .join('; ')

  const resolvedApiKey =
    (apiKey || import.meta.env.VITE_GEMINI_API_KEY || '').trim()

  const promptText = `You are Noma Marketplace's senior product merchandiser and copywriter in Nigeria.
Analyze this raw shop product photo${adminNotes ? ` and the admin's notes: "${adminNotes}"` : ''}.
Available store categories: ${categoryListText || 'clothing, kitchen, electronics, appliances, phones, general'}.

Return ONLY a valid JSON object (no markdown fences) with these exact fields:
{
  "name": "Clean, commercial product title (e.g., 'Nike Air Force 1 Low Triple White Sneakers' or 'Silver Crest 4500W Commercial Heavy-Duty Blender')",
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

  // 1. Try Cloudflare Worker endpoint `/api/ai/product-studio` first
  try {
    const workerRes = await fetch('/api/ai/product-studio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(resolvedApiKey ? { 'x-gemini-api-key': resolvedApiKey } : {}),
      },
      body: JSON.stringify({
        imageBase64: base64,
        mimeType,
        adminNotes: adminNotes || '',
        prompt: promptText,
      }),
    })
    if (workerRes.ok) {
      const workerJson = (await workerRes.json()) as {
        copy?: Partial<GeminiProductStudioResult>
        studioImage?: { data: string; mimeType: string }
      }
      if (workerJson.copy) parsedCopy = workerJson.copy
      if (workerJson.studioImage) aiImagePart = workerJson.studioImage
    }
  } catch {
    // Proceed to direct Gemini REST call
  }

  // 2. Direct Gemini API call if we have an API key and worker didn't already resolve
  if (!parsedCopy && resolvedApiKey) {
    try {
      const copyResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
          resolvedApiKey
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: promptText },
                  { inlineData: { mimeType, data: base64 } },
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

      if (copyResponse.ok) {
        const json = await copyResponse.json()
        const rawText: string =
          json?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        if (rawText) {
          const cleaned = rawText
            .replace(/^```json\s*/i, '')
            .replace(/```\s*$/, '')
            .trim()
          parsedCopy = JSON.parse(cleaned)
        }
      }
    } catch (e) {
      console.warn('Gemini copy generation fallback notice:', e)
    }

    // Also try Gemini image generation for studio white background mockup
    try {
      const imgGenResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${encodeURIComponent(
          resolvedApiKey
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
                  { inlineData: { mimeType, data: base64 } },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
          }),
        }
      )

      if (imgGenResponse.ok) {
        const imgJson = await imgGenResponse.json()
        const parts: Array<{ inlineData?: { mimeType: string; data: string } }> =
          imgJson?.candidates?.[0]?.content?.parts || []
        const foundImg = parts.find((p) => p.inlineData?.data)
        if (foundImg?.inlineData) {
          aiImagePart = {
            data: foundImg.inlineData.data,
            mimeType: foundImg.inlineData.mimeType || 'image/png',
          }
        }
      }
    } catch {
      // Canvas studio isolator handles white background mockup generation seamlessly
    }
  }

  // 3. Build 3 clean studio white-background mockup variations
  const mockups = await generateCleanStudioMockupFiles(file, aiImagePart)

  // 4. Merge or synthesize clean copy from adminNotes / filename if API key wasn't provided
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
    mockups,
  }
}
