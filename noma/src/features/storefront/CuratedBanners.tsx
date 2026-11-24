import { ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'

const DEFAULT_EDITORIAL_COLLECTIONS = [
  {
    id: 'editorial-fashion',
    title: 'Footwear & Fashion (Retail & Bulk)',
    subtitle: 'Quality shoes, sneakers, and apparel available in single pairs or wholesale bales.',
    imageUrl: '/images/cat-living.png',
    targetUrl: '/category/clothing',
  },
  {
    id: 'editorial-kitchen',
    title: 'Kitchen & Home Essentials',
    subtitle: 'Durable cookware, digital air fryers, blenders, and everyday household upgrades.',
    imageUrl: '/images/editorial-kitchen.png',
    targetUrl: '/category/kitchen',
  },
  {
    id: 'editorial-smart',
    title: 'Electronics & Appliances',
    subtitle: 'Smart TVs, soundbars, cooling systems, and home power solutions.',
    imageUrl: '/images/editorial-smart.png',
    targetUrl: '/category/electronics',
  },
]

export function CuratedBanners() {
  const { settings } = useAdminStore()
  const activeBanners = (settings.heroBanners || []).filter((b) => b.active)

  const collections =
    activeBanners.length > 0
      ? activeBanners.slice(0, 3).map((banner, index) => ({
          id: banner.id,
          title: banner.title.replace(/[—–]/g, '-'),
          subtitle: (banner.subtitle || 'Curated collection for everyday living.').replace(
            /[—–]/g,
            '-',
          ),
          imageUrl:
            banner.imageUrl && !banner.imageUrl.includes('unsplash.com')
              ? banner.imageUrl
              : DEFAULT_EDITORIAL_COLLECTIONS[index % DEFAULT_EDITORIAL_COLLECTIONS.length].imageUrl,
          targetUrl: banner.targetUrl || '/catalog',
        }))
      : DEFAULT_EDITORIAL_COLLECTIONS

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Featured Collections
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Handpicked categories for your wardrobe, home, and business
            </p>
          </div>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1049EB] hover:underline"
          >
            <span>Explore all</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {collections.map((item) => (
            <Link
              key={item.id}
              to={item.targetUrl}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-[#1049EB]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{item.subtitle}</p>
                </div>

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1049EB]">
                  <span>Shop Collection</span>
                  <ArrowRight size={14} weight="bold" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
