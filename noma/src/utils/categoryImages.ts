const EDITORIAL_CATEGORY_IMAGES: Record<string, string> = {
  bicycles: '/images/cat-bicycles-real.jpg',
  cycling: '/images/cat-bicycles-real.jpg',
  outdoor: '/images/cat-bicycles-real.jpg',
  clothing: '/images/cat-fashion-real.jpg',
  fashion: '/images/cat-fashion-real.jpg',
  shoes: '/images/cat-shoes-real.jpg',
  footwear: '/images/cat-shoes-real.jpg',
  cookware: '/images/cat-cookware-real.jpg',
  kitchen: '/images/cat-cookware-real.jpg',
  cooking: '/images/cat-cookware-real.jpg',
  food: '/images/cat-groceries-real.jpg',
  groceries: '/images/cat-groceries-real.jpg',
  grocery: '/images/cat-groceries-real.jpg',
  appliances: '/images/cat-appliances-real.jpg',
  'home-appliances': '/images/cat-appliances-real.jpg',
  perfumes: '/images/cat-perfumes-real.jpg',
  fragrances: '/images/cat-perfumes-real.jpg',
  beauty: '/images/cat-perfumes-real.jpg',
  phones: '/images/cat-phones-real.jpg',
  smartphones: '/images/cat-phones-real.jpg',
  accessories: '/images/cat-phones-real.jpg',
  power: '/images/cat-solar-real.jpg',
  solar: '/images/cat-solar-real.jpg',
  'solar-power': '/images/cat-solar-real.jpg',
  toys: '/images/cat-toys-real.jpg',
  games: '/images/cat-toys-real.jpg',
  kids: '/images/cat-toys-real.jpg',
  electronics: '/images/cat-electronics-real.jpg',
  audio: '/images/cat-electronics-real.jpg',
  wines: '/images/cat-wines-real.jpg',
  drinks: '/images/cat-wines-real.jpg',
  beverages: '/images/cat-wines-real.jpg',
  living: '/images/cat-appliances-real.jpg',
  'home-essentials': '/images/cat-cookware-real.jpg',
  general: '/images/cat-fashion-real.jpg',
}

export function resolveEditorialCategoryImage(
  catId: string,
  catLabel: string,
  customImage?: string,
): string {
  const cleanId = (catId || '').toLowerCase()
  const cleanLabel = (catLabel || '').toLowerCase()

  if (EDITORIAL_CATEGORY_IMAGES[cleanId]) {
    return EDITORIAL_CATEGORY_IMAGES[cleanId]
  }
  if (cleanLabel.includes('bicycle') || cleanLabel.includes('cycl')) {
    return '/images/cat-bicycles-real.jpg'
  }
  if (cleanLabel.includes('shoe') || cleanLabel.includes('foot') || cleanLabel.includes('sneaker')) {
    return '/images/cat-shoes-real.jpg'
  }
  if (cleanLabel.includes('cloth') || cleanLabel.includes('fashion') || cleanLabel.includes('apparel')) {
    return '/images/cat-fashion-real.jpg'
  }
  if (cleanLabel.includes('cook') || cleanLabel.includes('kitchen')) {
    return '/images/cat-cookware-real.jpg'
  }
  if (cleanLabel.includes('food') || cleanLabel.includes('grocer') || cleanLabel.includes('pantry')) {
    return '/images/cat-groceries-real.jpg'
  }
  if (cleanLabel.includes('appliance')) {
    return '/images/cat-appliances-real.jpg'
  }
  if (cleanLabel.includes('perfume') || cleanLabel.includes('fragrance') || cleanLabel.includes('scent')) {
    return '/images/cat-perfumes-real.jpg'
  }
  if (cleanLabel.includes('phone') || cleanLabel.includes('mobile') || cleanLabel.includes('accessor')) {
    return '/images/cat-phones-real.jpg'
  }
  if (cleanLabel.includes('solar') || cleanLabel.includes('power') || cleanLabel.includes('inverter')) {
    return '/images/cat-solar-real.jpg'
  }
  if (cleanLabel.includes('toy') || cleanLabel.includes('game') || cleanLabel.includes('kid')) {
    return '/images/cat-toys-real.jpg'
  }
  if (cleanLabel.includes('electronic') || cleanLabel.includes('audio') || cleanLabel.includes('tech')) {
    return '/images/cat-electronics-real.jpg'
  }
  if (cleanLabel.includes('wine') || cleanLabel.includes('drink') || cleanLabel.includes('spirit')) {
    return '/images/cat-wines-real.jpg'
  }
  if (customImage && !customImage.includes('unsplash.com')) {
    return customImage
  }
  return '/images/cat-fashion-real.jpg'
}
