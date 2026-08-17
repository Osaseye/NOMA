import type { IStorageProvider } from '../storage/IStorageProvider'
import { FirebaseStorageProvider } from '../storage/FirebaseStorageProvider'
import { CloudinaryStorageProvider } from '../storage/CloudinaryStorageProvider'
import { compressImageFile } from '../../utils/imageCompressor'

export const storageService = {
  uploadImage: async (file: File, folder: string = 'images'): Promise<string> => {
    try {
      // Dynamically import store at runtime
      const { useAdminStore } = await import('../../store/adminStore')
      const storeSettings = useAdminStore.getState().settings
      const providerType = storeSettings.storageProvider || import.meta.env.VITE_STORAGE_PROVIDER || 'firebase'

      let provider: IStorageProvider
      if (providerType.toLowerCase() === 'cloudinary') {
        provider = new CloudinaryStorageProvider(
          storeSettings.cloudinaryCloudName,
          storeSettings.cloudinaryUploadPreset
        )
      } else {
        provider = new FirebaseStorageProvider()
      }

      return await provider.uploadImage(file, folder)
    } catch (err: any) {
      console.warn('Remote storage upload failed or unauthorized. Falling back to compressed client-side image:', err)
      // Fail-safe: compress image to <100KB JPEG data URL so Firestore setDoc succeeds cleanly
      return await compressImageFile(file, 800, 0.75)
    }
  },
}
