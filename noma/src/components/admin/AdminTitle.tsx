export function AdminTitle({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="mb-8 flex flex-col gap-1.5 border-b border-[#12203D]/10 pb-6">
      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2F5FE3]">Operator Portal</span>
      <h1 className="font-['Outfit'] text-[2rem] md:text-[2.5rem] font-black leading-tight tracking-tight text-[#12203D]">{title}</h1>
      <p className="text-[14px] font-medium text-[#12203D]/60 max-w-2xl">{detail}</p>
    </div>
  )
}
