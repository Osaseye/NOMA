import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { DeliveryStateConfig, SiteSettings } from '../../store/adminStore'

const SETTINGS_DOC_REF = doc(db, 'siteSettings', 'global')

export const DEFAULT_DELIVERY_STATES: DeliveryStateConfig[] = [
  { name: 'Lagos', enabled: true, standardFee: 3500, expressFee: 6000, eta: '1–2 days' },
  { name: 'FCT - Abuja', enabled: true, standardFee: 6000, expressFee: 9500, eta: '2–3 days' },
  { name: 'Ogun', enabled: true, standardFee: 4500, expressFee: 7500, eta: '2–3 days' },
  { name: 'Oyo', enabled: true, standardFee: 4500, expressFee: 7500, eta: '2–3 days' },
  { name: 'Rivers', enabled: true, standardFee: 6000, expressFee: 9500, eta: '2–4 days' },
  { name: 'Delta', enabled: true, standardFee: 6500, expressFee: 10500, eta: '2–4 days' },
  { name: 'Edo', enabled: true, standardFee: 6000, expressFee: 9500, eta: '2–4 days' },
  { name: 'Enugu', enabled: true, standardFee: 6500, expressFee: 10500, eta: '2–4 days' },
  { name: 'Anambra', enabled: true, standardFee: 6500, expressFee: 10500, eta: '2–4 days' },
  { name: 'Kano', enabled: true, standardFee: 7500, expressFee: 12000, eta: '3–5 days' },
  { name: 'Kaduna', enabled: true, standardFee: 7500, expressFee: 12000, eta: '3–5 days' },
  { name: 'Akwa Ibom', enabled: true, standardFee: 7000, expressFee: 11500, eta: '3–5 days' },
  { name: 'Cross River', enabled: true, standardFee: 7500, expressFee: 12000, eta: '3–5 days' },
  { name: 'Imo', enabled: true, standardFee: 7000, expressFee: 11500, eta: '3–5 days' },
  { name: 'Kwara', enabled: true, standardFee: 5500, expressFee: 9000, eta: '2–4 days' },
  { name: 'Osun', enabled: true, standardFee: 4500, expressFee: 7500, eta: '2–3 days' },
  { name: 'Ondo', enabled: true, standardFee: 5000, expressFee: 8500, eta: '2–3 days' },
  { name: 'Ekiti', enabled: true, standardFee: 5500, expressFee: 9000, eta: '2–4 days' },
  { name: 'Plateau', enabled: true, standardFee: 7500, expressFee: 12000, eta: '3–5 days' },
  { name: 'Abia', enabled: true, standardFee: 7000, expressFee: 11500, eta: '3–5 days' },
  { name: 'Adamawa', enabled: true, standardFee: 8000, expressFee: 13000, eta: '4–5 days' },
  { name: 'Bauchi', enabled: true, standardFee: 8000, expressFee: 13000, eta: '4–5 days' },
  { name: 'Bayelsa', enabled: true, standardFee: 7500, expressFee: 12000, eta: '3–5 days' },
  { name: 'Benue', enabled: true, standardFee: 7500, expressFee: 12000, eta: '3–5 days' },
  { name: 'Borno', enabled: true, standardFee: 8500, expressFee: 13500, eta: '4–5 days' },
  { name: 'Ebonyi', enabled: true, standardFee: 7000, expressFee: 11500, eta: '3–5 days' },
  { name: 'Gombe', enabled: true, standardFee: 8000, expressFee: 13000, eta: '4–5 days' },
  { name: 'Jigawa', enabled: true, standardFee: 8000, expressFee: 13000, eta: '4–5 days' },
  { name: 'Katsina', enabled: true, standardFee: 8000, expressFee: 13000, eta: '4–5 days' },
  { name: 'Kebbi', enabled: true, standardFee: 8000, expressFee: 13000, eta: '4–5 days' },
  { name: 'Kogi', enabled: true, standardFee: 6500, expressFee: 10500, eta: '2–4 days' },
  { name: 'Nasarawa', enabled: true, standardFee: 6500, expressFee: 10500, eta: '2–4 days' },
  { name: 'Niger', enabled: true, standardFee: 7000, expressFee: 11500, eta: '3–5 days' },
  { name: 'Sokoto', enabled: true, standardFee: 8000, expressFee: 13000, eta: '4–5 days' },
  { name: 'Taraba', enabled: true, standardFee: 8000, expressFee: 13000, eta: '4–5 days' },
  { name: 'Yobe', enabled: true, standardFee: 8500, expressFee: 13500, eta: '4–5 days' },
  { name: 'Zamfara', enabled: true, standardFee: 8000, expressFee: 13000, eta: '4–5 days' },
]

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
  storageProvider: 'cloudflare_r2',
  cloudflareBucketUrl: '',
  cloudflareUploadEndpoint: 'https://noma-r2-api.inventra.workers.dev/api/media/upload',
  cloudflarePublicUrl: 'https://pub-104edba51a2647c881c1c4db7f453fa7.r2.dev',
  geminiApiKey: '',
  geminiApiKeys: [],
  deliveryStates: DEFAULT_DELIVERY_STATES,
  deliveryRiders: [],
  freeDeliveryThreshold: 250000,
  bulkyItemSurcharge: 4000,
  payOnDeliveryEnabled: false,
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
            storageProvider: 'cloudflare_r2',
            cloudflareBucketUrl: data.cloudflareBucketUrl || '',
            cloudflareUploadEndpoint:
              data.cloudflareUploadEndpoint || initialSiteSettings.cloudflareUploadEndpoint,
            cloudflarePublicUrl:
              data.cloudflarePublicUrl || initialSiteSettings.cloudflarePublicUrl,
            geminiApiKey: data.geminiApiKey || '',
            geminiApiKeys: Array.isArray(data.geminiApiKeys) ? data.geminiApiKeys : [],
            deliveryStates:
              Array.isArray(data.deliveryStates) && data.deliveryStates.length > 0
                ? data.deliveryStates
                : DEFAULT_DELIVERY_STATES,
            deliveryRiders: Array.isArray(data.deliveryRiders) ? data.deliveryRiders : [],
            freeDeliveryThreshold:
              typeof data.freeDeliveryThreshold === 'number'
                ? data.freeDeliveryThreshold
                : initialSiteSettings.freeDeliveryThreshold,
            bulkyItemSurcharge:
              typeof data.bulkyItemSurcharge === 'number'
                ? data.bulkyItemSurcharge
                : initialSiteSettings.bulkyItemSurcharge,
            payOnDeliveryEnabled:
              typeof data.payOnDeliveryEnabled === 'boolean'
                ? data.payOnDeliveryEnabled
                : false,
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
