import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'

const DEFAULT_EDITORIAL_COLLECTIONS = [
  {
    id: 'editorial-power',
    code: 'LOOKBOOK / 01',
    title: 'Power & Inverter Systems',
    subtitle: 'Quiet backup energy hardware sized for Nigerian homes and workspaces.',
    imageUrl: '/images/editorial-power.png',
    targetUrl: '/category/appliances',
  },
  {
    id: 'editorial-smart',
    code: 'LOOKBOOK / 02',
    title: 'Smart Home & Audio',
    subtitle: '4K displays, acoustic soundbars, and connected everyday hardware.',
    imageUrl: '/images/editorial-smart.png',
    targetUrl: '/category/electronics',
  },
  {
    id: 'editorial-kitchen',
    code: 'LOOKBOOK / 03',
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
          code: `LOOKBOOK / 0${index + 1}`,
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
    <section className="border-b border-[#E4E4E7] bg-white">
      <div className="mx-auto max-w-[1600px] border-x border-[#E4E4E7]">
        {/* Architectural Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E4E4E7] px-5 py-4 sm:px-8">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1049EB]">
              05 / EDITORIAL CURATION
            </span>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[#09090B] sm:text-2xl">
              Architectural Lookbook
            </h2>
          </div>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#09090B] transition-colors hover:border-[#09090B]"
          >
            <span>EXPLORE ALL</span>
            <ArrowUpRight size={14} weight="regular" />
          </Link>
        </div>

        {/* 3-Column Exposed 1px Architectural Lookbook Matrix */}
        <div className="grid grid-cols-1 gap-px bg-[#E4E4E7] md:grid-cols-3">
          {collections.map((item) => (
            <Link
              key={item.id}
              to={item.targetUrl}
              className="group flex flex-col justify-between bg-white p-5 transition-colors hover:bg-[#FAFAFA] sm:p-7"
            >
              <div>
                <div className="mb-3 flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-widest text-[#71717A]">
                  <span>{item.code}</span>
                  <span>NOMA STUDIO</span>
                </div>

                <div className="aspect-[16/10] w-full overflow-hidden border border-[#E4E4E7] bg-[#F4F4F5]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-5">
                  <h3 className="text-base font-bold tracking-tight text-[#09090B] transition-colors group-hover:text-[#1049EB] sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#52525B]">{item.subtitle}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#E4E4E7] pt-3.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#09090B] group-hover:text-[#1049EB]">
                <span>ENTER COLLECTION</span>
                <ArrowUpRight size={14} weight="regular" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
