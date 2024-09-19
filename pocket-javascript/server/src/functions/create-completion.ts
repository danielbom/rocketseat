import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'

interface CreateCompletionRequest {
  goalId: string
}

export default async function createCompletion(
  request: CreateCompletionRequest
) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  // check if the count of completions is less then the amount of the frequency per week in this week
  const goalsCompletionCounts = db.$with('goals_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, request.goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const maybeCompletionCount = await db
    .with(goalsCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
          COALESCE(${goalsCompletionCounts.completionCount}, 0)
        `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalsCompletionCounts, eq(goalsCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, request.goalId))

  if (maybeCompletionCount.length === 0) {
    throw new Error('Goal not found')
  }

  if (maybeCompletionCount.length === 1) {
    const [completionCount] = maybeCompletionCount
    if (
      completionCount.completionCount >= completionCount.desiredWeeklyFrequency
    ) {
      throw new Error('Goal already completed this week')
    }
  }

  if (maybeCompletionCount.length > 1) {
    throw new Error('Unreachable')
  }

  // insert
  const result = await db.insert(goalCompletions).values(request).returning()

  const completion = result[0]

  return { completion }
}
