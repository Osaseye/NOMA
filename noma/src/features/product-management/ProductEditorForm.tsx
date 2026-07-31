import { Field, SelectInput, TextArea, TextInput } from '../../design-system/components/Field'
import { categories } from '../../mock/commerce'
import type { Product } from '../../types/commerce'
import { formatNaira, markupPercent } from '../../utils/pricing'

export function ProductEditorForm({ product }: { product: Product }) {
  return (
    <section className="editor-grid">
      <img src={product.image} alt={product.name} />
      <div className="checkout-form">
        <Field label="Product name"><TextInput defaultValue={product.name} /></Field>
        <Field label="Category"><SelectInput defaultValue={product.category}>{categories.map((category) => <option key={category.id}>{category.id}</option>)}</SelectInput></Field>
        <Field label="Base price"><TextInput defaultValue={product.basePrice} /></Field>
        <Field label="Final price"><TextInput defaultValue={product.finalPrice} /></Field>
        <Field label="Description"><TextArea defaultValue={product.description} /></Field>
        <p className="payment-panel">Computed markup: {markupPercent(product)}%. Customer sees only {formatNaira(product.finalPrice)}.</p>
      </div>
    </section>
  )
}
