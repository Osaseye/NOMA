/**
 * Helper to compress image files into small, high-quality Base64 Data URLs (<100KB)
 * as a fail-safe fallback if remote Cloud Storage is unauthorized or unavailable.
 */
export async function compressImageFile(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = (err) => reject(err)
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = (err) => reject(err)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(e.target?.result as string)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}
