import { ChevronRight, Heart, Search, Star, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

const relatedProducts = [
  { id: 'r1', name: 'Samsung 43" Crystal UHD Smart TV', price: 468000, image: '/products/hero-tv.png', slug: 'samsung-crystal-uhd-tv', rating: 4.6 },
  { id: 'r2', name: 'Xiaomi Smart Air Fryer', price: 95000, image: '/products/air-fryer.png', slug: 'xiaomi-smart-air-fryer', rating: 4.8 },
  { id: 'r3', name: 'Sumec Firman Generator', price: 320000, image: '/products/generator.png', slug: 'sumec-firman-generator', rating: 4.5 },
  { id: 'r4', name: 'Binatone Blender', price: 45000, image: '/products/blender.png', slug: 'binatone-blender', rating: 4.7 },
]

const sizes = ['S', 'M', 'L', 'XL', 'XXL']
const colors = [
  { id: 'black', hex: '#000000', label: 'Midnight Black' },
  { id: 'grey', hex: '#6B7280', label: 'Heather Grey' },
  { id: 'blue', hex: '#2F5FE3', label: 'Noma Blue' },
]

export function ProductDetail({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const [added, setAdded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeAnim, setLikeAnim] = useState(false)
  
  // Clothing specific state
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('black')

  const isClothing = product.category === 'clothing'

  const handleAddToCart = () => {
    onAddToCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikeAnim(true)
    setTimeout(() => setLikeAnim(false), 300)
  }

  const thumbnails = [product.image, product.image, product.image, product.image]

  return (
    <div className="min-h-screen bg-[#F9F9F6] pb-32">
      <div className="h-[88px]" />

      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#12203D]/60 pt-8">
          <Link to="/" className="hover:text-[#12203D]">HOME</Link>
          <ChevronRight size={14} strokeWidth={3} />
          <Link to="/catalog" className="hover:text-[#12203D]">{product.category}</Link>
          <ChevronRight size={14} strokeWidth={3} />
          <span className="text-[#12203D]">{product.name}</span>
        </nav>

        {/* Main Product Area */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_500px]">
          {/* Left: Imagery */}
          <div className="flex flex-col gap-6">
            <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-[#12203D] bg-white p-8 shadow-[8px_8px_0_0_#12203D] md:aspect-[4/3] lg:aspect-auto lg:h-[700px]">
              {product.badge && (
                <div className="absolute left-0 top-0 z-10 border-b-4 border-r-4 border-[#12203D] bg-[#10B981] px-4 py-2 text-[13px] font-black uppercase tracking-widest text-white">
                  {product.badge}
                </div>
              )}
              <button className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#12203D] bg-white text-[#12203D] shadow-[4px_4px_0_0_#12203D] transition-all hover:translate-y-1 hover:shadow-none z-10">
                <Search size={24} strokeWidth={3} />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {thumbnails.map((img, i) => (
                <div key={i} className={`flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white p-2 cursor-pointer transition-all border-2 ${i === 0 ? 'border-[#12203D] shadow-[4px_4px_0_0_#12203D]' : 'border-transparent opacity-60 hover:opacity-100 hover:border-[#12203D]/20'}`}>
                  <img src={img} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col pt-2 lg:pt-0">
            <h1 className="font-['Outfit'] text-[3rem] font-black leading-[0.95] tracking-tight text-[#12203D] md:text-[4rem]">
              {product.name}
            </h1>

            <div className="mt-6 flex items-center gap-3 border-y-4 border-[#12203D] py-4">
              <div className="flex items-center gap-1 text-[#F5A623]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < Math.floor(product.rating ?? 4.5) ? 'fill-current' : 'fill-transparent border-[#F5A623] opacity-50'} strokeWidth={1.5} />
                ))}
              </div>
              <span className="text-[16px] font-black text-[#12203D]">{product.rating ?? '4.5'}</span>
              <span className="text-[14px] font-bold uppercase tracking-widest text-[#12203D]/50">(128 REVIEWS)</span>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <div className="flex items-end gap-4">
                <span className="text-[3rem] font-black leading-none tracking-tight text-[#12203D]">
                  {formatNaira(product.finalPrice)}
                </span>
                {product.basePrice && product.basePrice > product.finalPrice && (
                  <span className="mb-1 text-[20px] font-bold text-[#12203D]/40 line-through">
                    {formatNaira(product.basePrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-8 text-[16px] font-medium leading-relaxed text-[#12203D]/70">
              {product.description}
            </p>

            {/* Clothing Options */}
            {isClothing && (
              <div className="mt-10 flex flex-col gap-8 border-t-4 border-[#12203D] pt-10">
                {/* Size Selector */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-black uppercase tracking-widest text-[#12203D]">Select Size</span>
                    <button className="text-[11px] font-bold uppercase tracking-widest text-[#12203D]/50 underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#12203D] text-[15px] font-black transition-all ${
                          selectedSize === size
                            ? 'bg-[#12203D] text-white shadow-[4px_4px_0_0_#12203D]'
                            : 'bg-white text-[#12203D] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#12203D]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="flex flex-col gap-4">
                  <span className="text-[13px] font-black uppercase tracking-widest text-[#12203D]">
                    Color <span className="text-[#12203D]/50">— {colors.find((c) => c.id === selectedColor)?.label}</span>
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all ${
                          selectedColor === color.id
                            ? 'border-[#12203D] scale-110 shadow-[4px_4px_0_0_#12203D]'
                            : 'border-transparent scale-100 hover:scale-110'
                        }`}
                      >
                        <span className="h-full w-full rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Specs Pills */}
            {!isClothing && (
              <div className="mt-8 flex flex-wrap gap-3">
                {product.specs?.slice(0, 3).map((spec, i) => (
                  <span key={i} className="flex items-center gap-2 rounded-xl border-2 border-[#12203D] bg-white px-4 py-2 text-[11px] font-black uppercase tracking-widest text-[#12203D]">
                    <Zap size={14} className="opacity-50" />
                    {spec}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-12 flex gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex h-16 flex-1 items-center justify-center gap-3 border-4 border-[#12203D] text-[16px] font-black uppercase tracking-widest transition-all duration-300 ${
                  added
                    ? 'scale-95 bg-[#10B981]'
                    : 'bg-[#12203D] text-white shadow-[6px_6px_0_0_#12203D] hover:translate-y-1 hover:shadow-none active:bg-black'
                } flex h-16 flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-[#12203D] text-[16px] font-black uppercase tracking-widest transition-all duration-300`}
              >
                {added ? (
                  <span className="flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in">
                    Added to Cart!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Add to Cart</span>
                )}
              </button>
              <button
                onClick={handleLike}
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#12203D] bg-white transition-all duration-300 ${
                  likeAnim ? 'scale-90 bg-[#F7F8FA]' : 'hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#12203D]'
                }`}
              >
                <Heart
                  size={24}
                  strokeWidth={3}
                  className={`transition-colors duration-300 ${
                    liked ? 'fill-[#F44336] text-[#F44336]' : 'fill-transparent text-[#12203D]'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-32">
          <div className="mb-10 flex items-center justify-between border-b-4 border-[#12203D] pb-6">
            <h2 className="font-['Outfit'] text-[2.5rem] font-black leading-none tracking-tight text-[#12203D]">
              YOU MAY ALSO LIKE
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="group flex flex-col rounded-3xl border-2 border-[#12203D] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#12203D] overflow-hidden">
                <div className="relative flex aspect-[4/5] w-full items-center justify-center border-b-4 border-[#12203D] bg-[#F7F8FA] p-6 overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <h3 className="line-clamp-2 text-[15px] font-bold text-[#12203D]">{p.name}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[20px] font-black text-[#12203D]">{formatNaira(p.price)}</span>
                    <div className="flex h-10 w-10 items-center justify-center border-2 border-[#12203D] bg-white text-[#12203D] shadow-[4px_4px_0_0_#12203D] group-hover:bg-[#12203D] group-hover:text-white group-hover:shadow-none transition-all">
                      <ChevronRight size={20} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
