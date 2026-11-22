import { Link } from 'react-router-dom'

const brands = [
  { id: 'samsung', name: 'Samsung', initial: 'S' },
  { id: 'hisense', name: 'Hisense', initial: 'H' },
  { id: 'binatone', name: 'Binatone', initial: 'B' },
  { id: 'sumec', name: 'Sumec Firman', initial: 'SF' },
  { id: 'xiaomi', name: 'Xiaomi', initial: 'Mi' },
  { id: 'oraimo', name: 'Oraimo', initial: 'O' },
  { id: 'lg', name: 'LG', initial: 'LG' },
  { id: 'haier', name: 'Haier', initial: 'HT' },
  { id: 'panasonic', name: 'Panasonic', initial: 'P' },
  { id: 'philips', name: 'Philips', initial: 'Ph' },
]

export function PopularBrands() {
  return (
    <section className="border-b border-[#E5E7EB] bg-white py-14">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0B1220] md:text-[1.75rem]">
          Shop by Brand
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to={`/search?q=${encodeURIComponent(brand.name)}`}
              className="group flex shrink-0 items-center gap-3 rounded-[8px] border border-[#E5E7EB] bg-[#F6F7F9] px-4 py-3 transition-colors hover:border-[#1049EB]/40 hover:bg-white"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white font-mono text-xs font-bold text-[#1049EB]">
                {brand.initial}
              </div>
              <span className="text-sm font-semibold text-[#0B1220] transition-colors group-hover:text-[#1049EB]">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
