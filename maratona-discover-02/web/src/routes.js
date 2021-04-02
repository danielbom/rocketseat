const express = require("express")
const routes = express.Router()
const path = require("path")

const view = (name) => path.resolve(__dirname, "views", name)

const profile = {
  name: "Daniel",
  avatar: "https://github.com/danielbom.png",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
  "value-hour": 75
}
const jobs = [
  {
    id: 1,
    name: "Pizzaria Guloso",
    "daily-hours": 2,
    "total-hours": 1,
    createdAt: Date.now()
  },
  {
    id: 2,
    name: "OneTwo Project",
    "daily-hours": 3,
    "total-hours": 47,
    createdAt: Date.now()
  }
]

function jobDeadline(job) {
  const remainingDays = Math.round(job["total-hours"] / job["daily-hours"])

  const createdDate = new Date(job.createdAt)
  const dueDay = createdDate.getDate() + remainingDays
  const dueDateInMs = createdDate.setDate(dueDay)

  const timeDiffInMs = dueDateInMs - Date.now()
  const dayInMs = 1000 * 60 * 60 * 24
  const dayDiff = Math.floor(timeDiffInMs / dayInMs)
  
  return dayDiff
}

const Views = {
  jobs: {
    one(job) {
      const deadline = jobDeadline(job)
      const status = deadline <= 0 ? 'done' : 'progress'
      const budget = profile["value-hour"] * job["total-hours"]

      return {
        ...job,
        deadline,
        status,
        budget
      }
    },
    get() { 
      return jobs.map(Views.jobs.one)
    }
  }
}

routes.get("/", (_req, res) => res.render(view("index.ejs"), { jobs: Views.jobs.get() }))

routes.get("/job", (_req, res) => res.render(view("job.ejs")))
routes.post("/job", (req, res) => {
  // Body { name: string, "daily-hours": number, "total-hours": number }
  const lastId = jobs[jobs.length - 1]?.id || 1
  const dailyHours = Number(req.body["daily-hours"])
  const totalHours = Number(req.body["total-hours"])
  const createdAt = Date.now()
  
  jobs.push({
    id: lastId + 1,
    name: req.body.name,
    "daily-hours": dailyHours,
    "total-hours": totalHours,
    createdAt
  })

  res.redirect("/")
})

routes.get("/job/edit", (_req, res) => res.render(view("job-edit.ejs")))
routes.get("/profile", (_req, res) => res.render(view("profile.ejs"), { profile }))

module.exports = routes