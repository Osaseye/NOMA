import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function LoginForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F6] p-4 text-[#12203D]">
      <section className="w-full max-w-md rounded-3xl border-2 border-[#12203D] bg-white p-8 md:p-10 shadow-[8px_8px_0_0_#12203D] flex flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#12203D] bg-[#F7F8FA] shadow-[4px_4px_0_0_#12203D]">
          <img src="/icon.PNG" alt="Noma Icon" className="h-10 w-10 object-contain" />
        </div>
        
        <h1 className="font-['Outfit'] text-[2rem] font-black tracking-tight leading-tight mb-2">Operator Sign In</h1>
        <p className="text-[13px] font-medium text-[#12203D]/60 mb-8 max-w-xs">
          No public sign-up path exists for this portal. Authorized access only.
        </p>

        <form className="w-full flex flex-col gap-5 text-left" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#12203D]">Email Address</label>
            <input
              type="email"
              defaultValue="operator@noma.ng"
              className="w-full rounded-xl border-2 border-[#12203D] bg-[#F9F9F6] p-3.5 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#12203D]">Password</label>
            <input
              type="password"
              defaultValue="password"
              className="w-full rounded-xl border-2 border-[#12203D] bg-[#F9F9F6] p-3.5 font-bold text-[#12203D] outline-none transition-all focus:border-[#2F5FE3] focus:bg-white"
            />
          </div>

          <Link
            to="/admin"
            className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#12203D] bg-[#2F5FE3] text-[14px] font-extrabold uppercase tracking-wider text-white shadow-[4px_4px_0_0_#12203D] transition-all hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#12203D] active:bg-[#2348C0]"
          >
            <LockKeyhole size={18} strokeWidth={2.5} /> Enter Dashboard
          </Link>
        </form>

        <div className="mt-8 flex items-center gap-2 text-[11px] font-bold text-[#12203D]/40 uppercase tracking-wider">
          <ShieldCheck size={16} /> Protected Operator Environment
        </div>
      </section>
    </div>
  )
}
