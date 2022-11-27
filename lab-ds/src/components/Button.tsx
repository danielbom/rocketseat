import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function Button({ asChild, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      {...props}
      className={clsx(
        'py-3 px-4 rounded w-full',
        'bg-cyan-500 hover:bg-cyan-300 transition-colors',
        'focus:ring-2 ring-white',
        'font-semibold text-black text-sm',
        className
      )}
    />
  )
}
