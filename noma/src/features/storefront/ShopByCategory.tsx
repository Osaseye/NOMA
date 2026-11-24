import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../store/productStore'

const CATEGORY_STUDIO_IMAGES: Record<string, string> = {
  clothing: '/images/cat-clothing.png',
  fashion: '/images/cat-clothing.png',
  shoes: '/images/cat-clothing.png',
  electronics: '/images/cat-electronics.png',
  appliances: '/images/cat-appliances.png',
  kitchen: '/images/cat-kitchen.png',
  cooking: '/images/cat-kitchen.png',
  phones: '/images/cat-phones.png',
  power: '/images/cat-power.png',
  solar: '/images/cat-power.png',
  living: '/images/cat-living.png',
  'home-essentials': '/images/cat-living.png',
  bicycles: '/images/cat-living.png',
  outdoor: '/images/cat-living.png',
  wines: '/images/cat-kitchen.png',
  general: '/images/cat-living.png',
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

  const resolveCategoryImage = (catId: string, customImage?: string) => {
    if (customImage && !customImage.includes('unsplash.com')) {
      return customImage
    }
    const clean = catId.toLowerCase()
    if (CATEGORY_STUDIO_IMAGES[clean]) {
      return CATEGORY_STUDIO_IMAGES[clean]
    }
    return '/images/cat-clothing.png'
  }

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
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-950 hover:underline"
          >
            <span>View all</span>
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>

        {/* Full-Bleed Portrait Visual Gallery Tiles (Zero Clunky White Outer Card Boxes) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {displayCategories.map((cat) => {
            const count = getCategoryCount(cat.id)
            const imageSrc = resolveCategoryImage(cat.id, cat.image)

            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900"
              >
                <img
                  src={imageSrc}
                  alt={cat.label}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />

                {/* Smooth Editorial Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black/90" />

                {/* Top-Right Floating Item Count Pill */}
                <span className="absolute right-3 top-3 rounded-full bg-black/35 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-md">
                  {count}
                </span>

                {/* Bottom Floating Category Title & Hover Arrow */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-white sm:text-base">
                      {cat.label}
                    </h3>
                    <span className="mt-0.5 block text-[11px] font-medium text-white/75">
                      Explore &rarr;
                    </span>
                  </div>

                  <span className="flex h-8 w-8 shrink-0 translate-y-1 items-center justify-center rounded-full bg-white text-slate-950 opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={15} weight="bold" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
