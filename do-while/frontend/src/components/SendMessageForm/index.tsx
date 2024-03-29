import { FormEvent, useContext, useState } from "react"
import { VscGithubInverted, VscSignOut } from "react-icons/vsc"
import { AuthContext } from "../../contexts/auth"
import { api } from "../../services/api"
import styles from "./styles.module.scss"

export function SendMessageForm() {
  const { user, signOut } = useContext(AuthContext)
  const [message, setMessage] = useState("")

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault()
    if (!message.trim()) return
    await api.post("messages", { message })
    setMessage("")
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button className={styles.signOutButton} onClick={signOut}>
        <VscSignOut size="32" />
      </button>
      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt="" />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted />
          {user?.login}
        </span>
      </header>

      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <textarea
          name="message"
          id="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Qual sua expectativa para o evento?"
        />

        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  )
}
