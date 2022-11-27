import { Meta, StoryObj } from '@storybook/react'
import { Envelope } from 'phosphor-react'

import { TextInput, TextInputRootProps } from './TextInput'

export default {
  title: 'Components/TextInput',
  component: TextInput.Root,
  args: {
    children: [
      <TextInput.Icon>
        <Envelope />
      </TextInput.Icon>,
      <TextInput.Input placeholder="This is a placeholder" id="input" />,
    ],
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} as Meta<TextInputRootProps>

export const Default: StoryObj<TextInputRootProps> = {}
export const WithoutIcon: StoryObj<TextInputRootProps> = {
  args: {
    children: <TextInput.Input placeholder="This is a placeholder" />,
  },
}
export const WithLabel: StoryObj<TextInputRootProps> = {
  decorators: [
    (Story) => (
      <TextInput.Container>
        <TextInput.Label htmlFor="input">Digite seu e-mail</TextInput.Label>
        {Story()}
      </TextInput.Container>
    ),
  ],
}
