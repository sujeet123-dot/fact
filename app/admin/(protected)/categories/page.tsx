'use client'

import { useEffect, useState } from 'react'

interface Category {
  _id: string
  name: string
  slug: string
  icon: string
  description: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', slug: '', icon: '📋', description: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
    setForm((prev) => ({ ...prev, name, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create')
      }
      setForm({ name: '', slug: '', icon: '📋', description: '' })
      setSuccess('Category created!')
      fetchCategories()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return
    await fetch(`/api/categories/${slug}`, { method: 'DELETE' })
    fetchCategories()
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm">Manage fact-check categories</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Add Category</h2>
        {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
        {success && <div className="mb-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input value={form.name} onChange={handleNameChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Health" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (auto)</label>
              <input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="health" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
              <input value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="🏥" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Short description..." />
            </div>
          </div>
          <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors">
            {saving ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-700">{categories.length} Categories</p>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <li key={cat._id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400">{cat.slug}{cat.description && ` — ${cat.description}`}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(cat.slug, cat.name)} className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
