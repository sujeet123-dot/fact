import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import Fact from '@/lib/models/Fact'
import VerdictBadge from '@/components/VerdictBadge'
import FactCard from '@/components/FactCard'
import { format } from 'date-fns'
import { Verdict } from '@/lib/models/Fact'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

const VERDICT_RATING: Record<string, { value: string; name: string }> = {
  true:     { value: '5', name: 'True' },
  mixture:  { value: '3', name: 'Mixture' },
  unproven: { value: '2', name: 'Unproven' },
  satire:   { value: '1', name: 'Satire' },
  false:    { value: '1', name: 'False' },
  outdated: { value: '2', name: 'Outdated' },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB()
  const { slug } = await params
  const fact = await Fact.findOne({ slug }).lean()
  if (!fact) return { title: 'Not Found' }
  return {
    title: fact.title,
    description: fact.summary,
    openGraph: { title: fact.title, description: fact.summary },
  }
}

async function getData(slug: string) {
  await connectDB()
  const fact = await Fact.findOneAndUpdate(
    { slug },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).lean()

  const related = fact
    ? await Fact.find({ category: fact.category, slug: { $ne: slug } })
        .sort({ createdAt: -1 })
        .limit(4)
        .select('-content')
        .lean()
    : []

  return { fact, related }
}

const verdictSummary: Record<Verdict, string> = {
  true:     'Our research confirms this claim is accurate.',
  false:    'Our research finds this claim to be inaccurate.',
  mixture:  'This claim contains elements of truth but is missing important context.',
  unproven: 'We could not find sufficient evidence to confirm or deny this claim.',
  satire:   'This originated as satire but has been shared as fact.',
  outdated: 'This claim may have been true at one point but is no longer accurate.',
}

const verdictBg: Record<string, string> = {
  true:     'bg-emerald-50 border-emerald-200',
  false:    'bg-red-50 border-red-200',
  mixture:  'bg-amber-50 border-amber-200',
  satire:   'bg-violet-50 border-violet-200',
  unproven: 'bg-stone-100 border-stone-200',
  outdated: 'bg-orange-50 border-orange-200',
}

export default async function FactPage({ params }: PageProps) {
  const { slug } = await params
  const { fact, related } = await getData(slug)
  if (!fact) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://factbrief.com'
  const rating = VERDICT_RATING[fact.verdict] || VERDICT_RATING.unproven
  const claimReviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClaimReview',
    url: `${siteUrl}/fact/${fact.slug}`,
    claimReviewed: fact.claim,
    datePublished: new Date(fact.createdAt).toISOString().split('T')[0],
    author: { '@type': 'Organization', name: 'FactBrief', url: siteUrl },
    itemReviewed: {
      '@type': 'Claim',
      datePublished: new Date(fact.createdAt).toISOString().split('T')[0],
      author: { '@type': 'Organization', name: 'Unknown' },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating.value,
      bestRating: '5',
      worstRating: '1',
      alternateName: rating.name,
    },
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Script id="claim-review-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(claimReviewSchema) }} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ── Article ── */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6 uppercase tracking-wide font-semibold">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/category/${fact.category}`} className="hover:text-[#c9a84c] transition-colors capitalize">{fact.category}</Link>
          </nav>

          {/* Verdict banner */}
          <div className={`border p-5 mb-6 ${verdictBg[fact.verdict] || verdictBg.unproven}`}>
            <div className="flex items-center gap-3">
              <VerdictBadge verdict={fact.verdict as Verdict} size="lg" />
              <p className="text-sm font-medium text-stone-700">
                {verdictSummary[fact.verdict as Verdict]}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif font-black text-[#0c0c0b] text-3xl md:text-4xl leading-tight mb-4">
            {fact.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 uppercase tracking-wide mb-8 pb-6 border-b border-[#ddd9d2]">
            <span className="font-semibold text-stone-600">{fact.author}</span>
            <span>·</span>
            <span>{format(new Date(fact.createdAt), 'MMMM d, yyyy')}</span>
            <span>·</span>
            <span>{fact.viewCount.toLocaleString()} views</span>
          </div>

          {/* Claim box */}
          <div className="border-l-4 border-[#0c0c0b] pl-5 mb-6 py-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">The Claim</p>
            <p className="text-stone-800 font-serif text-lg italic leading-relaxed">
              "{fact.claim}"
            </p>
          </div>

          {/* Summary callout */}
          <div className="bg-stone-100 border border-[#ddd9d2] p-5 mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Our Verdict in Brief</p>
            <p className="text-stone-800 leading-relaxed text-sm">{fact.summary}</p>
          </div>

          {/* Full article content */}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: fact.content }} />

          {/* Tags */}
          {fact.tags && fact.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-[#ddd9d2]">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {fact.tags.map((tag: string) => (
                  <span key={tag} className="px-2.5 py-1 border border-stone-300 text-stone-600 text-xs capitalize hover:border-stone-500 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {fact.sources && fact.sources.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#ddd9d2]">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Sources</p>
              <ul className="space-y-2">
                {fact.sources.map((source: { label: string; url: string }, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-stone-300 mt-0.5 shrink-0">→</span>
                    <a href={source.url} target="_blank" rel="noopener noreferrer"
                      className="text-stone-600 hover:text-[#c9a84c] hover:underline transition-colors">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>

        {/* ── Sidebar ── */}
        <aside className="space-y-8 lg:border-l lg:border-[#ddd9d2] lg:pl-8">
          {/* Verdict detail */}
          <div>
            <div className="section-rule">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#0c0c0b] whitespace-nowrap">Verdict</h3>
            </div>
            <div className="border-t-2 border-[#0c0c0b] pt-4 flex flex-col items-start gap-3">
              <VerdictBadge verdict={fact.verdict as Verdict} size="lg" />
              <p className="text-sm text-stone-600 leading-relaxed">{verdictSummary[fact.verdict as Verdict]}</p>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div className="section-rule">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0c0c0b] whitespace-nowrap">Related</h3>
              </div>
              <div className="border-t-2 border-[#0c0c0b]">
                {related.map((r) => (
                  <FactCard
                    key={String(r._id)}
                    fact={{ ...r, _id: String(r._id), createdAt: r.createdAt.toISOString() } as any}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
