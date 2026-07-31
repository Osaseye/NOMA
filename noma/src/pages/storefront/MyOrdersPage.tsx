import { CheckCircle2, ChevronDown, ChevronUp, MapPin, Package, Truck, User } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatNaira } from '../../utils/pricing'

// Mock Data for User's Orders
const myOrders = [
  {
    id: 'NMA-2891A',
    date: '24 Oct 2024',
    total: 326500,
    status: 'in-transit',
    items: [
      { name: 'Sumec Firman Generator 2.5KVA', qty: 1, image: '/products/generator.png' }
    ],
    tracking: [
      { status: 'Order Placed', date: '24 Oct, 09:30 AM', completed: true },
      { status: 'Processing', date: '24 Oct, 11:15 AM', completed: true },
      { status: 'Dispatched', date: '25 Oct, 08:00 AM', completed: true },
      { status: 'In Transit', date: 'Expected today', completed: false },
      { status: 'Delivered', date: 'Pending', completed: false },
    ]
  },
  {
    id: 'NMA-1422B',
    date: '12 Sep 2024',
    total: 95000,
    status: 'delivered',
    items: [
      { name: 'Xiaomi Smart Air Fryer', qty: 1, image: '/products/air-fryer.png' }
    ],
    tracking: [
      { status: 'Order Placed', date: '12 Sep, 10:00 AM', completed: true },
      { status: 'Processing', date: '12 Sep, 02:00 PM', completed: true },
      { status: 'Dispatched', date: '13 Sep, 09:30 AM', completed: true },
      { status: 'In Transit', date: '13 Sep, 01:15 PM', completed: true },
      { status: 'Delivered', date: '14 Sep, 11:45 AM', completed: true },
    ]
  }
]

function TrackingTimeline({ steps }: { steps: any[] }) {
  return (
    <div className="mt-6 flex flex-col gap-6 pl-2 border-t-4 border-dashed border-[#12203D]/10 pt-8">
      <h3 className="font-black uppercase tracking-widest text-[#12203D]">Tracking Timeline</h3>
      <div className="relative flex flex-col gap-8">
        <div className="absolute bottom-0 left-[11px] top-2 w-[4px] bg-[#F7F8FA]" />
        {steps.map((step, i) => (
          <div key={i} className="relative z-10 flex items-start gap-6">
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-4 outline outline-4 outline-white ${
                step.completed ? 'border-[#10B981] bg-[#10B981]' : 'border-[#12203D]/20 bg-white'
              }`}
            >
              {step.completed && <CheckCircle2 size={12} className="text-white" strokeWidth={4} />}
            </div>
            <div className="flex flex-col -mt-1">
              <span className={`text-[15px] font-black uppercase tracking-widest ${step.completed ? 'text-[#12203D]' : 'text-[#12203D]/40'}`}>
                {step.status}
              </span>
              <span className="text-[12px] font-bold text-[#12203D]/50">{step.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MyOrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(myOrders[0].id)

  return (
    <div className="min-h-screen bg-[#F9F9F6] selection:bg-[#12203D] selection:text-white">
      <div className="h-[88px]" />

      <div className="mx-auto w-full max-w-[1000px] px-4 py-8 md:px-8 lg:px-12">
        <div className="mb-10 flex items-end justify-between border-b-4 border-[#12203D] pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <User size={32} strokeWidth={3} className="text-[#12203D]" />
              <h1 className="font-['Outfit'] text-[3rem] font-black leading-none tracking-tighter text-[#12203D] md:text-[5rem]">
                MY ORDERS
              </h1>
            </div>
            <span className="text-[14px] font-black uppercase tracking-widest text-[#12203D]/50">
              Track and manage your history
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {myOrders.map((order) => {
            const isExpanded = expandedOrder === order.id
            return (
              <div
                key={order.id}
                className="flex flex-col rounded-3xl border-2 border-[#12203D] bg-white shadow-[6px_6px_0_0_#12203D] transition-all overflow-hidden"
              >
                {/* Order Header */}
                <div 
                  className={`flex cursor-pointer flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 md:p-8 transition-colors hover:bg-[#F7F8FA] ${isExpanded ? 'bg-[#F7F8FA]' : ''}`}
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[20px] font-black uppercase tracking-widest text-[#12203D]">
                        #{order.id}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        order.status === 'delivered' ? 'bg-[#E8F5EB] text-[#10B981]' : 'bg-[#EEF2FF] text-[#2F5FE3]'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-[12px] font-bold text-[#12203D]/50 uppercase tracking-widest">{order.date}</span>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex flex-col items-start md:items-end gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#12203D]/50">Total</span>
                      <span className="text-[20px] font-black text-[#12203D]">{formatNaira(order.total)}</span>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center border-2 border-[#12203D] bg-white text-[#12203D] transition-all hover:bg-[#12203D] hover:text-white">
                      {isExpanded ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content: Items & Tracking */}
                {isExpanded && (
                  <div className="flex flex-col p-6 md:p-8 border-t-4 border-[#12203D] bg-white">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                      
                      {/* Items */}
                      <div className="flex flex-col gap-6">
                        <h3 className="font-black uppercase tracking-widest text-[#12203D]">Items Ordered</h3>
                        <div className="flex flex-col gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 border-2 border-[#12203D]/10 p-3">
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-[#12203D]/10 bg-[#F7F8FA] p-2">
                                <img src={item.image} alt={item.name} className="h-full w-full object-contain mix-blend-multiply" />
                              </div>
                              <div className="flex flex-col">
                                <span className="line-clamp-2 text-[14px] font-bold text-[#12203D]">{item.name}</span>
                                <span className="mt-1 text-[11px] font-black uppercase tracking-widest text-[#12203D]/50">Qty: {item.qty}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex gap-4">
                          <Link to={`/catalog`} className="flex h-12 flex-1 items-center justify-center rounded-xl border-2 border-[#12203D] text-[12px] font-black uppercase tracking-widest text-[#12203D] transition-all hover:bg-[#12203D] hover:text-white">
                            Buy Again
                          </Link>
                          {order.status === 'delivered' && (
                            <button className="flex h-12 flex-1 items-center justify-center rounded-xl border-2 border-[#12203D] bg-[#12203D] text-[12px] font-black uppercase tracking-widest text-white transition-all hover:bg-black">
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Tracking */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center border-2 border-[#12203D] bg-[#EEF2FF]">
                            <Truck size={20} strokeWidth={2.5} className="text-[#2F5FE3]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[12px] font-black uppercase tracking-widest text-[#12203D]/50">Delivery Status</span>
                            <span className="text-[16px] font-black uppercase text-[#12203D]">
                              {order.status === 'delivered' ? 'Delivered successfully' : 'Arriving Soon'}
                            </span>
                          </div>
                        </div>

                        <TrackingTimeline steps={order.tracking} />
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
