import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Image from 'next/image'
import './globals.css'
import Header from '@/components/Header'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'FactBrief — Truth in Every Claim',
    template: '%s | FactBrief',
  },
  description: 'FactBrief is your trusted source for fact-checking viral claims, political statements, health myths, and internet rumors.',
  keywords: ['fact check', 'misinformation', 'truth', 'verify', 'debunk'],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: { siteName: 'FactBrief', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#faf9f6] text-[#0c0c0b] min-h-screen font-sans antialiased">
        <Header />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <main>{children}</main>

        <footer className="mt-20 border-t-2 border-[#0c0c0b] bg-[#0c0c0b] text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/logo.png" alt="FactBrief" width={36} height={36} className="h-9 w-auto object-contain brightness-0 invert" />
                  <span className="font-serif text-2xl font-black tracking-tight">FactBrief</span>
                </div>
                <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
                  Independent fact-checking journalism. We investigate viral claims, political statements,
                  and internet rumors — so you know what's actually true.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Topics</h4>
                <ul className="space-y-2 text-sm">
                  {['Politics', 'Health', 'Science', 'Technology', 'Entertainment', 'Environment'].map((cat) => (
                    <li key={cat}>
                      <a href={`/category/${cat.toLowerCase()}`} className="text-stone-300 hover:text-white transition-colors">
                        {cat}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Verdicts</h4>
                <ul className="space-y-2 text-sm">
                  {[
                    { label: 'True', color: 'text-emerald-400' },
                    { label: 'False', color: 'text-red-400' },
                    { label: 'Mixture', color: 'text-amber-400' },
                    { label: 'Unproven', color: 'text-stone-400' },
                    { label: 'Satire', color: 'text-violet-400' },
                    { label: 'Outdated', color: 'text-orange-400' },
                  ].map((v) => (
                    <li key={v.label} className={`font-bold ${v.color}`}>{v.label}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-stone-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
              <span>© {new Date().getFullYear()} FactBrief. All rights reserved.</span>
              <span>Independent · Non-partisan · Evidence-based</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
