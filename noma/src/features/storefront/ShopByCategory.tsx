import { ChevronRight, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../store/productStore'

export function ShopByCategory() {
  const { categories } = useProductStore()

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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 md:gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                aria-label={`Shop ${cat.label}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <div className="mb-3 h-28 w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80'}
                    alt={cat.label}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Label */}
                <div className="flex flex-col text-center pb-1">
                  <span className="text-[13px] font-extrabold text-[#12203D] md:text-[14px]">
                    {cat.label}
                  </span>
                  <span className="mt-0.5 text-[11px] font-medium leading-snug text-[#526484] line-clamp-1">
                    {cat.merchandisingLine || 'Shop quality items'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
