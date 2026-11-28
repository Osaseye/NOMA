import { useState } from 'react'
import { ArrowLeft, Plus, SpinnerGap, Trash, UploadSimple } from '@phosphor-icons/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AdminTitle } from '../../components/admin/AdminTitle'
import { storageService } from '../../services/firebase/storageService'
import { useProductStore } from '../../store/productStore'
import type { CategoryId, SubCategory } from '../../types/commerce'

export function CategoryEditorPage() {
  const { categoryId } = useParams<{ categoryId?: string }>()
  const navigate = useNavigate()
  const { categories, addCategory, updateCategory } = useProductStore()

  const existing = categoryId ? categories.find((c) => c.id === categoryId) : undefined
  const isEditing = Boolean(existing)

  const [label, setLabel] = useState(existing?.label || '')
  const [defaultMarkupPercent, setDefaultMarkupPercent] = useState(
    existing?.defaultMarkupPercent ?? 18
  )
  const [merchandisingLine, setMerchandisingLine] = useState(
    existing?.merchandisingLine || ''
  )
  const [image, setImage] = useState(existing?.image || '/images/cat-appliances.png')
  const [subcategories, setSubcategories] = useState<SubCategory[]>(
    existing?.subcategories || []
  )
  const [uploadingImage, setUploadingImage] = useState(false)

  // Inline new subcategory fields on this subpage
  const [subLabel, setSubLabel] = useState('')
  const [subGroup, setSubGroup] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const toastId = toast.loading('Uploading category cover...')
    try {
      const url = await storageService.uploadImage(file, 'categories')
      setImage(url)
      toast.success('Category cover uploaded.', { id: toastId })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      toast.error(msg, { id: toastId })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddSub = () => {
    if (!subLabel.trim()) return
    const id = subLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const parentId =
      existing?.id ||
      label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') ||
      'category'
    const gender = subGroup.trim() as SubCategory['genderTarget'] | ''
    const validGenders = ['Men', 'Women', 'Unisex', 'Boys', 'Girls']
    setSubcategories((prev) => [
      ...prev,
      {
        id,
        label: subLabel.trim(),
        parentId,
        genderTarget: gender && validGenders.includes(gender) ? gender : undefined,
      },
    ])
    setSubLabel('')
    setSubGroup('')
  }

  const handleRemoveSub = (subId: string) => {
    setSubcategories((prev) => prev.filter((s) => s.id !== subId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) {
      toast.error('Enter a category name.')
      return
    }

    if (isEditing && existing) {
      updateCategory(existing.id, {
        label: label.trim(),
        defaultMarkupPercent: Number(defaultMarkupPercent) || 0,
        merchandisingLine:
          merchandisingLine.trim() || `Curated ${label.trim()} collection`,
        image: image || '/images/cat-appliances.png',
        subcategories,
      })
      toast.success(`Category "${label}" updated.`)
    } else {
      const id = label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') as CategoryId
      addCategory({
        id,
        label: label.trim(),
        defaultMarkupPercent: Number(defaultMarkupPercent) || 18,
        merchandisingLine:
          merchandisingLine.trim() || `Curated ${label.trim()} collection`,
        image: image || '/images/cat-appliances.png',
        subcategories,
      })
      toast.success(`Category "${label}" created.`)
    }

    navigate('/admin/categories')
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 pb-16">
      <div>
        <Link
          to="/admin/categories"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950"
        >
          <ArrowLeft size={14} />
          <span>Back to Categories</span>
        </Link>
        <AdminTitle
          title={isEditing ? `Edit ${existing?.label}` : 'New Category'}
          detail="Configure department name, default retail markup percentage, cover photo, and subcategories."
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Details */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Footwear & Sneakers"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Default Markup (%) *
            </label>
            <input
              type="number"
              required
              min={0}
              max={300}
              value={defaultMarkupPercent}
              onChange={(e) => setDefaultMarkupPercent(Number(e.target.value))}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold tabular-nums text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Subtitle / Merchandising Description
            </label>
            <input
              type="text"
              value={merchandisingLine}
              onChange={(e) => setMerchandisingLine(e.target.value)}
              placeholder="e.g. Retail pairs and wholesale footwear bales across Nigeria"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 focus:border-slate-950 focus:outline-none"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="border-t border-slate-200 pt-6">
          <label className="mb-2 block text-xs font-medium text-slate-600">
            Category Cover Photo
          </label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={image || '/images/cat-appliances.png'}
              alt="Category preview"
              className="h-24 w-24 shrink-0 rounded-xl bg-[#F4F4F5] object-cover"
            />
            <div className="flex flex-1 flex-col gap-2.5">
              <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 hover:border-slate-950">
                {uploadingImage ? (
                  <>
                    <SpinnerGap size={14} className="animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadSimple size={14} />
                    <span>Upload Cover Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Or paste image URL..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-slate-950 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Subcategories Section */}
        <div className="border-t border-slate-200 pt-6">
          <div className="mb-3">
            <h2 className="text-sm font-bold text-slate-950">
              Subcategories ({subcategories.length})
            </h2>
            <p className="text-xs text-slate-500">
              Add sub-departments (e.g. Men&apos;s Sneakers, Wholesale Bales, Blenders).
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              type="text"
              value={subLabel}
              onChange={(e) => setSubLabel(e.target.value)}
              placeholder="Subcategory name (e.g. Men's Sneakers)"
              className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
            />
            <input
              type="text"
              value={subGroup}
              onChange={(e) => setSubGroup(e.target.value)}
              placeholder="Optional: Men, Women, Unisex, Boys, Girls"
              className="h-9 sm:w-48 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-950 focus:border-slate-950 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSub}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-900 hover:border-slate-950"
            >
              <Plus size={13} weight="bold" />
              <span>Add Subcategory</span>
            </button>
          </div>

          {subcategories.length > 0 ? (
            <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              {subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between py-2.5 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-950">{sub.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSub(sub.id)}
                    className="text-slate-400 hover:text-slate-950"
                    aria-label={`Remove ${sub.label}`}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
          <Link
            to="/admin/categories"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-950"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={uploadingImage}
            className="rounded-lg bg-slate-950 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {isEditing ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  )
}
