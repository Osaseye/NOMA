import { useState } from 'react'
import { HiSparkles, HiPencilSquare, HiPlus, HiTag, HiArrowUpTray } from 'react-icons/hi2'
import type { Category } from '../../types/commerce'
import { useProductStore } from '../../store/productStore'

export function CategoryMarkupGrid({ categories }: { categories: Category[] }) {
  const { updateCategory, addCategory, products } = useProductStore()

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [markupInput, setMarkupInput] = useState<number>(20)
  const [merchandisingInput, setMerchandisingInput] = useState<string>('')
  const [imageInput, setImageInput] = useState<string>('')

  // New Category Form State
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCatId, setNewCatId] = useState('')
  const [newCatLabel, setNewCatLabel] = useState('')
  const [newCatMarkup, setNewCatMarkup] = useState(25)
  const [newCatLine, setNewCatLine] = useState('')
  const [newCatImage, setNewCatImage] = useState('')

  const handleStartEdit = (cat: Category) => {
    setEditingCategoryId(cat.id)
    setMarkupInput(cat.defaultMarkupPercent)
    setMerchandisingInput(cat.merchandisingLine)
    setImageInput(cat.image || '')
  }

  // Handle Edit Category File Upload
  const handleEditImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageInput(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle New Category File Upload
  const handleNewCatFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setNewCatImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = (catId: string) => {
    updateCategory(catId, {
      defaultMarkupPercent: Number(markupInput),
      merchandisingLine: merchandisingInput,
      image: imageInput,
    })
    setEditingCategoryId(null)
  }

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatLabel) return
    const id = newCatId.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || newCatLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    addCategory({
      id,
      label: newCatLabel,
      defaultMarkupPercent: Number(newCatMarkup),
      merchandisingLine: newCatLine || 'Curated high-demand items delivered nationwide.',
      image: newCatImage || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    })
    setNewCatId('')
    setNewCatLabel('')
    setNewCatLine('')
    setNewCatImage('')
    setShowAddModal(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Category Cards & Image Management ({categories.length})</h2>
          <p className="text-xs text-slate-500">Manage storefront category cards, upload custom category cover images, and set markup guidelines.</p>
        </div>
        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all"
        >
          <HiPlus size={16} /> Add Category Card
        </button>
      </div>

      {/* Add Category Card Form */}
      {showAddModal && (
        <form onSubmit={handleCreateCategory} className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 flex flex-col gap-4">
          <h3 className="text-xs font-extrabold uppercase text-emerald-900">Create New Category Card</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-600">Category Label Name</label>
              <input
                type="text"
                required
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                placeholder="e.g. Solar & Power Systems"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-600">Default Markup %</label>
              <input
                type="number"
                required
                value={newCatMarkup}
                onChange={(e) => setNewCatMarkup(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-600">Subline Description</label>
              <input
                type="text"
                value={newCatLine}
                onChange={(e) => setNewCatLine(e.target.value)}
                placeholder="High efficiency solar power solutions"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-600">Upload Category Cover Image File</label>
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400 bg-white p-3 text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-50 mt-1">
              <HiArrowUpTray size={18} /> Choose Category Image File
              <input type="file" accept="image/*" onChange={handleNewCatFileUpload} className="hidden" />
            </label>
            {newCatImage && (
              <div className="mt-2 h-24 w-36 rounded-xl bg-slate-100 overflow-hidden border">
                <img src={newCatImage} alt="Preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
            >
              Save Category Card
            </button>
          </div>
        </form>
      )}

      {/* Grid of Category Cards or Empty State */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-1">
            <HiTag size={28} />
          </div>
          <span className="font-bold text-sm text-slate-900">No Categories Created</span>
          <span className="text-xs text-slate-400 max-w-sm">
            Categories are scrubbed clean for backend API integration. Add new categories manually or connect your API endpoint.
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-2 flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700"
          >
            <HiPlus size={16} /> Add Category Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const productCount = products.filter((p) => p.category === category.id).length
            const isEditing = editingCategoryId === category.id

            return (
              <div
                key={category.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                {isEditing ? (
                  <div className="p-5 flex flex-col gap-4">
                    <h4 className="text-xs font-black uppercase text-slate-900">Edit Category: {category.label}</h4>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500">Default Markup Margin (%)</label>
                      <input
                        type="number"
                        value={markupInput}
                        onChange={(e) => setMarkupInput(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs font-black text-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500">Merchandising Description</label>
                      <textarea
                        rows={2}
                        value={merchandisingInput}
                        onChange={(e) => setMerchandisingInput(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-500">Upload Category Image File</label>
                      <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/50 p-2.5 text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-100/60 mt-1">
                        <HiArrowUpTray size={16} /> Choose Image File
                        <input type="file" accept="image/*" onChange={handleEditImageFileUpload} className="hidden" />
                      </label>
                      {imageInput && (
                        <div className="mt-2 h-20 w-full rounded-lg bg-slate-50 overflow-hidden border">
                          <img src={imageInput} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(category.id)}
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategoryId(null)}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="relative h-40 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={category.image || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80'}
                        alt={category.label}
                        className="h-full w-full object-cover opacity-85"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-black uppercase text-white shadow-md flex items-center gap-1">
                          <HiSparkles size={11} /> {category.defaultMarkupPercent}% Default Markup
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="rounded-full bg-slate-900/90 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur-sm">
                          {productCount} Products
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-['Outfit'] font-black text-base text-slate-900">{category.label}</h3>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">ID: {category.id}</span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2">{category.merchandisingLine}</p>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span className="font-bold text-slate-600">{productCount} Catalog Products</span>
                        <button
                          onClick={() => handleStartEdit(category)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
                        >
                          <HiPencilSquare size={14} className="text-emerald-600" /> Edit Card & Image
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
