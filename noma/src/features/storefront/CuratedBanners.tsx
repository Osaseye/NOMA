import { ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'

const DEFAULT_EDITORIAL_COLLECTIONS = [
  {
    id: 'editorial-power',
    title: 'Power & Inverter Systems',
    subtitle: 'Quiet backup energy hardware sized for Nigerian homes and workspaces.',
    imageUrl: '/images/editorial-power.png',
    targetUrl: '/category/appliances',
  },
  {
    id: 'editorial-smart',
    title: 'Smart Home & Audio',
    subtitle: '4K displays, acoustic soundbars, and connected everyday hardware.',
    imageUrl: '/images/editorial-smart.png',
    targetUrl: '/category/electronics',
  },
  {
    id: 'editorial-kitchen',
    title: 'Modern Kitchen Architecture',
    subtitle: 'Induction kettles, digital air fryers, and durable steel cookware.',
    imageUrl: '/images/editorial-kitchen.png',
    targetUrl: '/category/kitchen',
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
          subtitle: (banner.subtitle || 'Curated collection for everyday living.').replace(/[—–]/g, '-'),
          imageUrl:
            banner.imageUrl && !banner.imageUrl.includes('unsplash.com')
              ? banner.imageUrl
              : DEFAULT_EDITORIAL_COLLECTIONS[index % DEFAULT_EDITORIAL_COLLECTIONS.length].imageUrl,
          targetUrl: banner.targetUrl || '/catalog',
        }))
      : DEFAULT_EDITORIAL_COLLECTIONS

  return (
    <section className="border-b border-[#E5E7EB] bg-[#F6F7F9] py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Header (No eyebrow) */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#0B1220] md:text-[1.75rem]">
            Curated collections
          </h2>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1049EB] hover:text-[#0D3BC2] hover:underline"
          >
            <span>Explore catalog</span>
            <ArrowRight size={14} weight="regular" />
          </Link>
        </div>

        {/* 3-Column Architectural Lookbook */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((item) => (
            <Link
              key={item.id}
              to={item.targetUrl}
              className="group flex flex-col overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white transition-colors hover:border-[#0B1220]/30"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#EEF0F4]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between border-t border-[#E5E7EB] p-5">
                <div>
                  <h3 className="line-clamp-1 text-base font-bold tracking-tight text-[#0B1220] transition-colors group-hover:text-[#1049EB]">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5E6675]">
                    {item.subtitle}
                  </p>
                </div>

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1220] transition-colors group-hover:text-[#1049EB]">
                  <span>Explore</span>
                  <ArrowRight size={14} weight="regular" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
