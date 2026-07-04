import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'
import FactCard from '@/components/FactCard'
import TrendingSidebar from '@/components/TrendingSidebar'
import Link from 'next/link'
import { Verdict } from '@/lib/models/Fact'
import { Marquee } from '@/components/magicui/marquee'
import { BlurFade } from '@/components/magicui/blur-fade'

export const revalidate = 60

async function getData() {
  await connectDB()
  const [lead, featured, latest, trending] = await Promise.all([
    Fact.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(1).select('-content').lean(),
    Fact.find({ isFeatured: true }).sort({ createdAt: -1 }).skip(1).limit(2).select('-content').lean(),
    Fact.find().sort({ createdAt: -1 }).limit(8).select('-content').lean(),
    Fact.find({ isTrending: true }).sort({ viewCount: -1 }).limit(5).select('-content').lean(),
  ])
  return { lead: lead[0] || null, featured, latest, trending }
}

export default async function HomePage() {
  const { lead, featured, latest, trending } = await getData()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Headline ticker */}
      {latest.length > 0 && (
        <div className="mb-10 border-y border-[#0c0c0b] bg-[#0c0c0b] text-white">
          <div className="flex items-center">
            <span className="shrink-0 bg-[#c9a84c] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#0c0c0b]">
              Latest
            </span>
            <Marquee duration={35} className="py-2">
              {latest.map((fact) => (
                <Link
                  key={String(fact._id)}
                  href={`/fact/${fact.slug}`}
                  className="text-xs font-medium text-stone-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  {fact.title}
                </Link>
              ))}
            </Marquee>
          </div>
        </div>
      )}

      {/* Lead story + trending sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          {lead ? (
            <FactCard
              fact={{ ...lead, _id: String(lead._id), createdAt: lead.createdAt.toISOString() } as any}
              variant="lead"
            />
          ) : (
            <div className="border-t-2 border-[#0c0c0b] pt-8 text-center text-stone-400 py-16">
              <p className="font-serif text-xl">No featured stories yet.</p>
              <p className="text-sm mt-2">Run <code>npm run seed</code> to load sample data.</p>
            </div>
          )}
        </div>

        {trending.length > 0 && (
          <div className="lg:border-l lg:border-[#ddd9d2] lg:pl-8">
            <TrendingSidebar
              facts={trending.map((f) => ({
                _id: String(f._id),
                title: f.title,
                slug: f.slug,
                verdict: f.verdict as Verdict,
                viewCount: f.viewCount,
                category: f.category,
              }))}
            />
          </div>
        )}
      </div>

      {/* Featured grid (2 dark cards) */}
      {featured.length > 0 && (
        <section className="mb-10">
          <div className="section-rule">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0c0c0b] whitespace-nowrap">Editor's Picks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#ddd9d2]">
            {featured.map((fact, i) => (
              <BlurFade key={String(fact._id)} delay={i * 0.1}>
                <FactCard
                  fact={{ ...fact, _id: String(fact._id), createdAt: fact.createdAt.toISOString() } as any}
                  variant="featured"
                />
              </BlurFade>
            ))}
          </div>
        </section>
      )}

      {/* Latest + Verdict guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="section-rule">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0c0c0b] whitespace-nowrap">Latest Fact Checks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {latest.map((fact, i) => (
              <BlurFade key={String(fact._id)} delay={i * 0.06}>
                <FactCard
                  fact={{ ...fact, _id: String(fact._id), createdAt: fact.createdAt.toISOString() } as any}
                />
              </BlurFade>
            ))}
          </div>
          <div className="mt-6 border-t border-[#ddd9d2] pt-4">
            <Link href="/search" className="text-xs font-semibold uppercase tracking-widest text-stone-400 hover:text-[#c9a84c] transition-colors">
              Browse all fact checks →
            </Link>
          </div>
        </div>

        {/* Sidebar: verdict guide + about */}
        <div className="space-y-8 lg:border-l lg:border-[#ddd9d2] lg:pl-8">
          <div>
            <div className="section-rule">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0c0c0b] whitespace-nowrap">Verdict Guide</h3>
            </div>
            <div className="border-t-2 border-[#0c0c0b] pt-4 space-y-3">
              {[
                { label: 'TRUE',     desc: 'The claim is accurate.',             cls: 'text-emerald-700' },
                { label: 'FALSE',    desc: 'The claim is inaccurate.',           cls: 'text-red-700'     },
                { label: 'MIXTURE',  desc: 'Partially true; missing context.',   cls: 'text-amber-700'   },
                { label: 'UNPROVEN', desc: 'Insufficient evidence either way.',  cls: 'text-stone-500'   },
                { label: 'SATIRE',   desc: 'Originally satire, shared as fact.', cls: 'text-[#0c0c0b]'   },
              ].map((v) => (
                <div key={v.label} className="flex items-start gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest pt-0.5 w-20 shrink-0 ${v.cls}`}>{v.label}</span>
                  <span className="text-xs text-stone-500 leading-relaxed">{v.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-rule">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0c0c0b] whitespace-nowrap">About</h3>
            </div>
            <div className="border-t-2 border-[#0c0c0b] pt-4">
              <p className="text-sm text-stone-600 leading-relaxed">
                FactBrief is an independent fact-checking publication. We research claims before you share them.
                Non-partisan. Evidence-based. Always free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
