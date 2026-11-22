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
    'firebase'
  ).toLowerCase()

  if (providerType === 'cloudflare_r2') {
    const endpoint =
      settings.cloudflareUploadEndpoint || import.meta.env.VITE_CLOUDFLARE_UPLOAD_ENDPOINT
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
    let resolvedType = 'firebase'
    try {
      // Dynamically import store at runtime to avoid circular dependency with adminStore
      const { useAdminStore } = await import('../../store/adminStore')
      const storeSettings = useAdminStore.getState().settings
      const { providerType, provider } = resolveProvider(storeSettings)
      resolvedType = providerType

      return await provider.uploadImage(file, folder)
    } catch (err: unknown) {
      const canFallback = resolvedType !== 'cloudflare_r2' || import.meta.env.DEV
      if (!canFallback) {
        throw err
      }
      console.warn(
        'Remote storage upload failed or endpoint unavailable. Falling back to compressed client-side image:',
        err
      )
      // Fail-safe: compress image to <100KB JPEG data URL so local dev or fallback writes succeed cleanly
      return await compressImageFile(file, 800, 0.75)
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
