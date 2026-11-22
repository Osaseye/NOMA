import { ArrowRight, CaretRight, SquaresFour } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../design-system/components/EmptyState'
import { useProductStore } from '../../store/productStore'
import type { Category } from '../../types/commerce'

const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  electronics: '/images/cat-electronics.png',
  appliances: '/images/cat-appliances.png',
  kitchen: '/images/cat-kitchen.png',
  cooking: '/images/cat-kitchen.png',
  phones: '/images/cat-phones.png',
  power: '/images/cat-power.png',
  solar: '/images/cat-power.png',
  living: '/images/cat-living.png',
  'home-essentials': '/images/cat-living.png',
  general: '/images/cat-living.png',
  bicycles: '/images/cat-living.png',
  outdoor: '/images/cat-living.png',
  clothing: '/images/cat-living.png',
}

function resolveCategoryImage(category: Category): string {
  if (category.image && !category.image.includes('unsplash.com')) {
    return category.image
  }
  return CATEGORY_IMAGE_FALLBACKS[category.id.toLowerCase()] || '/images/cat-living.png'
}

function getBentoColSpan(index: number, totalCategories: number): string {
  if (index === 0) {
    if (totalCategories === 1) return 'col-span-2 lg:col-span-7 min-h-[240px] lg:min-h-[340px]'
    return 'col-span-2 lg:col-span-5 lg:row-span-2 min-h-[230px] lg:min-h-[380px]'
  }
  if (totalCategories === 2) {
    return 'col-span-1 lg:col-span-7 min-h-[168px] lg:min-h-[182px]'
  }
  if (totalCategories === 3) {
    return index === 1
      ? 'col-span-1 lg:col-span-4 min-h-[168px] lg:min-h-[182px]'
      : 'col-span-1 lg:col-span-3 min-h-[168px] lg:min-h-[182px]'
  }
  if (totalCategories === 4) {
    if (index === 1) return 'col-span-1 lg:col-span-4 min-h-[168px] lg:min-h-[182px]'
    if (index === 2) return 'col-span-1 lg:col-span-3 min-h-[168px] lg:min-h-[182px]'
    return 'col-span-1 lg:col-span-4 min-h-[168px] lg:min-h-[182px]'
  }
  // 5 categories
  if (index === 1) return 'col-span-1 lg:col-span-4 min-h-[168px] lg:min-h-[182px]'
  if (index === 2) return 'col-span-1 lg:col-span-3 min-h-[168px] lg:min-h-[182px]'
  return 'col-span-1 lg:col-span-2 min-h-[168px] lg:min-h-[182px]'
}

function getBrowseTileSpan(totalCategories: number): string {
  if (totalCategories === 1) return 'col-span-2 lg:col-span-5 min-h-[180px] lg:min-h-[340px]'
  if (totalCategories === 2) return 'col-span-1 lg:col-span-7 min-h-[168px] lg:min-h-[182px]'
  if (totalCategories === 3) return 'col-span-1 lg:col-span-7 min-h-[168px] lg:min-h-[182px]'
  return 'col-span-1 lg:col-span-3 min-h-[168px] lg:min-h-[182px]'
}

export function ShopByCategory() {
  const { categories } = useProductStore()
  const displayCategories = categories.slice(0, 5)

  return (
    <section className="border-b border-[#E5E7EB] bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Header (No eyebrow) */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0B1220] md:text-[1.75rem]">
            Shop by category
          </h2>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1049EB] hover:text-[#0D3BC2] hover:underline"
          >
            <span>All categories</span>
            <CaretRight size={14} weight="regular" />
          </Link>
        </div>

        {/* Category Bento Mosaic */}
        {displayCategories.length === 0 ? (
          <EmptyState
            icon={<SquaresFour size={24} weight="regular" />}
            title="No categories available yet"
            detail="Categories configured in the catalog will appear here automatically."
            action={
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
              >
                Browse Full Catalog
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
            {displayCategories.map((cat, index) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                aria-label={`Shop ${cat.label}`}
                className={`group relative flex overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] ${getBentoColSpan(
                  index,
                  displayCategories.length
                )}`}
              >
                <img
                  src={resolveCategoryImage(cat)}
                  alt={cat.label}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/85 via-[#0B1220]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <h3 className="line-clamp-1 text-sm font-bold tracking-tight text-white sm:text-base">
                    {cat.label}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-white/80">
                    {(cat.merchandisingLine || 'Curated home essentials').replace(/[—–]/g, '-')}
                  </p>
                </div>
              </Link>
            ))}

            {/* Dark Architectural Browse Full Catalog Tile */}
            <Link
              to="/catalog"
              aria-label="Browse Full Catalog"
              className={`group flex flex-col items-start justify-between rounded-[8px] border border-[#0B1220] bg-[#0B1220] p-5 text-white transition-colors hover:bg-[#1E293B] ${getBrowseTileSpan(
                displayCategories.length
              )}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-white/15 bg-white/10 text-white">
                <SquaresFour size={20} weight="regular" />
              </div>

              <div>
                <h3 className="text-sm font-bold tracking-tight text-white sm:text-base">
                  Browse Full Catalog
                </h3>
                <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-white/80 transition-colors group-hover:text-white">
                  <span>View all items</span>
                  <ArrowRight size={14} weight="regular" />
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
