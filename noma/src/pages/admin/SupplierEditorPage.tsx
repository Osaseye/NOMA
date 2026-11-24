import { useState } from 'react'
import { ArrowLeft, SpinnerGap, UploadSimple } from '@phosphor-icons/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { storageService } from '../../services/firebase/storageService'
import { useSupplierStore } from '../../store/supplierStore'

export function SupplierEditorPage() {
  const { supplierId } = useParams<{ supplierId?: string }>()
  const navigate = useNavigate()
  const { suppliers, addSupplier, updateSupplier } = useSupplierStore()

  const existing = supplierId ? suppliers.find((s) => s.id === supplierId) : undefined
  const isEditing = Boolean(existing)

  const [name, setName] = useState(existing?.name || '')
  const [contactPerson, setContactPerson] = useState(existing?.contactPerson || '')
  const [phone, setPhone] = useState(existing?.phone || '')
  const [email, setEmail] = useState(existing?.email || '')
  const [address, setAddress] = useState(existing?.address || '')
  const [paymentTerms, setPaymentTerms] = useState(existing?.paymentTerms || 'Net 30 Days')
  const [notes, setNotes] = useState(existing?.notes || '')
  const [logo, setLogo] = useState(existing?.logo || existing?.image || '')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    const toastId = toast.loading('Uploading supplier logo...')
    try {
      const downloadUrl = await storageService.uploadImage(file, 'suppliers')
      setLogo(downloadUrl)
      toast.success('Supplier logo uploaded.', { id: toastId })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload supplier logo'
      toast.error(message, { id: toastId })
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contactPerson.trim() || !phone.trim()) {
      toast.error('Please fill in Supplier Name, Contact Person, and Phone Number.')
      return
    }

    setSaving(true)
    try {
      if (isEditing && existing) {
        await updateSupplier(existing.id, {
          name: name.trim(),
          contactPerson: contactPerson.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          paymentTerms: paymentTerms.trim(),
          notes: notes.trim(),
          logo,
          image: logo,
        })
        toast.success(`Supplier "${name}" updated.`)
      } else {
        await addSupplier({
          name: name.trim(),
          contactPerson: contactPerson.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          paymentTerms: paymentTerms.trim(),
          notes: notes.trim(),
          logo,
          image: logo,
        })
        toast.success(`Supplier "${name}" created.`)
      }
      navigate('/admin/suppliers')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save supplier.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 pb-16">
      <div>
        <Link
          to="/admin/suppliers"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950"
        >
          <ArrowLeft size={14} />
          <span>Back to Suppliers</span>
        </Link>
        <AdminTitle
          title={isEditing ? `Edit ${existing?.name}` : 'New Supplier'}
          detail="Enter supplier contact information, warehouse address, and settlement terms."
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Company / Supplier Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lagos Footwear Wholesale"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Contact Person *
            </label>
            <input
              type="text"
              required
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. Mr. Emeka Okafor"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Phone Number *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0803 000 0000"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sales@supplier.com"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Warehouse / Market Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Trade Fair Complex, Lagos"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Payment Terms
            </label>
            <input
              type="text"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="e.g. Net 30 Days, Pay on Delivery"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Notes &amp; Bank Settlement Details
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional settlement account or delivery notes..."
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>
        </div>

        {/* Optional Brand / Logo Image */}
        <div className="border-t border-slate-200 pt-5">
          <label className="mb-2 block text-xs font-medium text-slate-600">
            Supplier Logo (Optional)
          </label>
          <div className="flex items-center gap-4">
            {logo ? (
              <img
                src={logo}
                alt="Supplier logo"
                className="h-14 w-14 rounded-lg bg-[#F4F4F5] object-cover"
              />
            ) : null}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 hover:border-slate-950">
              {uploadingLogo ? (
                <>
                  <SpinnerGap size={14} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadSimple size={14} />
                  <span>Upload Logo</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingLogo}
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
          <Link
            to="/admin/suppliers"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-950"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={uploadingLogo || saving}
            className="rounded-lg bg-slate-950 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Supplier'}
          </button>
        </div>
      </form>
    </div>
  )
}
