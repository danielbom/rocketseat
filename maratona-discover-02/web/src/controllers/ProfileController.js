const Profile = require('../models/Profile')

module.exports = {
  async show(_req, res) {
    const profile = await Profile.get()
    res.render("profile", { profile })
  },
  async update(req, res) {
    const profile = await Profile.get()
    const data = req.body

    const weeksPerYear = 52
    const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

    const weekTotalHours = data["hours-per-day"] * data["days-per-week"]
    const monthlyTotalHours = weekTotalHours * weeksPerMonth

    const valueHour = data["monthly-budget"] / monthlyTotalHours

    await Profile.update({
      ...profile,
      ...data,
      "value-hour": valueHour
    })

    res.redirect('/profile')
  }
}
