import * as Radix from '@radix-ui/react-checkbox'
import clsx from 'clsx'
import { Check } from 'phosphor-react'

export interface CheckboxProps extends Radix.CheckboxProps {}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <Radix.Root
      {...props}
      className={clsx('w-6 h-6 p-[2px] bg-gray-800 rounded', className)}
    >
      <Radix.Indicator asChild>
        <Check weight="bold" className="h-5 w-5 text-cyan-500" />
      </Radix.Indicator>
    </Radix.Root>
  )
}
