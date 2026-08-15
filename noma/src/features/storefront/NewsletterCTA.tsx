// NewsletterCTA.tsx
import { Link } from 'react-router-dom'
import { HiStar, HiOutlineArrowRight } from 'react-icons/hi2'

export function NewsletterCTA() {
  return (
    <section className="bg-white py-12 md:py-24 border-t border-b border-black/5 overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 lg:px-12 relative">
        
        {/* Headlines */}
        <div className="mb-10 max-w-4xl z-10 relative md:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-red-600 mb-4">
            <HiStar className="text-sm fill-red-600" />
            <span>NOMA PREMIUM HOME SELECTION</span>
          </div>

          <h2 className="font-['Outfit'] text-[2.2rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-black leading-[0.95] tracking-tight text-[#12203D]">
            Upgrade your Home Space
            <br />
            <span className="text-[#2F5FE3]">and see the difference</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-end justify-between gap-8 lg:gap-20">
          
          {/* Mockup Cards (Mobile responsive scroll container with phone & appliance showcase) */}
          <div className="w-full lg:w-auto overflow-x-auto pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-max justify-start relative z-10 px-1">
              
              {/* Card 1: Power Up */}
              <div className="flex flex-col w-[120px] sm:w-[160px] md:w-[210px] h-[230px] sm:h-[310px] md:h-[410px] bg-gradient-to-b from-[#1E3A8A] to-[#12203D] rounded-[1.5rem] md:rounded-[2.2rem] border-[4px] md:border-[6px] border-[#12203D] shadow-xl relative overflow-hidden shrink-0 mt-6 md:mt-12 transition-transform duration-500 hover:-translate-y-2">
                <div className="p-3 md:p-6 pb-0 flex-1 relative z-10">
                  <span className="text-red-400 text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider">POWER DEALS</span>
                  <h3 className="text-white text-base sm:text-xl md:text-2xl font-black leading-tight mt-1 font-['Outfit']">
                    power<br/>up
                  </h3>
                  <p className="text-white/60 text-[8px] sm:text-[10px] md:text-xs font-bold uppercase mt-1">Generators & Solar</p>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
                <div className="p-3 md:p-5 relative z-10 mt-auto">
                  <Link to="/category/appliances" className="flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-7 sm:h-9 md:h-10 rounded-full font-bold text-[9px] sm:text-xs shadow-xs transition-colors backdrop-blur-xs">
                    Shop Power
                  </Link>
                </div>
              </div>

              {/* Card 2: Center Phone & Display Showcase (Elevated) */}
              <div className="flex flex-col w-[130px] sm:w-[170px] md:w-[220px] h-[240px] sm:h-[330px] md:h-[430px] bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] rounded-[1.5rem] md:rounded-[2.2rem] border-[4px] md:border-[6px] border-[#12203D] shadow-[0_20px_40px_rgba(29,78,216,0.35)] relative overflow-hidden shrink-0 transition-transform duration-500 hover:-translate-y-2 z-20">
                <div className="p-3 md:p-6 pb-0 text-center mt-2 md:mt-4 z-10">
                  <span className="text-amber-300 text-[9px] sm:text-[11px] font-black uppercase tracking-widest">SMART LIVING</span>
                  <h3 className="text-white text-base sm:text-2xl md:text-3xl font-black leading-none drop-shadow-md mt-1 font-['Outfit']">
                    every<br/>view<br/>counts
                  </h3>
                </div>
                
                <div className="my-auto text-center px-3 z-10">
                  <div className="inline-block bg-white/20 backdrop-blur-md rounded-2xl p-2 border border-white/30 text-white font-bold text-[9px] sm:text-xs">
                    Phones • Smart TVs • Audio
                  </div>
                </div>
                
                <div className="p-3 md:p-6 relative z-10 mt-auto">
                  <Link to="/catalog" className="flex items-center justify-center w-full bg-white text-[#12203D] h-8 sm:h-10 md:h-11 rounded-full font-extrabold text-[10px] sm:text-xs md:text-sm shadow-md hover:bg-gray-100 transition-colors">
                    Shop Catalog
                  </Link>
                </div>
              </div>

              {/* Card 3: Cook Smart */}
              <div className="flex flex-col w-[120px] sm:w-[160px] md:w-[210px] h-[230px] sm:h-[310px] md:h-[410px] bg-gradient-to-b from-[#111827] to-black rounded-[1.5rem] md:rounded-[2.2rem] border-[4px] md:border-[6px] border-[#12203D] shadow-xl relative overflow-hidden shrink-0 mt-4 md:mt-8 transition-transform duration-500 hover:-translate-y-2">
                <div className="p-3 md:p-6 pb-0 flex-1 relative z-10">
                  <span className="text-amber-400 text-[9px] sm:text-[11px] font-extrabold uppercase tracking-wider">KITCHEN TECH</span>
                  <h3 className="text-[#F5A623] text-base sm:text-xl md:text-2xl font-black leading-tight mt-1 font-['Outfit']">
                    cook<br/>smart
                  </h3>
                  <p className="text-white/60 text-[8px] sm:text-[10px] md:text-xs font-bold uppercase mt-1">Air Fryers & Blenders</p>
                </div>
                <div className="p-3 md:p-5 relative z-10 mt-auto">
                  <Link to="/category/kitchen" className="flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 h-7 sm:h-9 md:h-10 rounded-full font-bold text-[9px] sm:text-xs shadow-xs transition-colors backdrop-blur-xs">
                    Shop Kitchen
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* CTA Text & Button */}
          <div className="flex flex-col items-start lg:items-end text-left lg:text-right max-w-md ml-0 lg:ml-auto z-10 relative mt-4 lg:mt-0">
            <p className="text-[14px] sm:text-[16px] md:text-[17px] font-medium text-[#12203D]/70 mb-6 leading-relaxed">
              Build momentum with premium appliances, clear aesthetic designs, and home technology that keeps your daily workflow smooth and stress-free.
            </p>
            <Link
              to="/catalog"
              className="inline-flex h-12 md:h-14 items-center justify-center gap-2.5 rounded-full bg-[#12203D] px-8 text-[14px] md:text-[15px] font-extrabold text-white transition-all hover:bg-[#2F5FE3] active:scale-[0.98] shadow-lg"
            >
              <span>Explore All Products</span>
              <HiOutlineArrowRight className="text-base" />
            </Link>
            
            <div className="mt-4 flex items-center gap-2">
              <HiStar className="fill-amber-400 text-amber-400" size={18} />
              <span className="text-[12px] md:text-[14px] font-bold text-[#12203D]">
                4.9/5 rated by verified Nigerian homes
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
