'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Source { label: string; url: string }

interface FormState {
  title: string
  claim: string
  verdict: string
  category: string
  summary: string
  content: string
  tags: string
  author: string
  sources: Source[]
  imageUrl: string
  isTrending: boolean
  isFeatured: boolean
}

const VERDICTS = ['true', 'false', 'mixture', 'unproven', 'satire', 'outdated']
const CATEGORIES = ['politics', 'health', 'science', 'technology', 'entertainment', 'environment']

interface Props {
  initialData?: Partial<FormState & { slug: string; tags: string[] }>
  mode: 'create' | 'edit'
}

export default function FactForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const [form, setForm] = useState<FormState>({
    title: initialData?.title || '',
    claim: initialData?.claim || '',
    verdict: initialData?.verdict || 'false',
    category: initialData?.category || 'politics',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(', ') : (initialData?.tags || ''),
    author: initialData?.author || 'FactBrief Staff',
    sources: initialData?.sources?.length ? initialData.sources : [{ label: '', url: '' }],
    imageUrl: initialData?.imageUrl || '',
    isTrending: initialData?.isTrending ?? false,
    isFeatured: initialData?.isFeatured ?? false,
  })

  const set = (field: keyof FormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target
    set(name as keyof FormState, type === 'checkbox' ? (e.target as HTMLInputElement).checked : value)
  }

  const setSource = (i: number, field: 'label' | 'url', value: string) =>
    setForm((prev) => {
      const sources = [...prev.sources]
      sources[i] = { ...sources[i], [field]: value }
      return { ...prev, sources }
    })

  const addSource = () => setForm((prev) => ({ ...prev, sources: [...prev.sources, { label: '', url: '' }] }))
  const removeSource = (i: number) => setForm((prev) => ({ ...prev, sources: prev.sources.filter((_, idx) => idx !== i) }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) set('imageUrl', data.url)
      else setError(data.error || 'Upload failed')
    } catch {
      setError('Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const slug = mode === 'create'
      ? form.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
      : initialData?.slug

    const payload = {
      ...form,
      slug,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sources: form.sources.filter((s) => s.label && s.url),
    }

    try {
      const url = mode === 'create' ? '/api/facts' : `/api/facts/${initialData?.slug}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }
      router.push('/admin/facts')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-stone-500 bg-white transition-colors'
  const labelCls = 'block text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</div>
      )}

      <div>
        <label className={labelCls}>Title *</label>
        <input name="title" value={form.title} onChange={handleChange} required className={inputCls} placeholder="Does X cause Y?" />
      </div>

      <div>
        <label className={labelCls}>Claim — exact statement being checked *</label>
        <textarea name="claim" value={form.claim} onChange={handleChange} required rows={3} className={inputCls} placeholder="The viral claim..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Verdict *</label>
          <select name="verdict" value={form.verdict} onChange={handleChange} className={inputCls}>
            {VERDICTS.map((v) => <option key={v} value={v}>{v.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Summary *</label>
        <textarea name="summary" value={form.summary} onChange={handleChange} required rows={3} className={inputCls} placeholder="1–2 sentence finding..." />
      </div>

      <div>
        <label className={labelCls}>Full Content — HTML supported *</label>
        <textarea name="content" value={form.content} onChange={handleChange} required rows={14} className={`${inputCls} font-mono text-xs`}
          placeholder={'<p>Investigation...</p>\n<h2>What we found</h2>\n<p>...</p>'} />
        <p className="text-xs text-stone-400 mt-1">Use &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt; tags.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Tags (comma separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className={inputCls} placeholder="health, covid, vaccines" />
        </div>
        <div>
          <label className={labelCls}>Author</label>
          <input name="author" value={form.author} onChange={handleChange} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Sources</label>
        <div className="space-y-2">
          {form.sources.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={s.label} onChange={(e) => setSource(i, 'label', e.target.value)} placeholder="Source name" className={`${inputCls} flex-1`} />
              <input value={s.url} onChange={(e) => setSource(i, 'url', e.target.value)} placeholder="https://..." className={`${inputCls} flex-1`} />
              <button type="button" onClick={() => removeSource(i)} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-600 transition-colors text-sm">✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addSource} className="mt-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-stone-800 transition-colors">
          + Add source
        </button>
      </div>

      <div>
        <label className={labelCls}>Cover Image</label>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload}
              className="w-full text-sm text-stone-500 file:mr-3 file:py-1.5 file:px-4 file:border file:border-stone-300 file:text-sm file:font-medium file:text-stone-700 hover:file:bg-stone-50 file:transition-colors file:bg-white" />
            {uploadingImage && <p className="text-xs text-stone-400 mt-1">Uploading...</p>}
          </div>
          {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="h-14 w-20 object-cover border border-stone-200 shrink-0" />}
        </div>
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Or paste an image URL..." className={`${inputCls} mt-2`} />
      </div>

      <div className="flex flex-wrap gap-6">
        {[{ name: 'isTrending', label: 'Mark as Trending' }, { name: 'isFeatured', label: 'Feature on Homepage' }].map(({ name, label }) => (
          <label key={name} className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" name={name} checked={form[name as keyof FormState] as boolean} onChange={handleChange}
              className="w-4 h-4 border-stone-300 rounded-none accent-stone-900" />
            <span className="text-sm text-stone-700">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t border-stone-200">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 bg-[#0c0c0b] text-white text-sm font-semibold uppercase tracking-wide hover:bg-stone-800 disabled:opacity-40 transition-colors">
          {loading ? 'Saving...' : mode === 'create' ? 'Publish' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 border border-stone-300 text-stone-600 text-sm font-medium hover:border-stone-500 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}
