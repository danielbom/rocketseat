import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
  async execute(req: Request, res: Response) {
    const { value } = req.params
    const { u: id } = req.query // survey user id

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    if (!id) {
      throw new AppError('SURVEY_USER_NOT_EXISTS')
    }

    const surveyUser = await surveysUsersRepository.findOne({ id: id.toString() })

    if (!surveyUser) {
      throw new AppError('SURVEY_USER_NOT_EXISTS')
    }

    surveyUser.value = Number(value)

    await surveysUsersRepository.save(surveyUser)

    res.json(surveyUser)
  }
}

export { AnswerController }