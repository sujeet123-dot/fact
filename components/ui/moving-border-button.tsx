import { cn } from '@/lib/utils'

interface MovingBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button' | 'span'
  containerClassName?: string
  className?: string
}

/**
 * A rounded button ringed by a slowly rotating conic-gradient beam.
 * Use for primary CTAs where a small "premium" flourish is welcome.
 */
export function MovingBorderButton({
  children,
  containerClassName,
  className,
  as = 'button',
  ...props
}: MovingBorderButtonProps) {
  const Comp = as
  return (
    <Comp
      className={cn(
        'relative inline-flex items-center overflow-hidden rounded-full p-[1.5px]',
        containerClassName
      )}
      {...(props as any)}
    >
      <span className="absolute inset-[-100%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_60%,#c9a84c_85%,#f5e6b8_95%,transparent)]" />
      <span
        className={cn(
          'relative z-10 flex items-center gap-2 rounded-full bg-[#0c0c0b] px-6 py-2.5 text-sm font-semibold text-white transition-colors',
          className
        )}
      >
        {children}
      </span>
    </Comp>
  )
}
