import { MessageCircle } from 'lucide-react'

export function WhatsAppFlow() {
  return (
    <div className="whatsapp-flow">
      <span><MessageCircle size={20} /> Product or cart summary is prepared.</span>
      <span>Operator confirms stock, delivery area, and payment option.</span>
      <span>Order is created in the admin pipeline for tracking.</span>
    </div>
  )
}
