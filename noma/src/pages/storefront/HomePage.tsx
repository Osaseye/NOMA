import { CuratedBanners } from '../../features/storefront/CuratedBanners'
import { HomeHero } from '../../features/storefront/HomeHero'
import { NewsletterCTA } from '../../features/storefront/NewsletterCTA'
import { ShopByCategory } from '../../features/storefront/ShopByCategory'
import { TodaysBestDeals } from '../../features/storefront/TodaysBestDeals'
import { TrendingNow } from '../../features/storefront/TrendingNow'
import { TrustStrip } from '../../features/storefront/TrustStrip'

export function HomePage() {
  return (
    <div className="space-y-12 pb-16 sm:space-y-16">
      <HomeHero />
      <TrustStrip />
      <ShopByCategory />
      <TrendingNow />
      <TodaysBestDeals />
      <CuratedBanners />
      <NewsletterCTA />
    </div>
  )
}
