import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import getSummary from '../../functions/get-summary'

const getSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/summary', async (req, res) => {
    const result = await getSummary()
    res.send(result)
  })
}

export default getSummaryRoute
