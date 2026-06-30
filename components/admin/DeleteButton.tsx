'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  slug: string
  title: string
}

export default function DeleteButton({ slug, title }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"?\n\nThis cannot be undone.`)) return
    setLoading(true)
    try {
      await fetch(`/api/facts/${slug}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
    >
      {loading ? '...' : 'Delete'}
    </button>
  )
}
