import { ArrowUpRight } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../../store/productStore'
import { resolveEditorialCategoryImage } from '../../utils/categoryImages'

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items]
  let s = seed
  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1)
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

export function ShopByCategory() {
  const { categories, products } = useProductStore()
  // Fresh random seed per visit so different categories rotate into the 6 featured slots
  const [visitSeed] = useState(() => Math.floor(Math.random() * 1_000_000_000))

  const getCategoryCount = (catId: string) =>
    products.filter(
      (p) =>
        p.category === catId ||
        p.subCategory === catId ||
        (catId === 'kitchen' && p.category === 'cooking') ||
        (catId === 'cooking' && p.category === 'kitchen'),
    ).length

  const displayCategories = useMemo(() => {
    if (categories.length <= 6) return categories
    return seededShuffle(categories, visitSeed).slice(0, 6)
  }, [categories, visitSeed])

  return (
    <section>
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1049EB] transition-colors hover:text-[#0D3EC7] hover:underline"
          >
            <span>View all</span>
            <ArrowUpRight size={14} weight="bold" />
          </Link>
        </div>

        {/* Full-Bleed Portrait Editorial Photography Tiles (Shuffled Each Visit) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {displayCategories.map((cat, idx) => {
            const count = getCategoryCount(cat.id)
            const imageSrc = resolveEditorialCategoryImage(cat.id, cat.label, cat.image)

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{
                  duration: 0.42,
                  delay: idx * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  to={`/category/${cat.id}`}
                  className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-900"
                >
                  <img
                    src={imageSrc}
                    alt={cat.label}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Smooth Editorial Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-opacity group-hover:from-black/90" />

                  {/* Top-Right Floating Item Count Pill */}
                  <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-white backdrop-blur-md">
                    {count}
                  </span>

                  {/* Bottom Floating Category Title & Hover Arrow */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-white sm:text-base">
                        {cat.label}
                      </h3>
                      <span className="mt-0.5 block text-[11px] font-medium text-white/80">
                        Explore &rarr;
                      </span>
                    </div>

                    <span className="flex h-8 w-8 shrink-0 translate-y-1 items-center justify-center rounded-full bg-[#FEB719] text-slate-950 opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={15} weight="bold" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
