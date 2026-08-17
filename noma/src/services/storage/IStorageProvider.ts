export interface IStorageProvider {
  /**
   * Upload an image file and return the public HTTP image URL
   */
  uploadImage(file: File, folder?: string): Promise<string>
  
  /**
   * Optional deletion of an image by URL
   */
  deleteImage?(url: string): Promise<void>
}
