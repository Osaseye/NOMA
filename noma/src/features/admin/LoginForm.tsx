import { LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../design-system/components/Button'
import { Field, TextInput } from '../../design-system/components/Field'

export function LoginForm() {
  return (
    <section className="login-card">
      <img src="/icon.PNG" alt="Noma" />
      <h1>Operator sign in</h1>
      <p>No public sign-up path exists for this portal.</p>
      <Field label="Email"><TextInput defaultValue="operator@noma.ng" /></Field>
      <Field label="Password"><TextInput type="password" defaultValue="password" /></Field>
      <Button><Link to="/admin"><LockKeyhole size={18} /> Enter dashboard</Link></Button>
    </section>
  )
}
