import { CreditCard } from '@phosphor-icons/react'
import { Field, SelectInput, TextArea, TextInput } from '../../design-system/components/Field'
import { SectionTitle } from '../../design-system/components/SectionTitle'

export function CheckoutForm() {
  return (
    <section className="space-y-4 rounded-[8px] border border-[#E5E7EB] bg-white p-6">
      <SectionTitle
        title="Checkout"
        detail="Guest checkout with delivery fee estimated before payment."
      />
      <Field label="Full name">
        <TextInput placeholder="Full name" />
      </Field>
      <Field label="Phone number">
        <div className="flex items-center gap-2">
          <span className="rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] px-3 py-2.5 font-mono text-xs font-semibold text-[#0B1220]">
            +234 (NG)
          </span>
          <TextInput placeholder="803 000 0000" className="font-mono" />
        </div>
      </Field>
      <Field label="Delivery area">
        <SelectInput defaultValue="Lagos">
          <option value="Lagos">Lagos</option>
          <option value="Ogun">Ogun</option>
          <option value="Oyo">Oyo</option>
          <option value="FCT - Abuja">FCT - Abuja</option>
          <option value="Rivers">Rivers</option>
        </SelectInput>
      </Field>
      <Field label="Address">
        <TextArea placeholder="Street, landmark, city" />
      </Field>
      <div className="flex items-start gap-3 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-3.5 text-xs">
        <CreditCard size={18} weight="regular" className="mt-0.5 shrink-0 text-[#1049EB]" />
        <div>
          <strong className="block text-[#0B1220]">Card, Bank Transfer &amp; Pay on Delivery</strong>
          <span className="text-[#5E6675]">
            Choose your preferred Nigerian payment method during final review.
          </span>
        </div>
      </div>
    </section>
  )
}
