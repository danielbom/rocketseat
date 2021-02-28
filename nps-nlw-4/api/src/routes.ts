import { Router } from 'express'
import { AnswerController } from './controllers/AnswerController'
import { NpsController } from './controllers/NpsController'
import { SendMailController } from './controllers/SendMailController'
import { SurveyController } from './controllers/SurveyController'
import { UserController } from './controllers/UserController'

const router = Router()

const userController = new UserController()
const surveyController = new SurveyController()
const sendMailController = new SendMailController()
const answersController = new AnswerController()
const npsController = new NpsController();

router.post('/users', userController.store)

router.get('/surveys', surveyController.index)
router.post('/surveys', surveyController.store)

router.post('/send-mail', sendMailController.execute)

router.get('/answers/:value', answersController.execute)

router.get('/nps/:survey_id', npsController.execute)

export { router }
