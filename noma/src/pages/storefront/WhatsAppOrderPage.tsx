import { Button } from '../../design-system/components/Button'
import { SectionTitle } from '../../design-system/components/SectionTitle'
import { WhatsAppFlow } from '../../features/storefront/WhatsAppFlow'

export function WhatsAppOrderPage() {
  return (
    <main className="section narrow">
      <SectionTitle title="WhatsApp order flow" detail="For shoppers who prefer chat, Noma keeps the product context and cart intent intact." />
      <WhatsAppFlow />
      <Button><a href="https://wa.me/2348000000000">Open WhatsApp</a></Button>
    </main>
  )
}
