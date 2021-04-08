const express = require("express")
const routes = express.Router()
const path = require("path")

const view = (name) => path.resolve(__dirname, "views", name)

const Profile = {
  data: {
    name: "Daniel",
    avatar: "https://github.com/danielbom.png",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 30
  },
  controllers: {
    show(_req, res) {
      res.render(view("profile.ejs"), { profile: Profile.data })
    },
    update(req, res) {
      const data = req.body

      const weeksPerYear = 52
      const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

      const weekTotalHours = data["hours-per-day"] * data["days-per-week"]
      const monthlyTotalHours = weekTotalHours * weeksPerMonth

      const valueHour = data["monthly-budget"] / monthlyTotalHours

      Profile.data = {
        ...Profile.data,
        ...data,
        "value-hour": valueHour
      }

      res.redirect('/profile')
    }
  }
}

const Job = {
  data: [
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
  ],
  controllers: {
    create(_req, res) {
      res.render(view("job.ejs"))
    },
    index(_req, res) {
      res.render(view("index.ejs"), { jobs: Job.view.get() })
    },
    store(req, res) {
      // Body { name: string, "daily-hours": number, "total-hours": number }
      const lastId = Job.data[Job.data.length - 1]?.id || 0
      const newId = lastId + 1
      const dailyHours = Number(req.body["daily-hours"])
      const totalHours = Number(req.body["total-hours"])
      const createdAt = Date.now()

      Job.data.push({
        id: newId,
        name: req.body.name,
        "daily-hours": dailyHours,
        "total-hours": totalHours,
        createdAt
      })

      res.redirect("/")
    },
    edit(req, res) {
      const jobId = Number(req.params.id)
      const job = Job.data.find(x => x.id === jobId)

      if (job) {
        res.render(view("job-edit.ejs"), { job: Job.view.one(job) })
      } else {
        res.send('Job not found!')
      }
    },
    update(req, res) {
      const jobId = Number(req.params.id)
      const index = Job.data.findIndex(x => x.id === jobId)
      if (index >= 0) {
        Job.data = Job.data.map((job, i) => {
          if (i === index) return { ...job, ...req.body }
          return job
        })
        res.redirect('/job/' + req.params.id)
      } else {
        res.send('Job not found!')
      }
    },
    delete(req, res) {
      const jobId = Number(req.params.id)

      const index = Job.data.findIndex(x => x.id === jobId)
      if (index >= 0) {
        Job.data = Job.data.filter((_job, i) => i !== index)
        res.redirect('/')
      } else {
        res.send('Job not found!')
      }
    }
  },
  view: {
    one(job) {
      const deadline = Job.services.jobDeadline(job)
      const status = deadline <= 0 ? 'done' : 'progress'
      const budget = Profile.data["value-hour"] * job["total-hours"]

      return {
        ...job,
        deadline,
        status,
        budget
      }
    },
    get() {
      return Job.data.map(Job.view.one)
    }
  },
  services: {
    jobDeadline(job) {
      const remainingDays = Math.round(job["total-hours"] / job["daily-hours"])

      const createdDate = new Date(job.createdAt)
      const dueDay = createdDate.getDate() + remainingDays
      const dueDateInMs = createdDate.setDate(dueDay)

      const timeDiffInMs = dueDateInMs - Date.now()
      const dayInMs = 1000 * 60 * 60 * 24
      const dayDiff = Math.floor(timeDiffInMs / dayInMs)

      return dayDiff
    }
  }
}

routes.get("/", Job.controllers.index)
routes.get("/job", Job.controllers.create)
routes.post("/job", Job.controllers.store)
routes.get("/job/:id", Job.controllers.edit)
routes.post("/job/:id", Job.controllers.update)
routes.post("/job/delete/:id", Job.controllers.delete)

routes.get("/profile", Profile.controllers.show)
routes.post("/profile", Profile.controllers.update)

module.exports = routes