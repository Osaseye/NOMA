import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { StaggerGrid, StaggerItem } from '../../components/ui/MotionPrimitives'
import { useAdminStore } from '../../store/adminStore'

const DEFAULT_EDITORIAL_COLLECTIONS = [
  {
    id: 'editorial-fashion',
    title: 'Footwear & Fashion (Retail & Bulk)',
    subtitle: 'Quality sneakers, shoes, and apparel available in single pairs or wholesale bales.',
    imageUrl: '/images/cat-clothing.png',
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
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Featured Collections
          </h2>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1049EB] transition-colors hover:text-[#0D3EC7] hover:underline"
          >
            <span>Explore all</span>
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>

        {/* Full-Bleed Editorial Visual Collection Cards */}
        <StaggerGrid className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-5">
          {collections.map((item) => (
            <StaggerItem key={item.id}>
              <Link
                to={item.targetUrl}
                className="group relative block aspect-[16/11] w-full overflow-hidden rounded-2xl bg-slate-900 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                  <div className="max-w-sm">
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/80">
                      {item.subtitle}
                    </p>
                  </div>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#FEB719]">
                    <ArrowUpRight size={17} weight="bold" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}
