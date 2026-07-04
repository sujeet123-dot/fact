'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const NAV_LINKS = [
  { label: 'Politics', href: '/category/politics' },
  { label: 'Health', href: '/category/health' },
  { label: 'Science', href: '/category/science' },
  { label: 'Technology', href: '/category/technology' },
  { label: 'Entertainment', href: '/category/entertainment' },
  { label: 'Environment', href: '/category/environment' },
]

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className="group relative block px-4 py-3 text-xs font-semibold uppercase tracking-widest text-stone-600 hover:text-[#0c0c0b] transition-colors whitespace-nowrap"
    >
      {label}
      <span
        className={`pointer-events-none absolute bottom-1.5 left-4 right-4 h-[2px] origin-left scale-x-0 bg-[#c9a84c] transition-transform duration-300 ease-out group-hover:scale-x-100 ${active ? 'scale-x-100' : ''}`}
      />
    </Link>
  )
}

export default function Header() {
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#ddd9d2] transition-shadow duration-300 ${scrolled ? 'shadow-[0_2px_16px_rgba(12,12,11,0.06)]' : ''}`}
    >
      {/* Top strip */}
      <div className="border-b border-[#ddd9d2]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-stone-400 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>

          {/* Logo */}
          <Link href="/" className="flex-1 flex justify-center sm:flex-none sm:justify-start items-center gap-2">
            <Image src="/logo.png" alt="FactBrief" width={40} height={40} priority className="h-10 w-auto object-contain" />
            <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-[#0c0c0b] leading-none">FactBrief</span>
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
      <AnimatePresence initial={false}>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="border-b border-[#ddd9d2] bg-white overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav bar */}
      <nav className="hidden sm:block border-b border-[#ddd9d2]">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0 overflow-x-auto">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} label={link.label} />
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
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="sm:hidden border-b border-[#ddd9d2] bg-white overflow-hidden"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
