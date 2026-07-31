import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { StoreFooter } from '../../components/layout/StoreFooter'
import { StoreHeader } from '../../components/layout/StoreHeader'
import { AlertTriangle, MapPinOff } from 'lucide-react'

export function StorefrontErrorPage() {
  const error = useRouteError()
  
  let title = "Oops! Something went wrong"
  let message = "We're sorry, but an unexpected error occurred while loading this page. Our team has been notified."
  let Icon = AlertTriangle

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page Not Found"
      message = "The page you are looking for doesn't exist, has been removed, or is temporarily unavailable."
      Icon = MapPinOff
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA] font-sans text-[#12203D]">
      <StoreHeader />
      
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center md:px-8">
        <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EEF2FF]">
            <Icon size={40} className="text-[#2F5FE3]" strokeWidth={2} />
          </div>
        </div>
        
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-[#12203D] md:text-5xl">
          {title}
        </h1>
        
        <p className="mb-10 max-w-md text-[15px] font-medium leading-relaxed text-[#12203D]/60 md:text-base">
          {message}
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex h-14 items-center justify-center rounded-2xl bg-[#2F5FE3] px-8 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(47,95,227,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#2348C0] active:scale-[0.98]"
          >
            Return to Homepage
          </Link>
          <Link
            to="/catalog"
            className="flex h-14 items-center justify-center rounded-2xl border-2 border-black/5 bg-transparent px-8 text-[15px] font-bold text-[#12203D] transition-all hover:bg-white active:scale-[0.98]"
          >
            Browse Catalog
          </Link>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
