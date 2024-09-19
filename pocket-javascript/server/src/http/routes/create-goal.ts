import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import createGoal from '../../functions/create-goal'

const createGoalRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
        }),
      },
    },
    async (req, res) => {
      const result = await createGoal({
        title: req.body.title,
        desiredWeeklyFrequency: req.body.desiredWeeklyFrequency,
      })
      res.status(201).send(result)
    }
  )
}

export default createGoalRoute
