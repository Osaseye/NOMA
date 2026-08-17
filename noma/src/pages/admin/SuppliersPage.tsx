import { useState } from 'react'
import {
  HiBuildingOffice2,
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiPhone,
  HiEnvelope,
  HiMapPin,
  HiBanknotes,
  HiCube,
  HiCheckCircle,
  HiXMark,
  HiMagnifyingGlass,
} from 'react-icons/hi2'
import { toast } from 'sonner'
import { useSupplierStore } from '../../store/supplierStore'
import { useProductStore } from '../../store/productStore'
import { formatNaira } from '../../utils/pricing'
import type { Supplier } from '../../types/commerce'

export function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSupplierStore()
  const { products } = useProductStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Days')
  const [notes, setNotes] = useState('')

  const openAddModal = () => {
    setEditingSupplier(null)
    setName('')
    setContactPerson('')
    setPhone('')
    setEmail('')
    setAddress('')
    setPaymentTerms('Net 30 Days')
    setNotes('')
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
    setModalOpen(true)
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
        })
        toast.success(`Supplier "${name}" updated!`)
      } else {
        await addSupplier({
          name: name.trim(),
          contactPerson: contactPerson.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          paymentTerms: paymentTerms.trim(),
          notes: notes.trim(),
        })
        toast.success(`Supplier "${name}" created!`)
      }
      setModalOpen(false)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save supplier.')
    }
  }

  const handleDelete = async (id: string, supplierName: string) => {
    if (confirm(`Are you sure you want to remove supplier "${supplierName}"?`)) {
      await deleteSupplier(id)
      toast.success(`Supplier "${supplierName}" removed.`)
    }
  }

  // Calculate Payables & Inventory Cost per supplier
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

  const filteredStats = supplierStats.filter(
    (s) =>
      s.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplier.phone.includes(searchQuery)
  )

  return (
    <div className="flex flex-col gap-6 font-['Outfit',sans-serif] pb-12">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <HiBuildingOffice2 className="text-emerald-600" /> Suppliers & Payables Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your product sourcing partners, track inventory base costs, and monitor amounts owed to suppliers.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all shrink-0"
        >
          <HiPlus size={16} /> Add New Supplier
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              Total Active Suppliers
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{suppliers.length}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2F5FE3]">
            <HiBuildingOffice2 size={24} />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider">
              Total Inventory Sourcing Cost
            </span>
            <h3 className="text-2xl font-black text-emerald-900 mt-1">
              {formatNaira(totalPayableCostAcrossAll)}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <HiBanknotes size={24} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
              Total Products Linked
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {products.filter((p) => p.supplierId || p.supplierName).length} items
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <HiCube size={24} />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
        <HiMagnifyingGlass size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search suppliers by company name, contact person, or phone number..."
          className="w-full text-xs font-bold text-slate-900 outline-none placeholder:text-slate-400 bg-transparent"
        />
      </div>

      {/* Suppliers Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStats.map(({ supplier, sourcedProducts, totalUnits, totalOwedBaseCost }) => (
          <div
            key={supplier.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:shadow-md"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 line-clamp-1">
                    {supplier.name}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700">
                    Contact: {supplier.contactPerson}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openEditModal(supplier)}
                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit Supplier"
                  >
                    <HiPencilSquare size={17} />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id, supplier.name)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Supplier"
                  >
                    <HiTrash size={17} />
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col gap-2 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <HiPhone size={14} className="text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-800">{supplier.phone}</span>
                </div>
                {supplier.email && (
                  <div className="flex items-center gap-2">
                    <HiEnvelope size={14} className="text-slate-400 shrink-0" />
                    <span>{supplier.email}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-2">
                    <HiMapPin size={14} className="text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{supplier.address}</span>
                  </div>
                )}
              </div>

              {/* Payment Terms & Notes */}
              {supplier.paymentTerms && (
                <div className="mb-4 rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600 border border-slate-100">
                  <span className="font-bold text-slate-800 block">Terms: {supplier.paymentTerms}</span>
                  {supplier.notes && <p className="mt-0.5 text-slate-500 italic line-clamp-2">{supplier.notes}</p>}
                </div>
              )}
            </div>

            {/* Payables Summary Box */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-center justify-between mt-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
                  Total Sourcing Cost ({totalUnits} units)
                </span>
                <h4 className="text-base font-black text-emerald-950 mt-0.5">
                  {formatNaira(totalOwedBaseCost)}
                </h4>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                {sourcedProducts.length} Products
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Supplier Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <HiXMark size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                  Supplier / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sumec Firman Nigeria Ltd"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Mr. Emeka Okafor"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0803 000 0000"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sales@company.com"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                  Office / Warehouse Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Alaba International Market, Ojo, Lagos"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                  Payment Terms
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g. Net 30 Days, Pay on Delivery"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special agreements, bank details, or delivery preferences..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-extrabold uppercase text-white shadow-md hover:bg-emerald-700"
                >
                  <HiCheckCircle size={16} /> Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
