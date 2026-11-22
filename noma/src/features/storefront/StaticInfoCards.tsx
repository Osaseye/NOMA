import { ChatCircleDots, DeviceMobile, ShieldCheck } from '@phosphor-icons/react'
import { EmptyState } from '../../design-system/components/EmptyState'

export function StaticInfoCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <EmptyState
        icon={<ShieldCheck size={22} weight="fill" className="text-[#1049EB]" />}
        title="Trust at the moment of decision"
        detail="Wavecrest Solutions identity, phone desk, delivery fees, and 30-day return terms appear clearly beside buying actions."
      />
      <EmptyState
        icon={<ChatCircleDots size={22} weight="regular" className="text-[#15803D]" />}
        title="WhatsApp as first-class checkout"
        detail="Chat handoff is available from product pages, shopping cart, and dedicated support screens."
      />
      <EmptyState
        icon={<DeviceMobile size={22} weight="regular" className="text-[#0B1220]" />}
        title="Mobile-first retail"
        detail="Navigation, filters, and checkout controls stay concise and responsive for Nigerian mobile shoppers."
      />
    </div>
  )
}
