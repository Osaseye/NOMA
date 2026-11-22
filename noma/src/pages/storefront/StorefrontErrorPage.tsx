import { MapPinLine, WarningCircle } from '@phosphor-icons/react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { StoreFooter } from '../../components/layout/StoreFooter'
import { StoreHeader } from '../../components/layout/StoreHeader'

export function StorefrontErrorPage() {
  const error = useRouteError()

  const is404 = isRouteErrorResponse(error) && error.status === 404
  const statusTag = isRouteErrorResponse(error) ? String(error.status) : 'ERROR'
  const title = is404 ? 'Page Not Found' : 'Something went wrong'
  const message = is404
    ? "The page you requested doesn't exist, was moved, or is temporarily unavailable."
    : 'An unexpected error occurred while loading this page. Try returning to the homepage or catalog.'

  const Icon = is404 ? MapPinLine : WarningCircle

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-[#0B1220]">
      <StoreHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center md:px-8">
        <span className="mb-4 rounded-[4px] border border-[#E5E7EB] bg-[#F6F7F9] px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-[#1049EB]">
          {statusTag}
        </span>

        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-[#F6F7F9] text-[#0B1220]">
          <Icon size={28} weight="regular" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[#0B1220] md:text-4xl">{title}</h1>

        <p className="mt-3 mb-8 max-w-[46ch] text-sm leading-[1.6] text-[#5E6675]">{message}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-[6px] bg-[#0B1220] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1049EB]"
          >
            Return to Homepage
          </Link>
          <Link
            to="/catalog"
            className="inline-flex h-11 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white px-6 text-sm font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9]"
          >
            Browse Catalog
          </Link>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
