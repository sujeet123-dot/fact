'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Politics', href: '/category/politics' },
  { label: 'Health', href: '/category/health' },
  { label: 'Science', href: '/category/science' },
  { label: 'Technology', href: '/category/technology' },
  { label: 'Entertainment', href: '/category/entertainment' },
  { label: 'Environment', href: '/category/environment' },
]

export default function Header() {
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header className="bg-[#faf9f6] border-b border-[#ddd9d2]">
      {/* Top strip */}
      <div className="border-b border-[#ddd9d2]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-stone-400 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>

          {/* Logo */}
          <Link href="/" className="flex-1 flex justify-center sm:flex-none sm:justify-start">
            <Image src="/logo.png" alt="FactBrief" width={160} height={44} priority className="h-10 w-auto object-contain" />
          </Link>

          {/* Right: search icon */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="text-stone-500 hover:text-[#0c0c0b] transition-colors p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <button
              className="sm:hidden p-1 text-stone-500"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search bar (toggleable) */}
      {searchOpen && (
        <div className="border-b border-[#ddd9d2] bg-white">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fact checks..."
                autoFocus
                className="flex-1 px-3 py-2 border border-stone-300 text-sm focus:outline-none focus:border-stone-500 bg-white"
              />
              <button type="submit" className="px-4 py-2 bg-[#0c0c0b] text-white text-sm font-medium hover:bg-stone-800 transition-colors">
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)} className="px-3 py-2 text-stone-400 hover:text-stone-700 text-sm">
                ✕
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Nav bar */}
      <nav className="hidden sm:block border-b border-[#ddd9d2]">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0 overflow-x-auto">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-xs font-semibold uppercase tracking-widest text-stone-600 hover:text-[#0c0c0b] hover:bg-stone-100 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link href="/search" className="block px-4 py-3 text-xs text-stone-400 hover:text-stone-700 transition-colors">
                All Topics →
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="sm:hidden border-b border-[#ddd9d2] bg-white">
          <form onSubmit={handleSearch} className="flex gap-2 p-3 border-b border-stone-100">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fact checks..."
              className="flex-1 px-3 py-2 border border-stone-300 text-sm focus:outline-none"
            />
            <button type="submit" className="px-3 py-2 bg-[#0c0c0b] text-white text-sm">Go</button>
          </form>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 border-b border-stone-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
