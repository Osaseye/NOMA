import { useState } from 'react'
import {
  Buildings,
  CheckCircle,
  Envelope,
  Image as ImageIcon,
  MagnifyingGlass,
  MapPin,
  PencilSimple,
  Phone,
  Plus,
  SpinnerGap,
  Trash,
  UploadSimple,
  Warning,
  X,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { EmptyState } from '../../design-system/components/EmptyState'
import { KpiCard } from '../../design-system/components/KpiCard'
import { storageService } from '../../services/firebase/storageService'
import { useProductStore } from '../../store/productStore'
import { useSupplierStore } from '../../store/supplierStore'
import type { Supplier } from '../../types/commerce'
import { formatNaira } from '../../utils/pricing'

const inputClass =
  'w-full rounded-[6px] border border-[#D1D5DB] bg-white p-2.5 text-xs font-medium text-[#0B1220] placeholder:text-[#5E6675]/70 transition-colors focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15'

const labelClass =
  'mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]'

export function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplierStore()
  const { products } = useProductStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)

  const [name, setName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Days')
  const [notes, setNotes] = useState('')
  const [logo, setLogo] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const openAddModal = () => {
    setEditingSupplier(null)
    setName('')
    setContactPerson('')
    setPhone('')
    setEmail('')
    setAddress('')
    setPaymentTerms('Net 30 Days')
    setNotes('')
    setLogo('')
    setModalOpen(true)
  }

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setName(supplier.name)
    setContactPerson(supplier.contactPerson)
    setPhone(supplier.phone)
    setEmail(supplier.email || '')
    setAddress(supplier.address || '')
    setPaymentTerms(supplier.paymentTerms || 'Net 30 Days')
    setNotes(supplier.notes || '')
    setLogo(supplier.logo || supplier.image || '')
    setModalOpen(true)
  }

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
      console.error('Failed to upload supplier logo:', err)
      toast.error(message, { id: toastId })
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contactPerson.trim() || !phone.trim()) {
      toast.error('Please fill in Supplier Name, Contact Person, and Phone Number.')
      return
    }

    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, {
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
      setModalOpen(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save supplier.'
      toast.error(message)
    }
  }

  const confirmDeleteSupplier = async () => {
    if (!deletingSupplier) return
    const targetName = deletingSupplier.name
    try {
      await deleteSupplier(deletingSupplier.id)
      setDeletingSupplier(null)
      toast.success(`Supplier "${targetName}" removed from ledger.`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete supplier.'
      toast.error(message)
    }
  }

  const supplierStats = suppliers.map((sup) => {
    const sourcedProducts = products.filter(
      (p) => p.supplierId === sup.id || p.supplierName?.toLowerCase() === sup.name.toLowerCase()
    )
    const totalUnits = sourcedProducts.reduce((acc, p) => acc + (p.stockQty || 0), 0)
    const totalOwedBaseCost = sourcedProducts.reduce(
      (acc, p) => acc + (p.basePrice || 0) * (p.stockQty || 0),
      0
    )
    return {
      supplier: sup,
      sourcedProducts,
      totalUnits,
      totalOwedBaseCost,
    }
  })

  const totalPayableCostAcrossAll = supplierStats.reduce((acc, s) => acc + s.totalOwedBaseCost, 0)
  const linkedProductsCount = products.filter((p) => p.supplierId || p.supplierName).length

  const filteredStats = supplierStats.filter((s) => {
    const q = searchQuery.toLowerCase()
    return (
      s.supplier.name.toLowerCase().includes(q) ||
      s.supplier.contactPerson.toLowerCase().includes(q) ||
      s.supplier.phone.includes(searchQuery)
    )
  })

  return (
    <div className="flex flex-col gap-6 pb-12">
      <AdminTitle
        title="Suppliers & Payables Ledger"
        detail="Manage product sourcing partners, vendor terms, inventory base costs, and supplier payables."
        action={
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
          >
            <Plus size={15} weight="regular" />
            <span>Add New Supplier</span>
          </button>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <KpiCard
          label="Active Suppliers"
          value={`${suppliers.length}`}
          tone="cobalt"
          subtitle="Verified vendor partners"
        />
        <KpiCard
          label="Inventory Base Cost"
          value={formatNaira(totalPayableCostAcrossAll)}
          tone="success"
          subtitle="Current stock sourcing value"
        />
        <div className="col-span-2 lg:col-span-1">
          <KpiCard
            label="Linked Catalog SKUs"
            value={`${linkedProductsCount}`}
            tone="amber"
            subtitle="Assigned to suppliers"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative rounded-[8px] border border-[#E5E7EB] bg-white">
        <MagnifyingGlass
          size={16}
          weight="regular"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E6675]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search suppliers by company name, contact person, or phone..."
          className="w-full rounded-[8px] bg-transparent py-2.5 pl-10 pr-4 text-xs font-medium text-[#0B1220] placeholder:text-[#5E6675]/70 focus:outline-none focus:ring-2 focus:ring-[#1049EB]/20"
        />
      </div>

      {/* Suppliers Grid */}
      {filteredStats.length === 0 ? (
        <EmptyState
          icon={<Buildings size={24} weight="regular" />}
          title={
            searchQuery ? 'No suppliers match your search' : 'No suppliers registered yet'
          }
          detail={
            searchQuery
              ? 'Try searching with another supplier name, contact, or phone number.'
              : 'Add vendor and supplier partners to track inventory sourcing costs and payables.'
          }
          action={
            !searchQuery ? (
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E293B]"
              >
                <Plus size={15} weight="regular" />
                <span>Add First Supplier</span>
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">
          {filteredStats.map(({ supplier, sourcedProducts, totalUnits, totalOwedBaseCost }) => (
            <article
              key={supplier.id}
              className="flex flex-col justify-between rounded-[8px] border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#D1D5DB]"
            >
              <div>
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-2 border-b border-[#E5E7EB] pb-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9]">
                      {supplier.logo || supplier.image ? (
                        <img
                          src={supplier.logo || supplier.image}
                          alt={supplier.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-mono text-xs font-bold text-[#0B1220]">
                          {supplier.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 text-sm font-bold text-[#0B1220]">
                        {supplier.name}
                      </h3>
                      <span className="text-xs font-medium text-[#5E6675]">
                        Contact: {supplier.contactPerson}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(supplier)}
                      className="rounded-[6px] p-1.5 text-[#5E6675] transition-colors hover:bg-[#EEF3FE] hover:text-[#1049EB]"
                      title="Edit Supplier"
                    >
                      <PencilSimple size={16} weight="regular" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingSupplier(supplier)}
                      className="rounded-[6px] p-1.5 text-[#5E6675] transition-colors hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                      title="Delete Supplier"
                    >
                      <Trash size={16} weight="regular" />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-4 flex flex-col gap-2 text-xs text-[#374151]">
                  <div className="flex items-center gap-2 font-mono font-semibold text-[#0B1220]">
                    <Phone size={14} weight="regular" className="shrink-0 text-[#5E6675]" />
                    <span>{supplier.phone}</span>
                  </div>
                  {supplier.email ? (
                    <div className="flex items-center gap-2">
                      <Envelope size={14} weight="regular" className="shrink-0 text-[#5E6675]" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                  ) : null}
                  {supplier.address ? (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} weight="regular" className="shrink-0 text-[#5E6675]" />
                      <span className="line-clamp-1">{supplier.address}</span>
                    </div>
                  ) : null}
                </div>

                {/* Terms & Notes */}
                {supplier.paymentTerms ? (
                  <div className="mb-4 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-3 text-xs text-[#374151]">
                    <span className="block font-semibold text-[#0B1220]">
                      Terms: {supplier.paymentTerms}
                    </span>
                    {supplier.notes ? (
                      <p className="mt-0.5 line-clamp-2 text-[11px] text-[#5E6675]">
                        {supplier.notes}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Payables Summary */}
              <div className="flex items-center justify-between gap-2 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-3.5">
                <div>
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#5E6675]">
                    Total Sourcing Cost ({totalUnits} units)
                  </span>
                  <span className="mt-0.5 block font-mono tabular-nums text-base font-bold text-[#0B1220]">
                    {formatNaira(totalOwedBaseCost)}
                  </span>
                </div>
                <span className="rounded-[4px] border border-[#E5E7EB] bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-[#374151]">
                  {sourcedProducts.length} SKUs
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add / Edit Supplier Modal */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0B1220]/45 p-4 backdrop-blur-xs">
          <div className="my-8 w-full max-w-md rounded-[10px] border border-[#E5E7EB] bg-white p-6 shadow-[0_8px_24px_rgba(11,18,32,0.08)]">
            <div className="mb-4 flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-base font-bold text-[#0B1220]">
                {editingSupplier ? 'Edit Supplier Details' : 'Add New Supplier Record'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-[6px] p-1 text-[#5E6675] hover:bg-[#F6F7F9] hover:text-[#0B1220]"
              >
                <X size={18} weight="regular" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Supplier Logo / Brand Image</label>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9]">
                    {logo ? (
                      <img src={logo} alt="Logo Preview" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon size={22} weight="regular" className="text-[#5E6675]" />
                    )}
                  </div>

                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#D1D5DB] bg-[#F6F7F9] p-3 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE]/50">
                    {uploadingLogo ? (
                      <>
                        <SpinnerGap size={15} weight="regular" className="animate-spin text-[#1049EB]" />
                        <span>Uploading Logo...</span>
                      </>
                    ) : (
                      <>
                        <UploadSimple size={15} weight="regular" className="text-[#1049EB]" />
                        <span>Upload Logo Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingLogo}
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </>
                    )}
                  </label>
                </div>
                <input
                  type="text"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="Or paste Logo URL (https://...)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Supplier / Company Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sumec Firman Nigeria Ltd"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Contact Person *</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Mr. Emeka Okafor"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0803 000 0000"
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sales@company.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Office / Warehouse Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Alaba International Market, Lagos"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Payment Terms</label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g. Net 30 Days, Pay on Delivery"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Agreements, settlement bank info, or delivery notes..."
                  className={inputClass}
                />
              </div>

              <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-[#E5E7EB] pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-[6px] border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F6F7F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingLogo}
                  className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B] disabled:opacity-50"
                >
                  <CheckCircle size={15} weight="regular" />
                  <span>Save Supplier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {deletingSupplier ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/45 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-[10px] border border-[#E5E7EB] bg-white p-6 text-center shadow-[0_8px_24px_rgba(11,18,32,0.08)]">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]">
              <Warning size={24} weight="regular" />
            </div>

            <h3 className="text-base font-bold text-[#0B1220]">Delete Supplier Record?</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5E6675]">
              Are you sure you want to remove{' '}
              <strong className="text-[#0B1220]">{deletingSupplier.name}</strong> from your
              supplier ledger? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center gap-2.5 border-t border-[#E5E7EB] pt-4">
              <button
                type="button"
                onClick={() => setDeletingSupplier(null)}
                className="flex-1 rounded-[6px] border border-[#E5E7EB] bg-white py-2 text-xs font-semibold text-[#374151] hover:bg-[#F6F7F9]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSupplier}
                className="flex-1 rounded-[6px] bg-[#B91C1C] py-2 text-xs font-semibold text-white hover:bg-[#991B1B]"
              >
                Delete Supplier
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
