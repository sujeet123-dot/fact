import { Verdict } from '@/lib/models/Fact'
import { cn } from '@/lib/utils'

const verdictConfig: Record<Verdict, { label: string; bg: string; text: string; border: string; glow: string; dashed?: boolean }> = {
  true:     { label: 'TRUE',     bg: 'bg-emerald-50',  text: 'text-emerald-800', border: 'border-emerald-300', glow: 'ring-emerald-300/50' },
  false:    { label: 'FALSE',    bg: 'bg-red-50',      text: 'text-red-800',     border: 'border-red-300',     glow: 'ring-red-300/50'     },
  mixture:  { label: 'MIXTURE',  bg: 'bg-amber-50',    text: 'text-amber-800',   border: 'border-amber-300',   glow: 'ring-amber-300/50'   },
  unproven: { label: 'UNPROVEN', bg: 'bg-stone-100',   text: 'text-stone-600',   border: 'border-stone-300',   glow: 'ring-stone-300/50'   },
  satire:   { label: 'SATIRE',   bg: 'bg-[#0c0c0b]',   text: 'text-white',       border: 'border-[#0c0c0b]',   glow: 'ring-stone-400/50'   },
  outdated: { label: 'OUTDATED', bg: 'bg-stone-50',    text: 'text-stone-500',   border: 'border-stone-300',   glow: 'ring-stone-300/40', dashed: true },
}

interface Props {
  verdict: Verdict
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
}

export default function VerdictBadge({ verdict, size = 'md', glow = false }: Props) {
  const config = verdictConfig[verdict] ?? verdictConfig['unproven']
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-widest',
    md: 'text-xs px-2.5 py-1 tracking-widest',
    lg: 'text-sm px-3 py-1.5 tracking-widest',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-sm border uppercase transition-shadow',
        config.bg, config.text, config.border, sizeClasses[size],
        config.dashed && 'border-dashed',
        glow && `ring-4 ${config.glow}`
      )}
    >
      {config.label}
    </span>
  )
}
