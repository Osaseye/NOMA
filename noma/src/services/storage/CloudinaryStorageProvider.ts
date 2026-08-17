import type { IStorageProvider } from './IStorageProvider'

export class CloudinaryStorageProvider implements IStorageProvider {
  private cloudName: string
  private uploadPreset: string

  constructor(customCloudName?: string, customUploadPreset?: string) {
    this.cloudName = customCloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
    this.uploadPreset = customUploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''
  }

  async uploadImage(file: File, folder: string = 'noma_products'): Promise<string> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error(
        'Cloudinary credentials missing. Please set your Cloud Name and Upload Preset in Admin Settings or .env.local'
      )
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', this.uploadPreset)
    formData.append('folder', folder)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary')
    }

    const data = await response.json()
    return data.secure_url
  }
}
