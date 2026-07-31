import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NewsletterCTA() {
  return (
    <section className="bg-white py-20 md:py-32 border-b border-[#12203D]/10 overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 lg:px-12 relative">
        
        {/* Headlines */}
        <div className="mb-16 max-w-4xl z-10 relative">
          <h2 className="font-['Outfit'] text-[4rem] md:text-[6rem] lg:text-[7.5rem] font-black leading-[0.9] tracking-tighter text-[#12203D]">
            Upgrade your Home Space
            <br />
            <span className="text-[#12203D]/30">and see the difference</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 lg:gap-24">
          
          {/* Mockup Cards (Simulating the phones) */}
          <div className="flex gap-4 md:gap-6 justify-center lg:justify-start w-full lg:w-auto relative z-10">
            {/* Card 1 */}
            <div className="flex flex-col w-[140px] md:w-[220px] h-[280px] md:h-[440px] bg-gradient-to-b from-[#1E3A8A] to-[#12203D] rounded-[2rem] border-[6px] border-[#12203D] shadow-2xl relative overflow-hidden shrink-0 mt-12 transition-transform duration-500 hover:-translate-y-4">
              <div className="p-4 md:p-6 pb-0 flex-1">
                <h3 className="text-white text-lg md:text-2xl font-black leading-tight">power<br/>up</h3>
                <p className="text-white/60 text-[10px] md:text-xs font-bold uppercase mt-2">premium generators</p>
              </div>
              <img src="/products/generator.png" alt="Generator" className="w-[120%] max-w-none -ml-[10%] drop-shadow-2xl absolute bottom-[-10%] md:bottom-[-20%] object-contain scale-[1.2]" />
            </div>

            {/* Card 2 (Center, slightly elevated) */}
            <div className="flex flex-col w-[140px] md:w-[220px] h-[280px] md:h-[440px] bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] rounded-[2rem] border-[6px] border-[#12203D] shadow-[0_32px_64px_rgba(29,78,216,0.3)] relative overflow-hidden shrink-0 transition-transform duration-500 hover:-translate-y-4 z-20">
              <div className="p-4 md:p-6 pb-0 text-center mt-4 z-10">
                <h3 className="text-white text-xl md:text-3xl font-black leading-none drop-shadow-md">every<br/>view<br/>counts</h3>
              </div>
              <div className="absolute inset-0 bg-[url('/products/hero-tv.png')] bg-contain bg-center bg-no-repeat opacity-90 scale-[1.3] mix-blend-screen" />
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%]">
                <Link to="/catalog" className="flex items-center justify-center w-full bg-white text-[#12203D] h-10 md:h-12 rounded-full font-bold text-xs md:text-sm shadow-xl hover:bg-gray-100 transition-colors">
                  Shop TVs
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col w-[140px] md:w-[220px] h-[280px] md:h-[440px] bg-gradient-to-b from-[#111827] to-black rounded-[2rem] border-[6px] border-[#12203D] shadow-2xl relative overflow-hidden shrink-0 mt-8 transition-transform duration-500 hover:-translate-y-4">
              <div className="p-4 md:p-6 pb-0 flex-1">
                <h3 className="text-[#F5A623] text-lg md:text-2xl font-black leading-tight">cook<br/>smart</h3>
              </div>
              <img src="/products/air-fryer.png" alt="Air Fryer" className="w-[90%] mx-auto drop-shadow-2xl absolute bottom-[10%] right-[5%] object-contain" />
            </div>
          </div>

          {/* CTA Text & Button */}
          <div className="flex flex-col items-start lg:items-end text-left lg:text-right max-w-sm ml-auto z-10 relative mt-8 lg:mt-0">
            <p className="text-[16px] md:text-[20px] font-medium text-[#12203D]/60 mb-8 leading-snug">
              Build momentum with premium appliances, clear aesthetics and home tech that keeps you on track.
            </p>
            <Link
              to="/catalog"
              className="inline-flex h-16 items-center justify-center rounded-full bg-[#12203D] px-10 text-[16px] font-bold text-white transition-all hover:bg-black active:scale-[0.98] shadow-xl"
            >
              Get Started
            </Link>
            
            <div className="mt-6 flex items-center gap-2">
              <Star className="fill-[#F5A623] text-[#F5A623]" size={20} />
              <span className="text-[14px] font-bold text-[#12203D]">
                4.9/5 based on 10k reviews
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
