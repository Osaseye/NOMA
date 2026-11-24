import { ArrowUpRight } from '@phosphor-icons/react'
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
    <section className="border-b border-[#E4E4E7] bg-white">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        {/* Architectural Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E4E4E7] px-5 py-4 sm:px-8">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1049EB]">
              02 / DIRECTORY
            </span>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[#09090B] sm:text-2xl">
              Shop by Department
            </h2>
          </div>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#09090B] transition-colors hover:border-[#09090B]"
          >
            <span>FULL DIRECTORY</span>
            <ArrowUpRight size={14} weight="regular" />
          </Link>
        </div>

        {/* 6-Cell Exposed 1px Architectural Bento Matrix */}
        <div className="grid grid-cols-2 gap-px bg-[#E4E4E7] md:grid-cols-3 lg:grid-cols-6">
          {displayCategories.map((cat, idx) => {
            const count = getCategoryCount(cat.id)
            const imageSrc = resolveCategoryImage(cat.id, cat.image)

            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group flex flex-col justify-between bg-white p-4 transition-colors hover:bg-[#FAFAFA] sm:p-5"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-[#71717A]">
                    <span>DEPT / {String(idx + 1).padStart(2, '0')}</span>
                    <span>[{count}]</span>
                  </div>

                  <div className="aspect-[4/3] w-full overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5]">
                    <img
                      src={imageSrc}
                      alt={cat.label}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between gap-2 border-t border-[#E4E4E7] pt-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-bold uppercase tracking-wider text-[#09090B] group-hover:text-[#1049EB]">
                      {cat.label}
                    </h3>
                    <span className="mt-0.5 block font-mono text-[10px] text-[#71717A]">
                      {count} {count === 1 ? 'UNIT' : 'UNITS'}
                    </span>
                  </div>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#E4E4E7] bg-[#FAFAFA] text-[#09090B] transition-colors group-hover:border-[#09090B] group-hover:bg-[#09090B] group-hover:text-white">
                    <ArrowUpRight size={13} weight="regular" />
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
