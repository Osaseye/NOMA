import { ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../store/productStore'

const CATEGORY_STUDIO_IMAGES: Record<string, string> = {
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
  clothing: '/images/cat-living.png',
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
    return '/images/cat-living.png'
  }

  const displayCategories = categories.slice(0, 6)

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Shop by Category
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Explore our top departments
            </p>
          </div>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1049EB] hover:underline"
          >
            <span>See all categories</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {displayCategories.map((cat) => {
            const count = getCategoryCount(cat.id)
            const imageSrc = resolveCategoryImage(cat.id, cat.image)

            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-[#1049EB]/40 hover:shadow-md"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={imageSrc}
                    alt={cat.label}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 px-1">
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-bold text-slate-900 group-hover:text-[#1049EB] sm:text-sm">
                      {cat.label}
                    </h3>
                    <span className="mt-0.5 block text-[11px] text-slate-500">
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
