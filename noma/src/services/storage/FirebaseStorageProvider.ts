import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../lib/firebase'
import type { IStorageProvider } from './IStorageProvider'

export class FirebaseStorageProvider implements IStorageProvider {
  async uploadImage(file: File, folder: string = 'images'): Promise<string> {
    const filename = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const storageRef = ref(storage, filename)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadUrl = await getDownloadURL(snapshot.ref)
    return downloadUrl
  }
}
