import { HomeHero } from '../../features/storefront/HomeHero'
import { TrustStrip } from '../../features/storefront/TrustStrip'
import { TrendingNow } from '../../features/storefront/TrendingNow'
import { ShopByCategory } from '../../features/storefront/ShopByCategory'
import { TodaysBestDeals } from '../../features/storefront/TodaysBestDeals'
import { WhyNoma } from '../../features/storefront/WhyNoma'
import { CuratedBanners } from '../../features/storefront/CuratedBanners'
import { NewsletterCTA } from '../../features/storefront/NewsletterCTA'

export function HomePage() {
  return (
    <main>
      <HomeHero />
      <TrustStrip />
      <TrendingNow />
      <ShopByCategory />
      <TodaysBestDeals />
      <WhyNoma />
      <CuratedBanners />
      <NewsletterCTA />
    </main>
  )
}
