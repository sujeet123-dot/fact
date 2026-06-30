'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: '◼' },
  { label: 'Fact Checks', href: '/admin/facts', icon: '✓' },
  { label: 'Categories', href: '/admin/categories', icon: '≡' },
]

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <aside className="w-56 shrink-0 bg-[#0c0c0b] min-h-screen flex flex-col border-r border-stone-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-stone-800">
        <Link href="/" target="_blank" className="group">
          <span className="font-serif font-black text-white text-lg tracking-tight">FactBrief</span>
          <p className="text-stone-600 text-[10px] uppercase tracking-widest mt-0.5 group-hover:text-stone-400 transition-colors">
            Admin Panel
          </p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(item.href)
                ? 'bg-white text-[#0c0c0b]'
                : 'text-stone-400 hover:text-white hover:bg-stone-900'
            }`}
          >
            <span className="text-xs">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="pt-5 mt-5 border-t border-stone-800">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone-500 hover:text-white hover:bg-stone-900 transition-colors"
          >
            <span className="text-xs">↗</span>
            View Site
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-stone-800">
        <p className="text-stone-500 text-[10px] uppercase tracking-widest mb-1">Signed in</p>
        <p className="text-white text-xs font-medium truncate mb-3">{email}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-stone-500 hover:text-[#c0392b] transition-colors"
        >
          Sign out →
        </button>
      </div>
    </aside>
  )
}
