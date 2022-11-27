import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'
import { InputHTMLAttributes, ReactNode } from 'react'

import { Text, TextProps } from './Text'

export interface TextInputRootProps {
  children?: ReactNode
  className?: string
}

function TextInputRoot({ children, className }: TextInputRootProps) {
  return (
    <div
      className={clsx(
        'h-12 px-3 rounded',
        'bg-gray-800',
        'flex items-center gap-3',
        'focus-within:ring-2 ring-cyan-300',
        className
      )}
    >
      {children}
    </div>
  )
}

TextInputRoot.displayName = 'TextInput.Root'

interface TextInputIconProps {
  children: ReactNode
}

export function TextInputIcon({ children }: TextInputIconProps) {
  return <Slot className="w-6 h-6 text-gray-400">{children}</Slot>
}

TextInputIcon.displayName = 'TextInput.Icon'

export interface TextInputInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export function TextInputInput(props: TextInputInputProps) {
  return (
    <input
      className={clsx(
        'h-full my-1',
        'flex-1 bg-transparent',
        'text-gray-100 text-xs',
        'placeholder:text-gray-400',
        'outline-none'
      )}
      {...props}
    />
  )
}

TextInputInput.displayName = 'TextInput.Input'

interface TextInputContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

function TextInputContainer({ className, ...props }: TextInputContainerProps) {
  return <div {...props} className={clsx('flex flex-col gap-3', className)} />
}

TextInputContainer.displayName = 'TextInput.Container'

interface TextInputLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  TextProps?: TextProps
}

function TextInputLabel({ TextProps, ...props }: TextInputLabelProps) {
  return (
    <Text asChild size="md" {...TextProps}>
      <label {...props} />
    </Text>
  )
}

TextInputLabel.displayName = 'TextInput.Label'

export const TextInput = {
  Root: TextInputRoot,
  Input: TextInputInput,
  Icon: TextInputIcon,
  Container: TextInputContainer,
  Label: TextInputLabel,
}
