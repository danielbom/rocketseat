import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'

export default async function getSummary(): Promise<{ summary: Summary }> {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        createdAt: goalCompletions.createdAt,
        completedAt: sql /*sql*/`
          DATE(${goalCompletions.createdAt})
        `.as('completedAt'),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goalCompletions.goalId, goals.id))
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .orderBy(desc(goalCompletions.createdAt))
  )

  const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
    db
      .select({
        completedAt: goalsCompletedInWeek.completedAt,
        completions: sql /*sql*/`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.createdAt}
            )
          )
        `.as('completions'),
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedAt)
      .orderBy(desc(goalsCompletedInWeek.completedAt))
  )

  const result = await db
    .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed: sql /*sql*/`(
        SELECT SUM(JSON_ARRAY_LENGTH(${goalsCompletedByWeekDay.completions})) FROM ${goalsCompletedByWeekDay}
      )`.mapWith(Number),
      total: sql /*sql*/`(
        SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})
      `.mapWith(Number),
      goalsPerDay: sql<GoalsPerDay> /*sql*/`(
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAt},
          ${goalsCompletedByWeekDay.completions}
        )
      )`,
    })
    .from(goalsCompletedByWeekDay)

  return {
    summary: result[0],
  }
}

type GoalPerDay = {
  id: string
  title: string
  completedAtDate: string
}
type GoalsPerDay = Record<string, GoalPerDay[]>
type Summary = {
  completed: number
  total: number
  goalsPerDay: GoalsPerDay
}
