import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { products } from '../../mock/commerce'
import { useCartStore } from '../../store/cartStore'
import { formatNaira } from '../../utils/pricing'

export function CartPage() {
  const navigate = useNavigate()
  const { items, addItem, removeItem } = useCartStore()
  const cartProducts = products.filter((p) => items[p.id])
  const subtotal = cartProducts.reduce((sum, p) => sum + p.finalPrice * items[p.id], 0)
  const deliveryFee = cartProducts.length > 0 ? 6500 : 0

  return (
    <div className="min-h-screen bg-[#F9F9F6] selection:bg-[#12203D] selection:text-white">
      <div className="h-[88px]" />
      
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8 lg:px-12">
        {/* Navigation & Header */}
        <div className="mb-10 flex flex-col gap-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#12203D]/60 transition-colors hover:text-[#12203D]"
          >
            <ArrowLeft size={16} strokeWidth={3} /> CONTINUE SHOPPING
          </button>
          
          <div className="flex items-end justify-between border-b-4 border-[#12203D] pb-6">
            <h1 className="font-['Outfit'] text-[3.5rem] font-black leading-none tracking-tighter text-[#12203D] md:text-[5rem]">
              YOUR CART
            </h1>
            <span className="mb-2 text-[14px] font-black uppercase tracking-widest text-[#12203D]/50">
              {cartProducts.length} ITEM{cartProducts.length !== 1 ? 'S' : ''}
            </span>
          </div>
        </div>

        {cartProducts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center rounded-3xl border-4 border-dashed border-[#12203D]/20 py-32 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#F7F8FA] border-4 border-[#12203D] shadow-[4px_4px_0_0_#12203D]">
              <ShoppingBag size={40} className="text-[#12203D]" strokeWidth={2} />
            </div>
            <h2 className="text-[2rem] font-black tracking-tight text-[#12203D] uppercase">Cart is Empty</h2>
            <p className="mt-2 mb-8 text-[14px] font-bold text-[#12203D]/50 uppercase tracking-widest">
              Fill it up with premium home upgrades
            </p>
            <Link
              to="/catalog"
              className="rounded-full border-4 border-[#12203D] bg-[#12203D] px-10 py-5 text-[14px] font-black uppercase tracking-widest text-white shadow-[6px_6px_0_0_#12203D] transition-all hover:translate-y-1 hover:shadow-none hover:bg-white hover:text-[#12203D]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_450px]">
            {/* Cart Items List */}
            <div className="flex flex-col gap-6">
              {cartProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row gap-6 rounded-3xl border-2 border-[#12203D] bg-white p-6 shadow-[6px_6px_0_0_#12203D] transition-transform hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border-2 border-[#12203D] bg-[#F7F8FA] sm:h-40 sm:w-40 p-4 relative">
                    {product.badge && (
                      <div className="absolute left-0 top-0 border-b-2 border-r-2 border-[#12203D] bg-[#10B981] px-2 py-1 text-[9px] font-black uppercase text-white">
                        {product.badge}
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-2">
                        <Link to={`/product/${product.slug}`}>
                          <h3 className="text-[18px] font-black leading-tight text-[#12203D] hover:underline">
                            {product.name}
                          </h3>
                        </Link>
                        <span className="text-[12px] font-bold uppercase tracking-widest text-[#12203D]/50">
                          {product.category}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => {
                          for (let i = 0; i < items[product.id]; i++) removeItem(product.id)
                          toast.info('Item removed', { description: product.name })
                        }}
                        aria-label={`Remove ${product.name}`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#12203D] bg-white text-[#12203D] transition-colors hover:bg-[#F44336] hover:text-white"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                      {/* Price Stack */}
                      <div className="flex flex-col">
                        <span className="text-[24px] font-black tracking-tight text-[#12203D]">
                          {formatNaira(product.finalPrice * items[product.id])}
                        </span>
                        {items[product.id] > 1 && (
                          <span className="text-[12px] font-bold text-[#12203D]/40">
                            {formatNaira(product.finalPrice)} EACH
                          </span>
                        )}
                      </div>
                      
                      {/* Qty Controls */}
                      <div className="flex h-12 items-center rounded-2xl border-2 border-[#12203D] bg-[#F7F8FA] overflow-hidden">
                        <button
                          onClick={() => removeItem(product.id)}
                          className="flex h-full w-12 items-center justify-center text-[#12203D] hover:bg-white hover:text-black"
                        >
                          <Minus size={16} strokeWidth={3} />
                        </button>
                        <div className="flex h-full w-12 items-center justify-center border-x-2 border-[#12203D] bg-white text-[15px] font-black">
                          {items[product.id]}
                        </div>
                        <button
                          onClick={() => addItem(product.id)}
                          className="flex h-full w-12 items-center justify-center text-[#12203D] hover:bg-white hover:text-black"
                        >
                          <Plus size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Block */}
            <div className="sticky top-28 h-fit rounded-3xl border-2 border-[#12203D] bg-white p-8 shadow-[6px_6px_0_0_#12203D]">
              <h2 className="mb-8 border-b-4 border-[#12203D] pb-4 font-['Outfit'] text-[2.5rem] font-black leading-none tracking-tight text-[#12203D]">
                SUMMARY
              </h2>

              <div className="flex flex-col gap-6 text-[14px]">
                <div className="flex items-end justify-between text-[#12203D]/70 font-black uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-[16px] text-[#12203D]">{formatNaira(subtotal)}</span>
                </div>
                
                <div className="flex items-end justify-between text-[#12203D]/70 font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <Truck size={16} strokeWidth={3} /> Delivery
                  </span>
                  <span className="text-[16px] text-[#12203D]">{formatNaira(deliveryFee)}</span>
                </div>
                
                <div className="flex items-center gap-2 rounded-xl bg-[#F7F8FA] border-l-4 border-[#10B981] p-3 text-[10px] font-black uppercase tracking-widest text-[#12203D]/70">
                  <span className="text-[#10B981]">Note:</span> Delivery fee is estimated. Final calculation at checkout.
                </div>
              </div>

              <div className="my-8 border-t-4 border-dashed border-[#12203D]/20" />

              <div className="mb-8 flex items-end justify-between font-black uppercase tracking-widest text-[#12203D]">
                <span className="text-[18px]">Total</span>
                <span className="text-[32px] leading-none tracking-tight">{formatNaira(subtotal + deliveryFee)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#12203D] text-[15px] font-black uppercase tracking-widest text-white transition-all hover:bg-black active:scale-[0.98]"
              >
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
