export function AdminTitle({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="admin-title">
      <span>Operator portal</span>
      <h1>{title}</h1>
      <p>{detail}</p>
    </div>
  )
}
