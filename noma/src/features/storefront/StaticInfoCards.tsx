import { EmptyState } from '../../design-system/components/EmptyState'

export function StaticInfoCards() {
  return (
    <div className="policy-grid">
      <EmptyState title="Trust at the moment of doubt" detail="CAC, phone, delivery, and return details appear near buying actions." />
      <EmptyState title="WhatsApp as checkout" detail="Chat handoff is a first-class flow from product pages, cart, and support screens." />
      <EmptyState title="Mobile-first retail" detail="Navigation, filters, and checkout controls stay thumb-friendly on Nigerian mobile traffic." />
    </div>
  )
}
