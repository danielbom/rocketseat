import styles from "./styles.module.scss"

import logoImg from "../../assets/logo.svg"
import { api } from "../../services/api"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"

type Message = {
  id: string
  text: string
  user: {
    nome: string
    avatar_url: string
  }
}

const messagesQueue: Message[] = []

const socket = io("http://localhost:4000")

socket.on("new_message", (newMessage) => {
  messagesQueue.push(newMessage)
})

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    api.get<Message[]>("messages/last3").then((response) => {
      setMessages(response.data)
    })
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages((previous) => {
          return [messagesQueue[0], previous[0], previous[1]].filter(Boolean)
        })

        messagesQueue.shift()
      }
    }, 3000)

    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map((message, index) => {
          return (
            <li key={message.id + index} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.nome} />
                </div>
                <span>{message.user.nome}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
