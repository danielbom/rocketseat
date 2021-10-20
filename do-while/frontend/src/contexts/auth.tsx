import React, { createContext, useEffect, useState } from "react"
import { api } from "../services/api"

type User = {
  id: string
  name: string
  login: string
  avatar_url: string
}

type AuthContextData = {
  user: User | null
  signInUrl: string
  signOut: () => void
}

export const AuthContext = createContext({} as AuthContextData)

type AuthResponse = {
  token: string
  user: {
    id: string
    avatar_url: string
    name: string
    login: string
  }
}

const TOKEN_KEY = "@dowhile:token"

export function AuthProvider({ children }: React.PropsWithChildren<{}>) {
  const [user, setUser] = useState<User | null>(null)

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>("authenticate", {
      code: githubCode,
    })

    const { token, user } = response.data
    localStorage.setItem(TOKEN_KEY, token)
    api.defaults.headers.common.authorization = "Bearer " + token
    setUser(user)
  }

  async function signOut() {
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (token) {
      api.defaults.headers.common.authorization = "Bearer " + token
      api.get<User>("profile").then((response) => {
        setUser(response.data)
      })
    }
  }, [])

  useEffect(() => {
    const url = window.location.href
    const hasGithubCode = url.includes("?code=")

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split("?code=")
      window.history.pushState({}, "", urlWithoutCode)
      signIn(githubCode)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        signInUrl: "http://localhost:4000/github",
        user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
