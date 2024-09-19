import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import createCompletionRoute from './routes/create-completion'
import getWeekPendingGoalsRoute from './routes/get-week-pending-goals'
import createGoalRoute from './routes/create-goal'
import getSummaryRoute from './routes/get-summary'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createCompletionRoute)
app.register(createGoalRoute)
app.register(getSummaryRoute)
app.register(getWeekPendingGoalsRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running!')
  })
