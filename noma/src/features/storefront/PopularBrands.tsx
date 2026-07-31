const brands = [
  { id: 'samsung', name: 'Samsung', initial: 'S' },
  { id: 'hisense', name: 'Hisense', initial: 'H' },
  { id: 'binatone', name: 'Binatone', initial: 'B' },
  { id: 'sumec', name: 'Sumec Firman', initial: 'SF' },
  { id: 'xiaomi', name: 'Xiaomi', initial: 'Mi' },
  { id: 'oraimo', name: 'Oraimo', initial: 'O' },
  { id: 'lg', name: 'LG', initial: 'LG' },
  { id: 'haier', name: 'Haier', initial: 'H' },
  { id: 'panasonic', name: 'Panasonic', initial: 'P' },
  { id: 'philips', name: 'Philips', initial: 'Ph' },
]

export function PopularBrands() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Header */}
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-[#12203D] md:text-[28px]">
          Shop by Brand
        </h2>

        {/* Scrollable brand pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:flex-wrap">
          {brands.map((brand) => (
            <a
              key={brand.id}
              href={`/catalog?brand=${brand.id}`}
              className="group flex shrink-0 items-center gap-3 rounded-2xl border border-black/5 bg-[#F7F8FA] px-5 py-3.5 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2F5FE3]/20 hover:bg-white hover:shadow-[0_4px_16px_-6px_rgba(47,95,227,0.12)]"
            >
              {/* Brand logo placeholder — replace with <img> when logos are available */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FF] text-[13px] font-extrabold text-[#2F5FE3]">
                {brand.initial}
              </div>
              <span className="text-[14px] font-bold text-[#12203D] group-hover:text-[#2F5FE3]">
                {brand.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
