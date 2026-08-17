// CuratedBanners.tsx
import { Link } from 'react-router-dom'
import { HiOutlineArrowRight } from 'react-icons/hi2'
import { useAdminStore } from '../../store/adminStore'

export function CuratedBanners() {
  const { settings } = useAdminStore()
  const activeBanners = (settings.heroBanners || []).filter((b) => b.active)

  // If Admin has not created/uploaded any Featured Banners in Admin Settings, hide section
  if (activeBanners.length === 0) {
    return null
  }

  return (
    <section className="bg-[#F7F8FA] py-10 md:py-16 font-['Outfit',sans-serif]">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#2F5FE3]">
              FEATURED COLLECTIONS
            </span>
            <h2 className="font-['Outfit'] text-2xl font-black text-[#12203D] md:text-3xl">
              Curated Banners & Collections
            </h2>
          </div>
          <Link
            to="/catalog"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#2F5FE3] hover:underline"
          >
            Explore Catalog <HiOutlineArrowRight className="text-sm" />
          </Link>
        </div>

        {/* Dynamic Admin Uploaded Featured Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeBanners.map((banner) => (
            <Link
              key={banner.id}
              to={banner.targetUrl || '/catalog'}
              className="group relative flex h-64 md:h-80 w-full flex-col overflow-hidden rounded-3xl shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl bg-slate-900"
            >
              {/* Prominent Banner Cover Image */}
              <img
                src={banner.imageUrl || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'}
                alt={banner.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark Blur Bottom Overlay */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-[#0d1629]/95 via-[#0d1629]/70 to-transparent p-5 pt-12 backdrop-blur-[3px] transition-colors duration-300 group-hover:from-[#2F5FE3]/90 group-hover:via-[#12203D]/80">
                {banner.badge && (
                  <span className="inline-block self-start rounded-full bg-[#2F5FE3] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white mb-1.5 shadow-2xs">
                    {banner.badge}
                  </span>
                )}
                <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight line-clamp-1 group-hover:translate-x-0.5 transition-transform">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="mt-0.5 text-xs font-medium text-blue-100/90 line-clamp-2">
                    {banner.subtitle}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
