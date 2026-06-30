'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Login failed')
      }
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0b] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/">
            <p className="font-serif font-black text-white text-3xl tracking-tight mb-1">FactBrief</p>
          </Link>
          <p className="text-stone-500 text-xs uppercase tracking-widest">Editorial Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 p-8 space-y-5">
          <h1 className="text-white text-sm font-semibold uppercase tracking-widest mb-6">Sign In</h1>

          {error && (
            <div className="border border-red-800 bg-red-950 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 text-white text-sm placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors"
              placeholder="admin@factbrief.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 text-white text-sm placeholder-stone-600 focus:outline-none focus:border-stone-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-white text-[#0c0c0b] text-sm font-bold uppercase tracking-widest hover:bg-stone-200 disabled:opacity-40 transition-colors mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-stone-600 text-xs mt-6">
          <Link href="/" className="hover:text-stone-400 transition-colors">← Back to FactBrief</Link>
        </p>
      </div>
    </div>
  )
}
