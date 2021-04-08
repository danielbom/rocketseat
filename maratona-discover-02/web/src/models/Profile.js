let data = {
  name: "Daniel",
  avatar: "https://github.com/danielbom.png",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
  "value-hour": 30
}

module.exports = {
  get() { return data },
  update(value) { data = value }
}
