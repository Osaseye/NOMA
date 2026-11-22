import { useState } from 'react'
import {
  PencilSimple,
  Plus,
  SpinnerGap,
  Tag,
  Trash,
  UploadSimple,
  Users,
  X,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { EmptyState } from '../../design-system/components/EmptyState'
import { storageService } from '../../services/firebase/storageService'
import { useProductStore } from '../../store/productStore'
import type { Category, SubCategory } from '../../types/commerce'

export function CategoryMarkupGrid({ categories }: { categories: Category[] }) {
  const {
    updateCategory,
    addCategory,
    deleteCategory,
    addSubCategory,
    deleteSubCategory,
    products,
  } = useProductStore()

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

  const handleEditImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const toastId = toast.loading('Uploading category image to storage...')
    try {
      const downloadUrl = await storageService.uploadImage(file, 'category-images')
      setImageInput(downloadUrl)
      toast.success('Image uploaded successfully.', { id: toastId })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload image'
      console.error('Image upload failed:', err)
      toast.error(message, { id: toastId })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleNewCatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const toastId = toast.loading('Uploading category image to storage...')
    try {
      const downloadUrl = await storageService.uploadImage(file, 'category-images')
      setNewCatImage(downloadUrl)
      toast.success('Image uploaded successfully.', { id: toastId })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload image'
      console.error('Image upload failed:', err)
      toast.error(message, { id: toastId })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveEdit = (catId: string) => {
    updateCategory(catId, {
      defaultMarkupPercent: Number(markupInput),
      merchandisingLine: merchandisingInput,
      image: imageInput,
    })
    setEditingCategoryId(null)
    toast.success('Category updated live on storefront.')
  }

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatLabel) return
    const id =
      newCatId.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
      newCatLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    addCategory({
      id,
      label: newCatLabel,
      defaultMarkupPercent: Number(newCatMarkup),
      merchandisingLine: newCatLine || 'Curated high-demand items delivered nationwide.',
      image: newCatImage || '/images/catalog-banner-all.png',
      subcategories: [],
    })
    setNewCatId('')
    setNewCatLabel('')
    setNewCatLine('')
    setNewCatImage('')
    setShowAddModal(false)
    toast.success(`Category "${newCatLabel}" published live.`)
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
    toast.success(`Subcategory "${subLabel}" added.`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-[#0B1220]">
            Category Cards &amp; Subcategory Hierarchy ({categories.length})
          </h2>
          <p className="mt-0.5 text-xs text-[#5E6675]">
            Manage main categories, demographic subcategories, and default profit markup rules.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(!showAddModal)}
          className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
        >
          <Plus size={15} weight="regular" />
          <span>Add Main Category</span>
        </button>
      </div>

      {/* Add Main Category Card Form */}
      {showAddModal ? (
        <form
          onSubmit={handleCreateCategory}
          className="flex flex-col gap-4 rounded-[8px] border border-[#E5E7EB] bg-white p-5 sm:p-6"
        >
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
              Create Main Category
            </h3>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-[6px] p-1 text-[#5E6675] hover:bg-[#F6F7F9] hover:text-[#0B1220]"
            >
              <X size={16} weight="regular" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                placeholder="e.g. Clothing & Apparel"
                className="w-full rounded-[6px] border border-[#D1D5DB] bg-white p-2.5 text-xs font-medium text-[#0B1220] focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                Default Markup % *
              </label>
              <input
                type="number"
                required
                value={newCatMarkup}
                onChange={(e) => setNewCatMarkup(Number(e.target.value))}
                className="w-full rounded-[6px] border border-[#D1D5DB] bg-white p-2.5 font-mono text-xs font-semibold text-[#0B1220] focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                Subline Description
              </label>
              <input
                type="text"
                value={newCatLine}
                onChange={(e) => setNewCatLine(e.target.value)}
                placeholder="Quality essentials for home and living"
                className="w-full rounded-[6px] border border-[#D1D5DB] bg-white p-2.5 text-xs font-medium text-[#0B1220] focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
              Category Cover Image
            </label>
            <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#D1D5DB] bg-[#F6F7F9] p-3 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE]/50">
              {uploadingImage ? (
                <>
                  <SpinnerGap size={16} weight="regular" className="animate-spin text-[#1049EB]" />
                  <span>Uploading Image File...</span>
                </>
              ) : (
                <>
                  <UploadSimple size={16} weight="regular" className="text-[#1049EB]" />
                  <span>Upload Image File to Storage</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleNewCatFileUpload}
                    className="hidden"
                  />
                </>
              )}
            </label>
            {newCatImage ? (
              <div className="mt-2 h-24 w-36 overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9]">
                <img src={newCatImage} alt="Preview" className="h-full w-full object-cover" />
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 border-t border-[#E5E7EB] pt-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-[6px] border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F6F7F9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadingImage}
              className="rounded-[6px] bg-[#0B1220] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B] disabled:opacity-50"
            >
              Save &amp; Publish Category
            </button>
          </div>
        </form>
      ) : null}

      {/* Empty State or Grid */}
      {categories.length === 0 ? (
        <EmptyState
          icon={<Tag size={24} weight="regular" />}
          title="No Categories Uploaded"
          detail="Categories appear on the storefront once created by an operator."
          action={
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0B1220] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E293B]"
            >
              <Plus size={15} weight="regular" />
              <span>Add First Category</span>
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 sm:gap-5">
          {categories.map((category) => {
            const productCount = products.filter((p) => p.category === category.id).length
            const isEditing = editingCategoryId === category.id
            const isAddingSub = addingSubCategoryParentId === category.id
            const subcats = category.subcategories || []

            return (
              <article
                key={category.id}
                className="flex flex-col justify-between overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white transition-colors hover:border-[#D1D5DB]"
              >
                {isEditing ? (
                  <div className="flex flex-col gap-4 p-5">
                    <h4 className="text-xs font-bold uppercase tracking-[0.06em] text-[#0B1220]">
                      Edit Category: {category.label}
                    </h4>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                        Default Markup Margin (%)
                      </label>
                      <input
                        type="number"
                        value={markupInput}
                        onChange={(e) => setMarkupInput(Number(e.target.value))}
                        className="w-full rounded-[6px] border border-[#D1D5DB] bg-white p-2.5 font-mono text-xs font-bold text-[#0B1220] focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                        Merchandising Description
                      </label>
                      <textarea
                        rows={2}
                        value={merchandisingInput}
                        onChange={(e) => setMerchandisingInput(e.target.value)}
                        className="w-full rounded-[6px] border border-[#D1D5DB] bg-white p-2.5 text-xs text-[#0B1220] focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                        Cover Image
                      </label>
                      <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#D1D5DB] bg-[#F6F7F9] p-2.5 text-xs font-semibold text-[#0B1220] transition-colors hover:border-[#1049EB] hover:bg-[#EEF3FE]/50">
                        {uploadingImage ? (
                          <>
                            <SpinnerGap
                              size={15}
                              weight="regular"
                              className="animate-spin text-[#1049EB]"
                            />
                            <span>Uploading Image...</span>
                          </>
                        ) : (
                          <>
                            <UploadSimple size={15} weight="regular" className="text-[#1049EB]" />
                            <span>Choose Image File</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={handleEditImageFileUpload}
                              className="hidden"
                            />
                          </>
                        )}
                      </label>
                      {imageInput ? (
                        <div className="mt-2 h-20 w-full overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9]">
                          <img src={imageInput} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(category.id)}
                        disabled={uploadingImage}
                        className="flex-1 rounded-[6px] bg-[#0B1220] py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B] disabled:opacity-50"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategoryId(null)}
                        className="rounded-[6px] border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F6F7F9]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col">
                    {/* Header Image */}
                    <div className="relative h-36 w-full overflow-hidden border-b border-[#E5E7EB] bg-[#F6F7F9]">
                      <img
                        src={category.image || '/images/catalog-banner-all.png'}
                        alt={category.label}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute left-3 top-3">
                        <span className="inline-flex items-center rounded-[4px] bg-[#0B1220] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-white">
                          +{category.defaultMarkupPercent}% Markup
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          deleteCategory(category.id)
                          toast.success(`Category "${category.label}" removed.`)
                        }}
                        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#FECACA] bg-white text-[#B91C1C] transition-colors hover:bg-[#FEF2F2]"
                        title="Delete Category"
                      >
                        <Trash size={14} weight="regular" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-bold tracking-tight text-[#0B1220]">
                            {category.label}
                          </h3>
                          <span className="font-mono text-[11px] text-[#5E6675]">
                            {category.id}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5E6675]">
                          {category.merchandisingLine}
                        </p>
                      </div>

                      {/* Subcategories Section */}
                      <div className="space-y-2.5 rounded-[6px] border border-[#E5E7EB] bg-[#F6F7F9] p-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5E6675]">
                            <Users size={13} weight="regular" className="text-[#1049EB]" />
                            <span>Subcategories ({subcats.length})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setAddingSubCategoryParentId(isAddingSub ? null : category.id)
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1049EB] hover:underline"
                          >
                            <Plus size={12} weight="regular" />
                            <span>{isAddingSub ? 'Close' : 'Add Sub'}</span>
                          </button>
                        </div>

                        {/* Add Subcategory Inline Form */}
                        {isAddingSub ? (
                          <form
                            onSubmit={(e) => handleCreateSubCategory(category.id, e)}
                            className="space-y-2 border-t border-[#E5E7EB] pt-2.5"
                          >
                            <input
                              type="text"
                              required
                              value={subLabel}
                              onChange={(e) => setSubLabel(e.target.value)}
                              placeholder="Subcategory name (e.g. Smart 4K TVs)"
                              className="w-full rounded-[6px] border border-[#D1D5DB] bg-white p-2 text-xs text-[#0B1220] focus:border-[#1049EB] focus:outline-none focus:ring-2 focus:ring-[#1049EB]/15"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="mb-0.5 block text-[10px] font-semibold uppercase text-[#5E6675]">
                                  Age Group
                                </label>
                                <select
                                  value={subAgeGroup}
                                  onChange={(e) =>
                                    setSubAgeGroup(
                                      e.target.value as 'Adults' | 'Children' | 'Babies' | 'All Ages'
                                    )
                                  }
                                  className="w-full rounded-[6px] border border-[#D1D5DB] bg-white p-1.5 text-xs font-medium text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
                                >
                                  <option value="Adults">Adults</option>
                                  <option value="Children">Children</option>
                                  <option value="Babies">Babies</option>
                                  <option value="All Ages">All Ages</option>
                                </select>
                              </div>

                              <div>
                                <label className="mb-0.5 block text-[10px] font-semibold uppercase text-[#5E6675]">
                                  Gender Target
                                </label>
                                <select
                                  value={subGender}
                                  onChange={(e) =>
                                    setSubGender(
                                      e.target.value as
                                        | 'Men'
                                        | 'Women'
                                        | 'Unisex'
                                        | 'Boys'
                                        | 'Girls'
                                    )
                                  }
                                  className="w-full rounded-[6px] border border-[#D1D5DB] bg-white p-1.5 text-xs font-medium text-[#0B1220] focus:border-[#1049EB] focus:outline-none"
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
                              className="w-full rounded-[6px] bg-[#0B1220] py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E293B]"
                            >
                              Save Subcategory
                            </button>
                          </form>
                        ) : null}

                        {/* Subcategory Chips */}
                        {subcats.length === 0 ? (
                          <p className="text-[11px] text-[#5E6675]">No subcategories created yet.</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {subcats.map((sub) => (
                              <span
                                key={sub.id}
                                className="inline-flex items-center gap-1 rounded-[4px] border border-[#E5E7EB] bg-white px-2 py-0.5 text-[11px] font-medium text-[#0B1220]"
                              >
                                <span>{sub.label}</span>
                                {sub.ageGroup ? (
                                  <span className="rounded-[4px] bg-[#EEF3FE] px-1 py-0.2 font-mono text-[9px] font-semibold text-[#1049EB]">
                                    {sub.ageGroup}
                                  </span>
                                ) : null}
                                {sub.genderTarget && sub.genderTarget !== 'Unisex' ? (
                                  <span className="rounded-[4px] bg-[#F6F7F9] px-1 py-0.2 font-mono text-[9px] font-semibold text-[#374151]">
                                    {sub.genderTarget}
                                  </span>
                                ) : null}
                                <button
                                  type="button"
                                  aria-label={`Remove subcategory ${sub.label}`}
                                  onClick={() => deleteSubCategory(category.id, sub.id)}
                                  className="ml-0.5 text-[#5E6675] hover:text-[#B91C1C]"
                                >
                                  <X size={11} weight="regular" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-3 text-xs">
                        <span className="font-mono text-xs font-semibold text-[#5E6675]">
                          {productCount} Products
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(category)}
                          className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1220] transition-colors hover:bg-[#F6F7F9]"
                        >
                          <PencilSimple size={14} weight="regular" className="text-[#1049EB]" />
                          <span>Edit Card</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
