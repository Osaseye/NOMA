import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const rawBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'noma-69c2t.firebasestorage.app'
// Format bucket URL cleanly for getStorage (supports both 'gs://noma-69c2t' and 'noma-69c2t.firebasestorage.app')
const bucketUrl = rawBucket.startsWith('gs://') ? rawBucket : `gs://${rawBucket.split('.')[0]}`

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDTaUSfZubrh06IIkx_l-VAeodOBnce99A',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'nokenko-1ab8b.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'nokenko-1ab8b',
  storageBucket: rawBucket.replace('gs://', ''),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '952856203195',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:952856203195:web:31af0e6d0c28f0218d3e9e',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-548H484SVC',
}

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || 'noma'

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app, databaseId)
export const storage = getStorage(app, bucketUrl)
