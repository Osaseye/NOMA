// WhyNoma.tsx
import { HiCheck, HiOutlineShieldCheck, HiOutlineTruck, HiOutlineBanknotes } from 'react-icons/hi2'

export function WhyNoma() {
  return (
    <section className="bg-[#F7F8FA] py-14 md:py-20 border-t border-black/5">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="mb-10 text-left md:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-100 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-red-600 mb-3">
            <span>THE NOMA DIFFERENCE</span>
          </div>
          <h2 className="font-['Outfit'] text-3xl font-black tracking-tight text-[#12203D] sm:text-4xl md:text-5xl">
            Why Nigerians Choose <span className="text-[#2F5FE3]">Noma</span>
          </h2>
          <p className="mt-2 text-sm text-[#12203D]/70 md:text-base font-medium max-w-xl">
            We removed market stress, unpredictable delivery pricing, and counterfeit electronics so you can shop with total confidence.
          </p>
        </div>

        {/* Mobile Horizontal Swipe / Desktop Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 scrollbar-none pb-4 lg:grid lg:grid-cols-12 lg:gap-6 lg:overflow-visible lg:pb-0">
          
          {/* Main Hero Card (Left - 5 Cols) */}
          <div className="w-[88%] sm:w-[70%] lg:w-auto shrink-0 snap-center lg:col-span-5 flex flex-col justify-between rounded-3xl bg-[#12203D] p-7 md:p-9 text-white shadow-xl relative overflow-hidden">
            {/* Background design glow */}
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#2F5FE3]/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />

            <div className="relative z-10">
              <span className="inline-block rounded-lg bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white mb-6">
                GUARANTEED TRANSPARENCY
              </span>
              <h3 className="font-['Outfit'] text-2xl md:text-3xl font-black leading-tight text-white">
                Zero Hidden Market Stress. <br />
                <span className="text-white/70">What you see is what you pay.</span>
              </h3>
              <p className="mt-4 text-xs md:text-sm text-white/80 font-medium leading-relaxed">
                Unlike traditional marketplaces with arbitrary delivery prices, Noma verifies all shipping fees upfront before checkout. No last-minute surprises.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white border border-white/20">
                  <HiOutlineShieldCheck className="text-xl" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Pay-on-Delivery</div>
                  <div className="text-[11px] text-white/60 font-medium">Available in major cities</div>
                </div>
              </div>
              <span className="text-xs font-black text-red-400 bg-red-950/40 px-3 py-1 rounded-full border border-red-800/40">
                VERIFIED
              </span>
            </div>
          </div>

          {/* Right Column: 3 Numbered Feature Blocks (7 Cols) */}
          <div className="w-[88%] sm:w-[70%] lg:w-auto shrink-0 snap-center lg:col-span-7 flex flex-col gap-4">
            
            {/* Feature 1 */}
            <div className="group flex items-start gap-4 md:gap-6 rounded-3xl border border-black/5 bg-white p-5 md:p-6 shadow-xs transition-all duration-300 hover:border-[#2F5FE3]/30 hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4FF] text-base font-black text-[#2F5FE3] border border-[#D9E6FF]">
                01
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-[#12203D] md:text-lg">
                    Genuine Home Electronics & Appliances
                  </h4>
                  <HiCheck className="text-emerald-600 text-lg shrink-0" />
                </div>
                <p className="mt-1 text-xs md:text-sm font-medium leading-relaxed text-[#12203D]/70">
                  Every generator, air fryer, TV, and kitchen item is directly sourced and tested to perform under local Nigerian conditions.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group flex items-start gap-4 md:gap-6 rounded-3xl border border-black/5 bg-white p-5 md:p-6 shadow-xs transition-all duration-300 hover:border-red-200 hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-base font-black text-red-600 border border-red-100">
                02
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-[#12203D] md:text-lg">
                    Fast Doorstep Delivery Nationwide
                  </h4>
                  <HiOutlineTruck className="text-red-600 text-lg shrink-0" />
                </div>
                <p className="mt-1 text-xs md:text-sm font-medium leading-relaxed text-[#12203D]/70">
                  Shipped within 2 to 5 business days with direct WhatsApp status updates and real-time package tracking.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group flex items-start gap-4 md:gap-6 rounded-3xl border border-black/5 bg-white p-5 md:p-6 shadow-xs transition-all duration-300 hover:border-[#2F5FE3]/30 hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4FF] text-base font-black text-[#2F5FE3] border border-[#D9E6FF]">
                03
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-[#12203D] md:text-lg">
                    Human Support via WhatsApp
                  </h4>
                  <HiOutlineBanknotes className="text-[#2F5FE3] text-lg shrink-0" />
                </div>
                <p className="mt-1 text-xs md:text-sm font-medium leading-relaxed text-[#12203D]/70">
                  No automated chatbots or endless phone menus. Chat directly with real customer care agents whenever you have questions.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
