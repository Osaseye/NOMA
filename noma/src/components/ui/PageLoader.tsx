import { useEffect, useState } from 'react'

/**
 * PageLoader — Full-screen branded loading animation that plays on the first
 * page load. Fades out once assets are ready.
 */
export function PageLoader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Start fade after content is "ready" (slight delay for smoothness)
    const timer = setTimeout(() => setFadeOut(true), 1200)
    // Remove from DOM after animation completes
    const cleanup = setTimeout(() => setVisible(false), 1700)
    return () => {
      clearTimeout(timer)
      clearTimeout(cleanup)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#12203D] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <img
        src="/logo.PNG"
        alt="Noma"
        className="h-24 w-40 object-contain brightness-0 invert mb-10"
      />

      {/* Animated bar loader */}
      <div className="flex items-end gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-white/80"
            style={{
              height: '32px',
              animation: `nomaBarPulse 1s ease-in-out infinite`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes nomaBarPulse {
          0%, 100% { transform: scaleY(0.3); opacity: 0.4; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
