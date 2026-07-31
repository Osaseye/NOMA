export function SkeletonGrid() {
  return (
    <div className="product-grid" aria-label="Loading products">
      {Array.from({ length: 6 }).map((_, index) => <span className="skeleton-card" key={index} />)}
    </div>
  )
}
