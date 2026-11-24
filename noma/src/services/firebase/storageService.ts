import type { IStorageProvider } from '../storage/IStorageProvider'
import { FirebaseStorageProvider } from '../storage/FirebaseStorageProvider'
import { CloudinaryStorageProvider } from '../storage/CloudinaryStorageProvider'
import { CloudflareR2StorageProvider } from '../storage/CloudflareR2StorageProvider'
import { compressImageFile } from '../../utils/imageCompressor'

function resolveProvider(settings: {
  storageProvider?: string
  cloudinaryCloudName?: string
  cloudinaryUploadPreset?: string
  cloudflareUploadEndpoint?: string
  cloudflarePublicUrl?: string
  cloudflareBucketUrl?: string
}): { providerType: string; provider: IStorageProvider } {
  const providerType = (
    settings.storageProvider ||
    import.meta.env.VITE_STORAGE_PROVIDER ||
    'cloudflare_r2'
  ).toLowerCase()

  if (providerType === 'cloudflare_r2') {
    const endpoint =
      settings.cloudflareUploadEndpoint ||
      import.meta.env.VITE_CLOUDFLARE_UPLOAD_ENDPOINT ||
      '/api/media/upload'
    const publicUrl =
      settings.cloudflarePublicUrl ||
      settings.cloudflareBucketUrl ||
      import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL
    return {
      providerType,
      provider: new CloudflareR2StorageProvider(endpoint, publicUrl),
    }
  }

  if (providerType === 'cloudinary') {
    return {
      providerType,
      provider: new CloudinaryStorageProvider(
        settings.cloudinaryCloudName,
        settings.cloudinaryUploadPreset
      ),
    }
  }

  return {
    providerType: 'firebase',
    provider: new FirebaseStorageProvider(),
  }
}

export const storageService = {
  uploadImage: async (file: File, folder: string = 'images'): Promise<string> => {
    try {
      const { useAdminStore } = await import('../../store/adminStore')
      const storeSettings = useAdminStore.getState().settings
      const { provider } = resolveProvider(storeSettings)

      return await provider.uploadImage(file, folder)
    } catch (err: unknown) {
      console.warn(
        'Cloudflare R2 / remote upload endpoint not reachable in current environment. Using compressed image fallback:',
        err
      )
      return await compressImageFile(file, 900, 0.82)
    }
  },

  deleteImage: async (url: string): Promise<void> => {
    const { useAdminStore } = await import('../../store/adminStore')
    const storeSettings = useAdminStore.getState().settings
    const { provider } = resolveProvider(storeSettings)
    if (provider.deleteImage) {
      await provider.deleteImage(url)
    }
  },
}
