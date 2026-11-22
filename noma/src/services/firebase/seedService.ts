import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import type { Category } from '../../types/commerce'

export const defaultCategories: Category[] = [
  {
    id: 'electronics',
    label: 'Electronics & Audio',
    defaultMarkupPercent: 20,
    merchandisingLine: 'Smart 4K TVs, home soundbars, audio systems, and entertainment tech.',
    image: '/images/cat-electronics.png',
    subcategories: [
      { id: 'sub-tvs', label: 'Smart 4K TVs', parentId: 'electronics', ageGroup: 'Adults', genderTarget: 'Unisex' },
      { id: 'sub-audio', label: 'Soundbars & Audio', parentId: 'electronics', ageGroup: 'All Ages', genderTarget: 'Unisex' },
    ],
  },
  {
    id: 'appliances',
    label: 'Home Appliances',
    defaultMarkupPercent: 25,
    merchandisingLine: 'Washing machines, double-door refrigerators, microwave ovens, and power solutions.',
    image: '/images/cat-appliances.png',
    subcategories: [
      { id: 'sub-washers', label: 'Washing Machines', parentId: 'appliances', ageGroup: 'Adults', genderTarget: 'Unisex' },
      { id: 'sub-fridges', label: 'Refrigerators & Freezers', parentId: 'appliances', ageGroup: 'Adults', genderTarget: 'Unisex' },
    ],
  },
  {
    id: 'kitchen',
    label: 'Kitchen & Dining',
    defaultMarkupPercent: 25,
    merchandisingLine: 'Air fryers, heavy-duty blenders, nonstick pots, and daily cooking essentials.',
    image: '/images/cat-kitchen.png',
    subcategories: [
      { id: 'sub-blenders', label: 'High Speed Blenders', parentId: 'kitchen', ageGroup: 'Adults', genderTarget: 'Unisex' },
      { id: 'sub-fryers', label: 'Air Fryers & Ovens', parentId: 'kitchen', ageGroup: 'Adults', genderTarget: 'Unisex' },
    ],
  },
  {
    id: 'phones',
    label: 'Phones & Tablets',
    defaultMarkupPercent: 15,
    merchandisingLine: 'Smartphones, Android tablets, iPads, and mobile accessories.',
    image: '/images/cat-phones.png',
    subcategories: [
      { id: 'sub-phones', label: 'Smartphones', parentId: 'phones', ageGroup: 'All Ages', genderTarget: 'Unisex' },
      { id: 'sub-tablets', label: 'Tablets & iPads', parentId: 'phones', ageGroup: 'All Ages', genderTarget: 'Unisex' },
    ],
  },
  {
    id: 'bicycles',
    label: 'Bicycles & Mobility',
    defaultMarkupPercent: 20,
    merchandisingLine: 'Adult mountain bikes, children scooters, and electric mobility.',
    image: '/images/cat-living.png',
    subcategories: [
      { id: 'sub-adult-bikes', label: 'Mountain Bikes', parentId: 'bicycles', ageGroup: 'Adults', genderTarget: 'Unisex' },
      { id: 'sub-kids-bikes', label: 'Kids Bicycles & Scooters', parentId: 'bicycles', ageGroup: 'Children', genderTarget: 'Unisex' },
    ],
  },
  {
    id: 'clothing',
    label: 'Clothing & Apparel',
    defaultMarkupPercent: 30,
    merchandisingLine: 'Quality fashion items for adults, children, and babies.',
    image: '/images/cat-living.png',
    subcategories: [
      { id: 'sub-men', label: "Men's Wear", parentId: 'clothing', ageGroup: 'Adults', genderTarget: 'Men' },
      { id: 'sub-women', label: "Women's Fashion", parentId: 'clothing', ageGroup: 'Adults', genderTarget: 'Women' },
      { id: 'sub-kids', label: 'Kids & Baby Wear', parentId: 'clothing', ageGroup: 'Babies', genderTarget: 'Unisex' },
    ],
  },
]

export const seedService = {
  ensureDefaultCategoriesExist: async () => {
    try {
      const snap = await getDocs(collection(db, 'categories'))
      if (snap.empty) {
        console.log('Seeding default categories to Firestore database "noma"...')
        for (const cat of defaultCategories) {
          await setDoc(doc(db, 'categories', cat.id), {
            ...cat,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
      }
    } catch (err) {
      console.error('Error seeding default categories:', err)
    }
  },
}
