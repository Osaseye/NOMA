import { CloudflareR2StorageProvider } from '../storage/CloudflareR2StorageProvider'
import { compressImageFile } from '../../utils/imageCompressor'

function resolveR2Provider(settings: {
  cloudflareUploadEndpoint?: string
  cloudflarePublicUrl?: string
  cloudflareBucketUrl?: string
}): CloudflareR2StorageProvider {
  const rawEndpoint =
    settings.cloudflareUploadEndpoint ||
    import.meta.env.VITE_CLOUDFLARE_UPLOAD_ENDPOINT ||
    'https://noma-r2-api.inventra.workers.dev/api/media/upload'
  const endpoint =
    rawEndpoint === '/api/media/upload'
      ? 'https://noma-r2-api.inventra.workers.dev/api/media/upload'
      : rawEndpoint
  const publicUrl =
    settings.cloudflarePublicUrl ||
    settings.cloudflareBucketUrl ||
    import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL ||
    ''

  return new CloudflareR2StorageProvider(endpoint, publicUrl)
}

export const storageService = {
  uploadImage: async (file: File, folder: string = 'products'): Promise<string> => {
    try {
      const { useAdminStore } = await import('../../store/adminStore')
      const storeSettings = useAdminStore.getState().settings
      const provider = resolveR2Provider(storeSettings)

      return await provider.uploadImage(file, folder)
    } catch (err: unknown) {
      if (!import.meta.env.DEV) {
        throw err
      }
      console.warn(
        'Cloudflare R2 upload endpoint unreachable in local Vite dev mode (run `cf dev` to test live R2 uploads). Using local compressed image fallback:',
        err
      )
      return await compressImageFile(file, 900, 0.82)
    }
  },

  deleteImage: async (url: string): Promise<void> => {
    const trimmed = url.trim()
    if (
      !trimmed ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('/images/') ||
      trimmed.includes('firebasestorage.googleapis.com')
    ) {
      return
    }
    try {
      const { useAdminStore } = await import('../../store/adminStore')
      const storeSettings = useAdminStore.getState().settings
      const provider = resolveR2Provider(storeSettings)
      await provider.deleteImage(trimmed)
    } catch (err) {
      // Non-critical media cleanup should never fail product/record deletion
      console.warn('Non-critical R2 media cleanup skipped:', err)
    }
  },
}
