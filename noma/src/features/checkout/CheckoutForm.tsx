import { CreditCard } from 'lucide-react'
import { Field, SelectInput, TextArea, TextInput } from '../../design-system/components/Field'
import { SectionTitle } from '../../design-system/components/SectionTitle'

export function CheckoutForm() {
  return (
    <section className="checkout-form">
      <SectionTitle title="Checkout" detail="Guest checkout with delivery fee estimated before payment." />
      <Field label="Full name"><TextInput placeholder="Ada Noma" /></Field>
      <Field label="Phone number"><TextInput placeholder="0800 000 0000" /></Field>
      <Field label="Delivery area">
        <SelectInput defaultValue="Lekki">
          <option>Lekki</option>
          <option>Gbagada</option>
          <option>Wuse 2</option>
          <option>Port Harcourt</option>
        </SelectInput>
      </Field>
      <Field label="Address"><TextArea placeholder="Street, landmark, city" /></Field>
      <div className="payment-panel">
        <CreditCard size={20} />
        <div><strong>Paystack / Flutterwave ready</strong><span>Inactive until CAC and business bank approval are confirmed.</span></div>
      </div>
    </section>
  )
}
