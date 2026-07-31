import { FlashDeals } from '../../features/storefront/FlashDeals'
import { HomeHero } from '../../features/storefront/HomeHero'
import { NewArrivals } from '../../features/storefront/NewArrivals'
import { NewsletterCTA } from '../../features/storefront/NewsletterCTA'
import { ShopByCategory } from '../../features/storefront/ShopByCategory'
import { TrendingNow } from '../../features/storefront/TrendingNow'
import { TrustStrip } from '../../features/storefront/TrustStrip'

export function HomePage() {
  return (
    <main>
      <HomeHero />
      <TrustStrip />
      <TrendingNow />
      <ShopByCategory />
      <FlashDeals />
      <NewArrivals />
      <NewsletterCTA />
    </main>
  )
}
