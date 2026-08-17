import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { SiteSettings } from '../../store/adminStore'

const SETTINGS_DOC_REF = doc(db, 'siteSettings', 'global')

export const initialSiteSettings: SiteSettings = {
  allProductsBannerImage: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1000&q=80',
  heroBanners: [],
  todaysDealsProductIds: [],
  todaysDealsEndTimestamp: Date.now() + 86400000 * 2,
  trendingProductIds: [],
  announcementText: '⚡ WELCOME TO NOMA STORES - LIVE FIREBASE BACKEND ACTIVE',
  announcementActive: true,
  supportPhone: '0803 000 NOMA',
  supportEmail: 'support@noma.ng',
  whatsappNumber: '2348030006662',
  storageProvider: 'firebase',
  cloudinaryCloudName: '',
  cloudinaryUploadPreset: '',
  cloudflareBucketUrl: '',
}

export const settingsService = {
  subscribeSiteSettings: (callback: (settings: SiteSettings) => void) => {
    return onSnapshot(
      SETTINGS_DOC_REF,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings
          callback({
            allProductsBannerImage: data.allProductsBannerImage || initialSiteSettings.allProductsBannerImage,
            heroBanners: Array.isArray(data.heroBanners) ? data.heroBanners : [],
            todaysDealsProductIds: Array.isArray(data.todaysDealsProductIds) ? data.todaysDealsProductIds : [],
            todaysDealsEndTimestamp: data.todaysDealsEndTimestamp || initialSiteSettings.todaysDealsEndTimestamp,
            trendingProductIds: Array.isArray(data.trendingProductIds) ? data.trendingProductIds : [],
            announcementText: data.announcementText ?? initialSiteSettings.announcementText,
            announcementActive: data.announcementActive ?? initialSiteSettings.announcementActive,
            supportPhone: data.supportPhone || initialSiteSettings.supportPhone,
            supportEmail: data.supportEmail || initialSiteSettings.supportEmail,
            whatsappNumber: data.whatsappNumber || initialSiteSettings.whatsappNumber,
            storageProvider: data.storageProvider || 'firebase',
            cloudinaryCloudName: data.cloudinaryCloudName || '',
            cloudinaryUploadPreset: data.cloudinaryUploadPreset || '',
            cloudflareBucketUrl: data.cloudflareBucketUrl || '',
          })
        } else {
          // Initialize document if missing
          setDoc(SETTINGS_DOC_REF, {
            ...initialSiteSettings,
            createdAt: serverTimestamp(),
          })
          callback(initialSiteSettings)
        }
      },
      (error) => {
        console.error('Error listening to Firestore siteSettings:', error)
      }
    )
  },

  updateSiteSettings: async (newSettings: Partial<SiteSettings>) => {
    await setDoc(
      SETTINGS_DOC_REF,
      {
        ...newSettings,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  },
}
