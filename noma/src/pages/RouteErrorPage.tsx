import { useEffect, useState } from 'react'
import { ArrowClockwise, ArrowLeft, CaretDown } from '@phosphor-icons/react'
import { Link, isRouteErrorResponse, useLocation, useRouteError } from 'react-router-dom'
import { StorefrontErrorPage } from './storefront/StorefrontErrorPage'

const RELOAD_FLAG = 'noma_chunk_reload_attempted'

function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '')
  return /dynamically imported module|Importing a module script failed|Loading chunk|ChunkLoadError|error loading dynamically/i.test(
    message
  )
}

/**
 * Route-level error boundary for both storefront and admin.
 * - 404 responses reuse the designed storefront 404 page.
 * - Stale/failed lazy chunks (common after a deploy or dev hot-reload) silently reload once.
 * - Everything else gets a calm, branded recovery screen instead of the raw router dump.
 */
export function RouteErrorPage() {
  const error = useRouteError()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const chunkError = isChunkLoadError(error)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (!chunkError) return
    if (sessionStorage.getItem(RELOAD_FLAG)) return
    sessionStorage.setItem(RELOAD_FLAG, '1')
    window.location.reload()
  }, [chunkError])

  useEffect(() => {
    // Clear the one-time reload flag once a page renders successfully again later
    const timer = window.setTimeout(() => sessionStorage.removeItem(RELOAD_FLAG), 10000)
    return () => window.clearTimeout(timer)
  }, [])

  if (isRouteErrorResponse(error) && error.status === 404 && !isAdmin) {
    return <StorefrontErrorPage />
  }

  const is404 = isRouteErrorResponse(error) && error.status === 404
  const detailText =
    error instanceof Error
      ? `${error.name}: ${error.message}`
      : isRouteErrorResponse(error)
      ? `${error.status} ${error.statusText}`
      : String(error ?? 'Unknown error')

  const title = is404
    ? 'This page doesn’t exist'
    : chunkError
    ? 'A newer version is available'
    : 'Something went wrong'

  const description = is404
    ? 'The link may be broken or the page may have moved.'
    : chunkError
    ? 'We updated Noma while you were browsing. Refresh to load the latest version.'
    : 'An unexpected problem stopped this page from loading. Your cart and data are safe — try again in a moment.'

  const homeHref = isAdmin ? '/admin' : '/'
  const homeLabel = isAdmin ? 'Back to Dashboard' : 'Back to Home'

  return (
    <div className="flex min-h-screen flex-col bg-white px-5 text-slate-900">
      <header className="mx-auto flex h-16 w-full max-w-5xl items-center">
        <Link to={homeHref} className="inline-flex items-center gap-2.5">
          <img
            src="/icon.png"
            alt="Noma"
            className="h-8 w-8 object-contain"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = '/logo.PNG'
            }}
          />
          <span className="text-base font-bold tracking-tight text-slate-950">
            {isAdmin ? 'Noma Admin' : 'Noma'}
          </span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center pb-24">
        <span className="text-xs font-semibold text-slate-400">
          {is404 ? 'Error 404' : chunkError ? 'Update' : 'Error'}
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(RELOAD_FLAG)
              window.location.reload()
            }}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-6 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <ArrowClockwise size={14} weight="bold" />
            <span>{chunkError ? 'Refresh Now' : 'Try Again'}</span>
          </button>
          <Link
            to={homeHref}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 px-6 text-xs font-semibold text-slate-900 transition-colors hover:border-slate-950"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>{homeLabel}</span>
          </Link>
        </div>

        {!is404 ? (
          <div className="mt-10 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700"
            >
              <span>Technical details</span>
              <CaretDown
                size={11}
                className={`transition-transform ${showDetails ? 'rotate-180' : ''}`}
              />
            </button>
            {showDetails ? (
              <p className="mt-2 break-words text-[11px] leading-relaxed text-slate-500">
                {detailText}
              </p>
            ) : null}
          </div>
        ) : null}
      </main>
    </div>
  )
}
