import { Request, Response } from "express"
import path from 'path'
import { getCustomRepository } from "typeorm"
import { AppError } from "../errors/AppError"
import { SurveysRepository } from "../repositories/SurveysRepository"
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository"
import { UsersRepository } from "../repositories/UsersRepository"
import SendMailService from "../services/SendMailService"

const npsPath = path.resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body

    const userRepository = getCustomRepository(UsersRepository)
    const surveysRepository = getCustomRepository(SurveysRepository)
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const user = await userRepository.findOne({ email })

    if (!user) {
      throw new AppError('USER_NOT_EXISTS')
    }

    const survey = await surveysRepository.findOne({ id: survey_id })

    if (!survey) {
      throw new AppError("SURVEY_NOT_EXISTS")
    }

    const surveyUserExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, survey_id, value: null }
    })

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: surveyUserExists?.id,
      link: process.env.URL_MAIL
    }

    if (surveyUserExists) {
      await SendMailService.execute({
        to: email,
        subject: survey.title,
        variables,
        path: npsPath
      })

      res.json(surveyUserExists)
    } else {
      const surveyUser = surveyUserExists ?? await surveysUsersRepository.create({
        user_id: user.id,
        survey_id
      })

      await surveysUsersRepository.save(surveyUser)

      variables.id = surveyUser.id

      await SendMailService.execute({
        to: email,
        subject: survey.title,
        variables,
        path: npsPath
      })
      res.json(surveyUser)
    }
  }
}

export { SendMailController }
