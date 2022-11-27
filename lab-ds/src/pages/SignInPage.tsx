import clsx from 'clsx'
import { Envelope, Lock } from 'phosphor-react'
import React, { ReactNode, useState } from 'react'

import { Button } from '../components/Button'
import { Checkbox } from '../components/Checkbox'
import { Heading } from '../components/Heading'
import { ReactLogo } from '../components/ReactLogo'
import { Text } from '../components/Text'
import { TextInput, TextInputInputProps } from '../components/TextInput'

export interface SignInPageProps {}

export function SignInPage(_: SignInPageProps) {
  return (
    <Container>
      <Header />
      <Form />
      <Footer />
    </Container>
  )
}

function Container({ children }: React.PropsWithChildren) {
  return (
    <div
      className={clsx(
        'min-h-screen min-w-screen py-4',
        'flex flex-col justify-center items-center',
        'bg-gray-900'
      )}
    >
      <div className="w-96">{children}</div>
    </div>
  )
}

function Header() {
  return (
    <header className="flex flex-col items-center pb-10">
      <ReactLogo />
      <Heading size="lg" className="mt-4 mb-2">
        Ignite Lab
      </Heading>
      <Text size="lg" className="text-gray-400">
        Faça login e comece a usar
      </Text>
    </header>
  )
}

interface FormValues {
  username: string
  password: string
  remember: boolean
}

function Form() {
  const [isUserSignIn, setIsUserSignIn] = useState(false)
  const [values, _setValues] = useState<FormValues>({
    username: '',
    password: '',
    remember: false,
  })

  function setValues(newValues: Partial<FormValues>) {
    _setValues({ ...values, ...newValues })
  }

  function onChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setValues({ [event.target.name]: event.target.value })
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log({ values })
    setIsUserSignIn((enable) => !enable)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {isUserSignIn && <Text>Login realizado com sucesso!</Text>}

      <Input
        label="Endereço de e-mail"
        icon={<Envelope />}
        id="username"
        name="username"
        placeholder="Digite seu email"
        type="email"
        onChange={onChangeInput}
      />
      <Input
        label="Sua senha"
        icon={<Lock />}
        id="password"
        name="password"
        placeholder="**********"
        type="password"
        onChange={onChangeInput}
      />

      <div className="flex align-center gap-2">
        <Checkbox
          id="remember"
          name="remember"
          checked={values.remember}
          onClick={() => setValues({ remember: !values.remember })}
        />
        <Text asChild>
          <label htmlFor="remember">Lembrar de mim por 30 dias</label>
        </Text>
      </div>

      <div className="pt-7 pb-8">
        <Button type="submit">Entrar na plataforma</Button>
      </div>
    </form>
  )
}

function Footer() {
  return (
    <footer
      className={clsx(
        'flex flex-col gap-4',
        'text-center',
        'underline underline-offset-2'
      )}
    >
      <Anchor href="#forgot-password">Esqueceu sua senha</Anchor>
      <Anchor href="#create-account">
        Não possui uma conta? Crie uma agora!
      </Anchor>
    </footer>
  )
}

interface InputProps extends TextInputInputProps {
  icon: ReactNode
  label: string
}

function Input({ icon, label, name, ...props }: InputProps) {
  return (
    <TextInput.Container>
      <TextInput.Label htmlFor={name}>{label}</TextInput.Label>
      <TextInput.Root>
        <TextInput.Icon>{icon}</TextInput.Icon>
        <TextInput.Input name={name} {...props} />
      </TextInput.Root>
    </TextInput.Container>
  )
}

interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

function Anchor(props: AnchorProps) {
  return (
    <Text asChild size="sm">
      <a
        {...props}
        className="cursor-pointer text-gray-400 hover:text-gray-200"
      />
    </Text>
  )
}
