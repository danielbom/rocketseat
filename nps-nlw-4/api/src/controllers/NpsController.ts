import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
  /**
   * 1 2 3 4 5 6 7 8 9 10
   * Detratores => 0 - 6
   * Passivos => 7 - 8
   * Promotores => 9 - 10
   * 
   * (promotores - detratores) / respondentes * 100
   */
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

    const surveysUsers = await surveysUsersRepository.find({ survey_id, value: Not(IsNull()) })

    const detractor = surveysUsers.filter(x => x.value >= 0 && x.value <= 6).length
    const promoters = surveysUsers.filter(x => x.value >= 9 && x.value <= 10).length
    const passive = surveysUsers.filter(x => x.value >= 7 && x.value <= 8).length

    const totalAnswers = surveysUsers.length

    const nps = Number(((promoters - detractor) / totalAnswers * 100).toFixed(2))

    res.json({ nps, detractor, promoters, passive, totalAnswers })
  }
}

export { NpsController }