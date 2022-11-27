import { Meta, StoryObj } from '@storybook/react'
import { Checkbox, CheckboxProps } from './Checkbox'
import { Text } from './Text'

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {},
  decorators: [
    (Story) => {
      return (
        <div className="flex gap-2 align-center">
          {Story({ args: { id: 'checkbox' } })}
          <Text size="sm" asChild>
            <label htmlFor="checkbox">Check me</label>
          </Text>
        </div>
      )
    },
  ],
} as Meta<CheckboxProps>

export const Default: StoryObj<CheckboxProps> = {}
