import { CheckCircle } from '@phosphor-icons/react'

const labels = ['Placed', 'Packed', 'Dispatched', 'Delivered']

export function OrderStatusTracker({ completed = 1 }: { completed?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {labels.map((status, index) => {
        const isDone = index <= completed
        const isCurrent = index === completed
        return (
          <div
            key={status}
            className={`flex items-center justify-between rounded-[6px] border px-3 py-2 text-xs font-semibold ${
              isCurrent
                ? 'border-[#1049EB] bg-[#EEF3FE] text-[#1049EB]'
                : isDone
                ? 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
                : 'border-[#E5E7EB] bg-[#F6F7F9] text-[#5E6675]'
            }`}
          >
            <span>{status}</span>
            {isDone ? <CheckCircle size={14} weight="regular" /> : null}
          </div>
        )
      })}
    </div>
  )
}
