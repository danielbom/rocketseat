import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import getWeekPendingGoals from '../../functions/get-week-pending-goals'

const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/pending-goals', async (req, res) => {
    const result = await getWeekPendingGoals()
    res.send(result)
  })
}

export default getWeekPendingGoalsRoute
