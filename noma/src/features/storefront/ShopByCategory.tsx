// ShopByCategory.tsx
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ImagePlaceholder } from '../../components/ui/ImagePlaceholder'

type CategoryCard = {
  id: string
  label: string
  sublabel: string
  href: string
  bgColor: string
  borderColor: string
}

const shopCategories: CategoryCard[] = [
  {
    id: 'electronics',
    label: 'Electronics',
    sublabel: 'TVs, Audio & More',
    href: '/category/electronics',
    bgColor: 'bg-[#EFF6FF]',
    borderColor: 'border-[#BFDBFE]',
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    sublabel: 'Cookware, Appliances',
    href: '/category/kitchen',
    bgColor: 'bg-[#FEF3C7]',
    borderColor: 'border-[#FDE68A]',
  },
  {
    id: 'appliances',
    label: 'Appliances',
    sublabel: 'Cooling, Laundry & More',
    href: '/category/appliances',
    bgColor: 'bg-[#F0FDF4]',
    borderColor: 'border-[#BBF7D0]',
  },
  {
    id: 'phones',
    label: 'Phones & Tablets',
    sublabel: 'Latest Devices',
    href: '/category/phones',
    bgColor: 'bg-[#F3E8FF]',
    borderColor: 'border-[#E9D5FF]',
  },
  {
    id: 'home-essentials',
    label: 'Home Essentials',
    sublabel: 'Tools, Outdoor & More',
    href: '/category/home-essentials',
    bgColor: 'bg-[#FFF1F2]',
    borderColor: 'border-[#FECDD3]',
  },
  {
    id: 'outdoor',
    label: 'Outdoor',
    sublabel: 'Garden & Patio',
    href: '/category/outdoor',
    bgColor: 'bg-[#ECFEFF]',
    borderColor: 'border-[#A5F3FC]',
  },
]

export function ShopByCategory() {
  return (
    <section className="bg-[#F7F8FA] pb-10 pt-4 md:pb-14">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-[#12203D] md:text-[28px]">
            Shop by Category
          </h2>
          <Link
            to="/catalog"
            className="flex items-center gap-1 text-sm font-bold text-[#2F5FE3] hover:underline"
          >
            View all categories <ChevronRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6 md:gap-5">
          {shopCategories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.href}
              aria-label={`Shop ${cat.label}`}
              className={`group flex flex-col overflow-hidden rounded-3xl border ${cat.borderColor} ${cat.bgColor} p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
            >
              {/* ImagePlaceholder utility */}
              <div className="mb-3">
                <ImagePlaceholder
                  label={cat.label}
                  variant="warm-canvas"
                  aspectRatio="aspect-[4/3]"
                  className="rounded-2xl border border-black/5 bg-white/70"
                />
              </div>

              {/* Label */}
              <div className="flex flex-col text-center pb-2">
                <span className="text-[13px] font-extrabold text-[#12203D] md:text-[14px]">
                  {cat.label}
                </span>
                <span className="mt-0.5 text-[11px] font-medium leading-snug text-[#12203D]/60 md:text-xs">
                  {cat.sublabel}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
