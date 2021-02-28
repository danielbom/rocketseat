import { Request, Response } from "express"
import * as TypeORM from 'typeorm'
import { UsersRepository } from "../repositories/UsersRepository"
import * as yup from 'yup'
import { AppError } from "../errors/AppError"

const StoreSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required()
})

class UserController {
  async store(req: Request, res: Response) {
    const { name, email } = req.body

    try {
      await StoreSchema.validate(req.body, { abortEarly: false })
    } catch (error) {
      return res.status(400).json({ error })
    }

    const usersRepository = TypeORM.getCustomRepository(UsersRepository)

    const userAlreadyExists = await usersRepository.findOne({ email })

    if (userAlreadyExists) {
      throw new AppError('USER_ALREADY_EXISTS')
    }

    const user = usersRepository.create({ name, email })

    await usersRepository.save(user)

    res.status(201).json(user)
  }
}

export { UserController }
