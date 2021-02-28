import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import fs from 'fs'
import handlebars from 'handlebars'

class SendMailService {
  private client: Mail | null = null

  constructor() {
    nodemailer.createTestAccount()
      .then(account => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass
          }
        })

        this.client = transporter
      })
  }

  async execute(props: { to: string, subject: string, variables: any, path: string }) {
    const { to, subject, variables, path } = props

    const template = fs.readFileSync(path).toString('utf8')

    const mailTemplateParse = handlebars.compile(template)

    const html = mailTemplateParse(variables)

    const message = await this.client?.sendMail({
      to,
      subject,
      html,
      from: "NPS <noreplay@nps.com.br>"
    })

    console.log('Message send: %s', message.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
  }
}

export default new SendMailService()