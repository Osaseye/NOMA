export function SectionTitle({ eyebrow, title, detail }: { eyebrow?: string; title: string; detail: string }) {
  return (
    <div className="section-title">
      {eyebrow && <span>{eyebrow}</span>}
      <h1>{title}</h1>
      <p>{detail}</p>
    </div>
  )
}
