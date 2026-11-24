import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { SiteSettings } from '../../store/adminStore'

const SETTINGS_DOC_REF = doc(db, 'siteSettings', 'global')

export const initialSiteSettings: SiteSettings = {
  allProductsBannerImage: '/images/catalog-banner-all.png',
  heroBanners: [],
  todaysDealsProductIds: [],
  todaysDealsEndTimestamp: Date.now() + 86400000 * 2,
  trendingProductIds: [],
  announcementText: 'Nationwide delivery across Nigeria • Retail & bulk orders available',
  announcementActive: true,
  supportPhone: '+234 803 000 6662',
  supportEmail: 'support@shopnoma.com',
  whatsappNumber: '2348030006662',
  storageProvider: 'firebase',
  cloudinaryCloudName: '',
  cloudinaryUploadPreset: '',
  cloudflareBucketUrl: '',
  cloudflareUploadEndpoint: '/api/media/upload',
  cloudflarePublicUrl: '',
}

function sanitizeAnnouncementText(raw?: string): string {
  if (!raw) return initialSiteSettings.announcementText
  if (/firebase/i.test(raw)) {
    return initialSiteSettings.announcementText
  }
  return raw
}

export const settingsService = {
  subscribeSiteSettings: (callback: (settings: SiteSettings) => void) => {
    return onSnapshot(
      SETTINGS_DOC_REF,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings
          callback({
            allProductsBannerImage:
              data.allProductsBannerImage || initialSiteSettings.allProductsBannerImage,
            heroBanners: Array.isArray(data.heroBanners) ? data.heroBanners : [],
            todaysDealsProductIds: Array.isArray(data.todaysDealsProductIds)
              ? data.todaysDealsProductIds
              : [],
            todaysDealsEndTimestamp:
              data.todaysDealsEndTimestamp || initialSiteSettings.todaysDealsEndTimestamp,
            trendingProductIds: Array.isArray(data.trendingProductIds)
              ? data.trendingProductIds
              : [],
            announcementText: sanitizeAnnouncementText(data.announcementText),
            announcementActive: data.announcementActive ?? initialSiteSettings.announcementActive,
            supportPhone: data.supportPhone || initialSiteSettings.supportPhone,
            supportEmail: data.supportEmail || initialSiteSettings.supportEmail,
            whatsappNumber: data.whatsappNumber || initialSiteSettings.whatsappNumber,
            storageProvider: data.storageProvider || 'firebase',
            cloudinaryCloudName: data.cloudinaryCloudName || '',
            cloudinaryUploadPreset: data.cloudinaryUploadPreset || '',
            cloudflareBucketUrl: data.cloudflareBucketUrl || '',
            cloudflareUploadEndpoint:
              data.cloudflareUploadEndpoint || initialSiteSettings.cloudflareUploadEndpoint,
            cloudflarePublicUrl: data.cloudflarePublicUrl || '',
          })
        } else {
          setDoc(SETTINGS_DOC_REF, {
            ...initialSiteSettings,
            createdAt: serverTimestamp(),
          }).catch((err) => {
            console.warn('Skipped initializing siteSettings document:', err?.message || err)
          })
          callback(initialSiteSettings)
        }
      },
      (error) => {
        console.error('Error listening to Firestore siteSettings:', error)
      },
    )
  },

  updateSiteSettings: async (newSettings: Partial<SiteSettings>) => {
    await setDoc(
      SETTINGS_DOC_REF,
      {
        ...newSettings,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  },
}
