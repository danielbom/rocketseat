import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import createCompletion from '../../functions/create-completion'

const createCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async (req, res) => {
      const result = await createCompletion({
        goalId: req.body.goalId,
      })
      res.status(201).send(result)
    }
  )
}

export default createCompletionRoute
