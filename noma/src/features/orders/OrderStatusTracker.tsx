const labels = ['Placed', 'Packed', 'Dispatched', 'Delivered']

export function OrderStatusTracker({ completed = 1 }: { completed?: number }) {
  return (
    <div className="tracker">
      {labels.map((status, index) => <span className={index <= completed ? 'done' : ''} key={status}>{status}</span>)}
    </div>
  )
}
