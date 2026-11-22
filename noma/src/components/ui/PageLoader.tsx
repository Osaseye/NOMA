import { useEffect, useState } from 'react'

/**
 * PageLoader — Non-blocking hairline top progress indicator on initial mount.
 * Preserves instant LCP without blocking the viewport.
 */
export function PageLoader() {
  const [phase, setPhase] = useState<'loading' | 'finishing' | 'done'>('loading')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('finishing'), 180)
    const t2 = setTimeout(() => setPhase('done'), 460)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[2px] overflow-hidden bg-transparent transition-opacity duration-200 ${
        phase === 'finishing' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="h-full w-full origin-left bg-[#1049EB] transition-transform duration-300 ease-out" />
    </div>
  )
}
