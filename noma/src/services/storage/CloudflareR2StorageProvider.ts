import type { IStorageProvider } from './IStorageProvider'
import { authService } from '../firebase/authService'

interface UploadResponsePayload {
  url?: string
  key?: string
  error?: string
  message?: string
}

function encodeKeySegments(key: string): string {
  return key
    .split('/')
    .filter((segment) => segment.length > 0 && segment !== '..' && segment !== '.')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function extractObjectKey(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed || trimmed.startsWith('data:')) {
    return null
  }

  let pathname: string
  try {
    const parsed = new URL(trimmed, 'https://shopnoma.com')
    pathname = parsed.pathname
  } catch {
    pathname = trimmed
  }

  const normalized = pathname.replace(/^\/+/, '')
  if (normalized.startsWith('media/')) {
    return normalized.slice('media/'.length) || null
  }
  return normalized || null
}

/**
 * Storage provider backed by Noma's Cloudflare Worker + R2 bucket endpoints.
 */
export class CloudflareR2StorageProvider implements IStorageProvider {
  private readonly uploadEndpoint: string
  private readonly publicBaseUrl: string

  constructor(uploadEndpoint?: string, publicBaseUrl?: string) {
    const endpoint =
      uploadEndpoint?.trim() ||
      import.meta.env.VITE_CLOUDFLARE_UPLOAD_ENDPOINT ||
      '/api/media/upload'
    this.uploadEndpoint = endpoint.replace(/\/+$/, '')

    const rawPublic =
      publicBaseUrl?.trim() ||
      import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL ||
      'https://pub-104edba51a2647c881c1c4db7f453fa7.r2.dev'
    this.publicBaseUrl = rawPublic.replace(/\/+$/, '')
  }

  async uploadImage(file: File, folder: string = 'products'): Promise<string> {
    const token = await authService.getCurrentIdToken()
    if (!token) {
      throw new Error('Authentication required to upload media to Cloudflare R2. Please sign in.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await fetch(this.uploadEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const payload = (await response.json().catch(() => null)) as UploadResponsePayload | null

    if (!response.ok) {
      const reason =
        payload?.error ||
        payload?.message ||
        `Cloudflare R2 upload failed with status ${response.status}`
      throw new Error(reason)
    }

    if (this.publicBaseUrl && payload?.key) {
      return `${this.publicBaseUrl}/${payload.key.replace(/^\/+/, '')}`
    }

    if (payload?.url) {
      return payload.url
    }

    if (payload?.key) {
      return `/media/${payload.key.replace(/^\/+/, '')}`
    }

    throw new Error('Cloudflare R2 upload completed without returning a media URL.')
  }

  async deleteImage(url: string): Promise<void> {
    const key = extractObjectKey(url)
    if (!key) {
      return
    }

    const token = await authService.getCurrentIdToken()
    if (!token) {
      throw new Error('Authentication required to delete media from Cloudflare R2.')
    }

    const encodedKey = encodeKeySegments(key)
    const deleteBase = this.uploadEndpoint.endsWith('/upload')
      ? this.uploadEndpoint.slice(0, -'/upload'.length)
      : this.uploadEndpoint
    const deleteUrl = `${deleteBase}/${encodedKey}`

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok && response.status !== 404) {
      const payload = (await response.json().catch(() => null)) as UploadResponsePayload | null
      throw new Error(
        payload?.error || payload?.message || `Failed to delete R2 object (${response.status})`
      )
    }
  }
}
