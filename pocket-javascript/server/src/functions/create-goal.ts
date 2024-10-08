import { db } from '../db'
import { goals } from '../db/schema'

interface CreateGoalRequest {
  title: string
  desiredWeeklyFrequency: number
}

export default async function createGoal(request: CreateGoalRequest) {
  const result = await db
    .insert(goals)
    .values({
      title: request.title,
      desiredWeeklyFrequency: request.desiredWeeklyFrequency,
    })
    .returning()

  const goal = result[0]

  return { goal }
}
