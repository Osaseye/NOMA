import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type CategoryCard = {
  id: string
  label: string
  sublabel: string
  image: string
  href: string
  bgColor: string
}

// Add images to /public/products/ matching these filenames
// bgColor is a soft tinted background for the card's image area
const shopCategories: CategoryCard[] = [
  {
    id: 'electronics',
    label: 'Electronics',
    sublabel: 'TVs, Audio & More',
    image: '/products/hero-tv.png',
    href: '/category/electronics',
    bgColor: '#E8EDFB',
  },
  {
    id: 'clothing',
    label: 'Clothing & Fashion',
    sublabel: 'Men, Women & Kids',
    image: '/products/clothing.png',
    href: '/category/clothing',
    bgColor: '#FDE4ED',
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    sublabel: 'Cookware, Appliances',
    image: '/products/cookware.png',
    href: '/category/kitchen',
    bgColor: '#FFF4E5',
  },
  {
    id: 'appliances',
    label: 'Appliances',
    sublabel: 'Cooling, Laundry & More',
    image: '/products/appliances.png',
    href: '/category/appliances',
    bgColor: '#F0F0F0',
  },
  {
    id: 'phones',
    label: 'Phones & Tablets',
    sublabel: 'Latest Devices',
    image: '/products/phones.png',
    href: '/category/phones',
    bgColor: '#EDE5FF',
  },
  {
    id: 'home-essentials',
    label: 'Home Essentials',
    sublabel: 'Tools, Outdoor & More',
    image: '/products/home-essentials.png',
    href: '/category/home-essentials',
    bgColor: '#FFFDE8',
  },
]

export function ShopByCategory() {
  return (
    <section className="bg-[#F7F8FA] pb-10 pt-4 md:pb-14">
      {/* Matched padding with Header/Hero/TrendingNow */}
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-[#12203D] md:text-[28px]">
            Shop by Category
          </h2>
          <Link
            to="/categories"
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
              className="group flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_4px_16px_-8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
            >
              {/* Image area - No background color, just white */}
              <div className="flex h-[130px] items-center justify-center p-4 md:h-[150px]">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Label */}
              <div className="flex flex-col px-4 pb-5 text-center">
                <span className="text-[13px] font-extrabold text-[#12203D] md:text-[14px]">
                  {cat.label}
                </span>
                <span className="mt-1 text-[11px] font-medium leading-snug text-[#12203D]/60 md:text-xs">
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
