import { useState } from 'react'
import { HiSparkles, HiPencilSquare, HiPlus, HiTag, HiArrowUpTray, HiTrash, HiUserGroup } from 'react-icons/hi2'
import type { Category, SubCategory } from '../../types/commerce'
import { useProductStore } from '../../store/productStore'
import { storageService } from '../../services/firebase/storageService'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function CategoryMarkupGrid({ categories }: { categories: Category[] }) {
  const { updateCategory, addCategory, deleteCategory, addSubCategory, deleteSubCategory, products } = useProductStore()

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
  const [uploadingImage, setUploadingImage] = useState(false)

  // Subcategory Form State
  const [addingSubCategoryParentId, setAddingSubCategoryParentId] = useState<string | null>(null)
  const [subLabel, setSubLabel] = useState('')
  const [subAgeGroup, setSubAgeGroup] = useState<'Adults' | 'Children' | 'Babies' | 'All Ages'>('Adults')
  const [subGender, setSubGender] = useState<'Men' | 'Women' | 'Unisex' | 'Boys' | 'Girls'>('Unisex')

  const handleStartEdit = (cat: Category) => {
    setEditingCategoryId(cat.id)
    setMarkupInput(cat.defaultMarkupPercent)
    setMerchandisingInput(cat.merchandisingLine)
    setImageInput(cat.image || '')
  }

  // Handle Edit Category File Upload via Storage Service
  const handleEditImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingImage(true)
      const toastId = toast.loading('Uploading category image to Storage...')
      try {
        const downloadUrl = await storageService.uploadImage(file, 'category-images')
        setImageInput(downloadUrl)
        toast.success('Image uploaded successfully!', { id: toastId })
      } catch (err: any) {
        console.error('Image upload failed:', err)
        toast.error(err?.message || 'Failed to upload image', { id: toastId })
      } finally {
        setUploadingImage(false)
      }
    }
  }

  // Handle New Category File Upload via Storage Service
  const handleNewCatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingImage(true)
      const toastId = toast.loading('Uploading category image to Storage...')
      try {
        const downloadUrl = await storageService.uploadImage(file, 'category-images')
        setNewCatImage(downloadUrl)
        toast.success('Image uploaded successfully!', { id: toastId })
      } catch (err: any) {
        console.error('Image upload failed:', err)
        toast.error(err?.message || 'Failed to upload image', { id: toastId })
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleSaveEdit = (catId: string) => {
    updateCategory(catId, {
      defaultMarkupPercent: Number(markupInput),
      merchandisingLine: merchandisingInput,
      image: imageInput,
    })
    setEditingCategoryId(null)
    toast.success('Category updated live on website!')
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
      subcategories: [],
    })
    setNewCatId('')
    setNewCatLabel('')
    setNewCatLine('')
    setNewCatImage('')
    setShowAddModal(false)
    toast.success(`Category "${newCatLabel}" created and published live on storefront!`)
  }

  const handleCreateSubCategory = (parentId: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!subLabel) return
    const subId = `sub-${Date.now()}`
    const newSub: SubCategory = {
      id: subId,
      label: subLabel,
      parentId,
      ageGroup: subAgeGroup,
      genderTarget: subGender,
    }
    addSubCategory(parentId, newSub)
    setSubLabel('')
    setAddingSubCategoryParentId(null)
    toast.success(`Subcategory "${subLabel}" added!`)
  }

  return (
    <div className="flex flex-col gap-6 font-['Outfit',sans-serif]">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Category Cards & Subcategory Hierarchy ({categories.length})</h2>
          <p className="text-xs text-slate-500">Manage main categories, subcategories (e.g. Adults, Children, Babies), and target demographics.</p>
        </div>
        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all"
        >
          <HiPlus size={16} /> Add Main Category Card
        </button>
      </div>

      {/* Add Main Category Card Form */}
      {showAddModal && (
        <form onSubmit={handleCreateCategory} className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 flex flex-col gap-4 animate-in fade-in">
          <h3 className="text-xs font-extrabold uppercase text-emerald-900">Create Main Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-600">Category Name</label>
              <input
                type="text"
                required
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                placeholder="e.g. Clothing & Apparel"
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
                placeholder="Quality fashion for adults, children & babies"
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-slate-600">Category Cover Image</label>
            <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400 bg-white p-3 text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-50 mt-1">
              {uploadingImage ? (
                <>
                  <Loader2 size={18} className="animate-spin text-emerald-600" />
                  <span>Uploading Image File...</span>
                </>
              ) : (
                <>
                  <HiArrowUpTray size={18} /> Upload Image File to Storage
                  <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleNewCatFileUpload} className="hidden" />
                </>
              )}
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
              disabled={uploadingImage}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              Save & Publish Category
            </button>
          </div>
        </form>
      )}

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-1">
            <HiTag size={28} />
          </div>
          <span className="font-bold text-sm text-slate-900">No Categories Uploaded</span>
          <span className="text-xs text-slate-400 max-w-sm">
            Categories will appear on storefront once uploaded by admin.
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-2 flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700"
          >
            <HiPlus size={16} /> Add First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const productCount = products.filter((p) => p.category === category.id).length
            const isEditing = editingCategoryId === category.id
            const isAddingSub = addingSubCategoryParentId === category.id
            const subcats = category.subcategories || []

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
                      <label className="text-[10px] font-bold uppercase text-slate-500">Upload Cover Image</label>
                      <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/50 p-2.5 text-xs font-bold text-emerald-800 cursor-pointer hover:bg-emerald-100/60 mt-1">
                        {uploadingImage ? (
                          <>
                            <Loader2 size={16} className="animate-spin text-emerald-600" />
                            <span>Uploading Image...</span>
                          </>
                        ) : (
                          <>
                            <HiArrowUpTray size={16} /> Choose Image File to Upload
                            <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleEditImageFileUpload} className="hidden" />
                          </>
                        )}
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
                        disabled={uploadingImage}
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
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
                  <div className="flex flex-col h-full">
                    {/* Header Image */}
                    <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={category.image || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80'}
                        alt={category.label}
                        className="h-full w-full object-cover opacity-85"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-black uppercase text-white shadow-md flex items-center gap-1">
                          <HiSparkles size={11} /> {category.defaultMarkupPercent}% Markup
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            deleteCategory(category.id)
                            toast.success(`Category "${category.label}" deleted from website!`)
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/90 text-white hover:bg-red-700 transition-colors"
                          title="Delete Category"
                        >
                          <HiTrash size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-['Outfit'] font-black text-base text-slate-900">{category.label}</h3>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">ID: {category.id}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{category.merchandisingLine}</p>
                      </div>

                      {/* Subcategories Section */}
                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <HiUserGroup size={12} className="text-emerald-600" />
                            Subcategories ({subcats.length})
                          </span>
                          <button
                            onClick={() => setAddingSubCategoryParentId(isAddingSub ? null : category.id)}
                            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
                          >
                            <HiPlus size={11} /> {isAddingSub ? 'Close' : 'Add Sub'}
                          </button>
                        </div>

                        {/* Add Subcategory Inline Form */}
                        {isAddingSub && (
                          <form
                            onSubmit={(e) => handleCreateSubCategory(category.id, e)}
                            className="space-y-2 pt-2 border-t border-slate-200 animate-in fade-in"
                          >
                            <input
                              type="text"
                              required
                              value={subLabel}
                              onChange={(e) => setSubLabel(e.target.value)}
                              placeholder="Subcategory name (e.g. Adults, Children, Babies)"
                              className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] font-bold uppercase text-slate-500">Age Group</label>
                                <select
                                  value={subAgeGroup}
                                  onChange={(e) => setSubAgeGroup(e.target.value as any)}
                                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs font-semibold bg-white"
                                >
                                  <option value="Adults">Adults</option>
                                  <option value="Children">Children</option>
                                  <option value="Babies">Babies</option>
                                  <option value="All Ages">All Ages</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[9px] font-bold uppercase text-slate-500">Gender Target</label>
                                <select
                                  value={subGender}
                                  onChange={(e) => setSubGender(e.target.value as any)}
                                  className="w-full rounded-lg border border-slate-300 p-1.5 text-xs font-semibold bg-white"
                                >
                                  <option value="Unisex">Unisex</option>
                                  <option value="Men">Men</option>
                                  <option value="Women">Women</option>
                                  <option value="Boys">Boys</option>
                                  <option value="Girls">Girls</option>
                                </select>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                            >
                              Save Subcategory
                            </button>
                          </form>
                        )}

                        {/* List of Subcategory Badges */}
                        {subcats.length === 0 ? (
                          <p className="text-[11px] text-slate-400 italic">No subcategories created yet.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {subcats.map((sub) => (
                              <span
                                key={sub.id}
                                className="group relative inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-800 shadow-2xs"
                              >
                                <span>{sub.label}</span>
                                {sub.ageGroup && (
                                  <span className="rounded bg-emerald-100 text-emerald-800 px-1 py-0.2 text-[9px] font-black">
                                    {sub.ageGroup}
                                  </span>
                                )}
                                {sub.genderTarget && sub.genderTarget !== 'Unisex' && (
                                  <span className="rounded bg-blue-100 text-blue-800 px-1 py-0.2 text-[9px] font-black">
                                    {sub.genderTarget}
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => deleteSubCategory(category.id, sub.id)}
                                  className="ml-1 text-slate-400 hover:text-red-600"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span className="font-bold text-slate-600">{productCount} Products</span>
                        <button
                          onClick={() => handleStartEdit(category)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
                        >
                          <HiPencilSquare size={14} className="text-emerald-600" /> Edit Card
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
