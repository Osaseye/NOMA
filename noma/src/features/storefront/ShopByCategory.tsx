import { ChevronRight, LayoutGrid } from 'lucide-react'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../store/productStore'

export function ShopByCategory() {
  const { categories } = useProductStore()

  // Display at most 5 category cards, with the 6th card as "More Categories"
  const displayCategories = categories.slice(0, 5)

  return (
    <section className="bg-[#F7F8FA] pb-10 pt-4 md:pb-14 font-['Outfit',sans-serif]">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#12203D] md:text-[28px]">
              Shop by Category
            </h2>
            <p className="text-xs text-[#526484] mt-0.5">Explore our wide range of home & living products</p>
          </div>
          <Link
            to="/catalog"
            className="flex items-center gap-1 text-xs font-bold text-[#2F5FE3] hover:underline"
          >
            View all categories <ChevronRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Dynamic Category grid or Empty State */}
        {categories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2F5FE3] mb-1">
              <LayoutGrid size={28} />
            </div>
            <h3 className="font-bold text-base text-[#12203D]">No Categories Available Yet</h3>
            <p className="text-xs text-slate-500 max-w-md">
              Categories created in the Admin Portal will automatically appear here on the storefront.
            </p>
            <Link
              to="/catalog"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#2F5FE3] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#254ec4]"
            >
              Browse Full Product Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4 md:gap-5">
            {/* Render Top 5 Categories */}
            {displayCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                aria-label={`Shop ${cat.label}`}
                className="group relative flex h-40 sm:h-52 md:h-64 lg:h-72 w-full flex-col overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl bg-slate-900"
              >
                {/* Prominent Full-Card Image */}
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80'}
                  alt={cat.label}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark Blur Overlay at the Bottom */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-[#0d1629]/95 via-[#0d1629]/70 to-transparent p-3 sm:p-4 pt-6 sm:pt-10 backdrop-blur-[3px] transition-colors duration-300 group-hover:from-[#2F5FE3]/90 group-hover:via-[#12203D]/80">
                  <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-white tracking-tight line-clamp-1 group-hover:translate-x-0.5 transition-transform">
                    {cat.label}
                  </h3>
                  <p className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-blue-100/90 line-clamp-1">
                    {cat.merchandisingLine || 'Shop quality items'}
                  </p>
                </div>
              </Link>
            ))}

            {/* 6th Slot: "More Categories" Card leading to /catalog */}
            <Link
              to="/catalog"
              aria-label="Explore More Categories"
              className="group relative flex h-40 sm:h-52 md:h-64 lg:h-72 w-full flex-col items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl bg-gradient-to-br from-[#12203D] via-[#1a2d54] to-[#2F5FE3] p-4 text-center text-white"
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-white mb-2 sm:mb-3 group-hover:scale-110 group-hover:bg-[#2F5FE3] transition-all duration-300 border border-white/20">
                <HiOutlineSquares2X2 size={24} className="sm:text-2xl" />
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-white tracking-tight">
                More Categories
              </h3>
              <span className="mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-blue-200 group-hover:text-white transition-colors">
                View Catalog <ChevronRight size={13} />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
