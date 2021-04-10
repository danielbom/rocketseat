const Database = require("../database")

module.exports = {
  async get() {
    const db = await Database()
    const profile = await db.get("SELECT * FROM profile")
    await db.close()

    return {
      id: profile.id,
      name: profile.name,
      avatar: profile.avatar,
      "monthly-budget": profile.monthly_budget,
      "days-per-week": profile.days_per_week,
      "hours-per-day": profile.hours_per_day,
      "vacation-per-year": profile.vacation_per_year,
      "value-hour": profile.value_hour
    }
  },
  async update(profile) {
    const db = await Database()
    await db.exec(`UPDATE profile SET
      name = "${profile.name}",
      avatar = "${profile.avatar}",
      monthly_budget = ${profile["monthly-budget"]},
      days_per_week = ${profile["days-per-week"]},
      hours_per_day = ${profile["hours-per-day"]},
      vacation_per_year = ${profile["vacation-per-year"]},
      value_hour = ${profile["value-hour"]}
    `)
    await db.close()
  }
}
