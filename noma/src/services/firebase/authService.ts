import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '../../lib/firebase'
import type { DeliveryAddress } from '../../store/userStore'

export interface UserDoc {
  uid: string
  email: string
  name: string
  phone: string
  role: 'admin' | 'customer'
  wishlistProductIds: string[]
  defaultAddress?: DeliveryAddress
  createdAt?: unknown
  updatedAt?: unknown
}

export const authService = {
  loginWithEmail: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  },

  loginWithGoogle: async () => {
    const userCredential = await signInWithPopup(auth, googleProvider)
    const user = userCredential.user

    // Ensure user profile document exists in Firestore
    const userRef = doc(db, 'users', user.uid)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
      const newUserDoc: UserDoc = {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || 'Customer',
        phone: user.phoneNumber || '',
        role: 'customer',
        wishlistProductIds: [],
        createdAt: serverTimestamp(),
      }
      await setDoc(userRef, newUserDoc)
    }

    return user
  },

  registerAdmin: async (email: string, password: string, name: string, phone: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    const adminDoc: UserDoc = {
      uid: user.uid,
      email: user.email || email,
      name,
      phone,
      role: 'admin',
      wishlistProductIds: [],
      createdAt: serverTimestamp(),
    }

    await setDoc(doc(db, 'users', user.uid), adminDoc)
    return { user, profile: adminDoc }
  },

  registerCustomer: async (email: string, password: string, name: string, phone: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    const customerDoc: UserDoc = {
      uid: user.uid,
      email: user.email || email,
      name,
      phone,
      role: 'customer',
      wishlistProductIds: [],
      createdAt: serverTimestamp(),
    }

    await setDoc(doc(db, 'users', user.uid), customerDoc)
    return { user, profile: customerDoc }
  },

  getUserProfile: async (uid: string): Promise<UserDoc | null> => {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) {
      return snap.data() as UserDoc
    }
    return null
  },

  updateUserProfile: async (uid: string, updates: Partial<UserDoc>) => {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  },

  logout: async () => {
    await signOut(auth)
  },

  subscribeAuthState: (callback: (authUser: User | null, profile: UserDoc | null) => void) => {
    return onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const profile = await authService.getUserProfile(authUser.uid)
        callback(authUser, profile)
      } else {
        callback(null, null)
      }
    })
  },
}
