import { ArrowUpRight } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../store/productStore'

const EDITORIAL_CATEGORY_IMAGES: Record<string, string> = {
  bicycles: '/images/cat-bicycles-real.jpg',
  cycling: '/images/cat-bicycles-real.jpg',
  outdoor: '/images/cat-bicycles-real.jpg',
  clothing: '/images/cat-fashion-real.jpg',
  fashion: '/images/cat-fashion-real.jpg',
  shoes: '/images/cat-fashion-real.jpg',
  footwear: '/images/cat-fashion-real.jpg',
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
  electronics: '/images/cat-electronics.png',
  phones: '/images/cat-phones.png',
  power: '/images/cat-power.png',
  solar: '/images/cat-power.png',
  living: '/images/cat-living.png',
  'home-essentials': '/images/cat-living.png',
  general: '/images/cat-living.png',
}

function resolveEditorialCategoryImage(catId: string, catLabel: string, customImage?: string): string {
  const cleanId = catId.toLowerCase()
  const cleanLabel = catLabel.toLowerCase()

  if (EDITORIAL_CATEGORY_IMAGES[cleanId]) {
    return EDITORIAL_CATEGORY_IMAGES[cleanId]
  }
  if (cleanLabel.includes('bicycle') || cleanLabel.includes('cycl')) {
    return '/images/cat-bicycles-real.jpg'
  }
  if (cleanLabel.includes('cloth') || cleanLabel.includes('fashion') || cleanLabel.includes('shoe') || cleanLabel.includes('wear')) {
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
  if (customImage && !customImage.includes('unsplash.com')) {
    return customImage
  }
  return '/images/cat-fashion-real.jpg'
}

export function ShopByCategory() {
  const { categories, products } = useProductStore()

  const getCategoryCount = (catId: string) =>
    products.filter(
      (p) =>
        p.category === catId ||
        p.subCategory === catId ||
        (catId === 'kitchen' && p.category === 'cooking') ||
        (catId === 'cooking' && p.category === 'kitchen'),
    ).length

  const displayCategories = categories.slice(0, 6)

  return (
    <section>
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1049EB] transition-colors hover:text-[#0D3EC7] hover:underline"
          >
            <span>View all</span>
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>

        {/* Full-Bleed Portrait Editorial Photography Tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {displayCategories.map((cat, idx) => {
            const count = getCategoryCount(cat.id)
            const imageSrc = resolveEditorialCategoryImage(cat.id, cat.label, cat.image)

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{
                  duration: 0.42,
                  delay: idx * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  to={`/category/${cat.id}`}
                  className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900"
                >
                  <img
                    src={imageSrc}
                    alt={cat.label}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Smooth Editorial Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-opacity group-hover:from-black/90" />

                  {/* Top-Right Floating Item Count Pill */}
                  <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-white backdrop-blur-md">
                    {count}
                  </span>

                  {/* Bottom Floating Category Title & Hover Arrow */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-white sm:text-base">
                        {cat.label}
                      </h3>
                      <span className="mt-0.5 block text-[11px] font-medium text-white/80">
                        Explore &rarr;
                      </span>
                    </div>

                    <span className="flex h-8 w-8 shrink-0 translate-y-1 items-center justify-center rounded-full bg-[#FEB719] text-slate-950 opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={15} weight="bold" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
