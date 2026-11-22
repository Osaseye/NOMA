import { CuratedBanners } from '../../features/storefront/CuratedBanners'
import { HomeHero } from '../../features/storefront/HomeHero'
import { NewsletterCTA } from '../../features/storefront/NewsletterCTA'
import { ShopByCategory } from '../../features/storefront/ShopByCategory'
import { TodaysBestDeals } from '../../features/storefront/TodaysBestDeals'
import { TrendingNow } from '../../features/storefront/TrendingNow'
import { TrustStrip } from '../../features/storefront/TrustStrip'
import { WhyNoma } from '../../features/storefront/WhyNoma'

export function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustStrip />
      <TrendingNow />
      <ShopByCategory />
      <TodaysBestDeals />
      <WhyNoma />
      <CuratedBanners />
      <NewsletterCTA />
    </>
  )
}
