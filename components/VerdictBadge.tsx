import { Verdict } from '@/lib/models/Fact'

const verdictConfig: Record<Verdict, { label: string; bg: string; text: string; border: string }> = {
  true:     { label: 'TRUE',     bg: 'bg-emerald-50',  text: 'text-emerald-800', border: 'border-emerald-300' },
  false:    { label: 'FALSE',    bg: 'bg-red-50',      text: 'text-red-800',     border: 'border-red-300'     },
  mixture:  { label: 'MIXTURE',  bg: 'bg-amber-50',    text: 'text-amber-800',   border: 'border-amber-300'   },
  unproven: { label: 'UNPROVEN', bg: 'bg-stone-100',   text: 'text-stone-600',   border: 'border-stone-300'   },
  satire:   { label: 'SATIRE',   bg: 'bg-violet-50',   text: 'text-violet-800',  border: 'border-violet-300'  },
  outdated: { label: 'OUTDATED', bg: 'bg-orange-50',   text: 'text-orange-800',  border: 'border-orange-300'  },
}

interface Props {
  verdict: Verdict
  size?: 'sm' | 'md' | 'lg'
}

export default function VerdictBadge({ verdict, size = 'md' }: Props) {
  const config = verdictConfig[verdict] ?? verdictConfig['unproven']
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-widest',
    md: 'text-xs px-2.5 py-1 tracking-widest',
    lg: 'text-sm px-3 py-1.5 tracking-widest',
  }

  return (
    <span className={`inline-flex items-center font-bold rounded-sm border uppercase ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}>
      {config.label}
    </span>
  )
}
