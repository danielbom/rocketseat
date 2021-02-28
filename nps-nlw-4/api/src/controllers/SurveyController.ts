import { Request, Response } from "express"
import * as TypeORM from 'typeorm'
import { SurveysRepository } from "../repositories/SurveysRepository"

class SurveyController {
  async store(req: Request, res: Response) {
    const { title, description } = req.body

    const surveyRepository = TypeORM.getCustomRepository(SurveysRepository)
    
    const survey = surveyRepository.create({ title, description })

    await surveyRepository.save(survey)

    res.status(201).json(survey)
  }

  async index(req: Request, res: Response) {
    const surveyRepository = TypeORM.getCustomRepository(SurveysRepository)

    const all = await surveyRepository.find()

    res.json(all)
  }
}

export { SurveyController }
