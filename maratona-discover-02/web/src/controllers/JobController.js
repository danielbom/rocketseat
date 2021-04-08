const Profile = require('../models/Profile')
const Job = require('../models/Job')
const JobUtils = require('../utils/JobUtils')

const JobView = {
  one(job) {
    const profile = Profile.get()
    const deadline = JobUtils.jobDeadline(job)
    const status = deadline <= 0 ? 'done' : 'progress'
    const budget = profile["value-hour"] * job["total-hours"]

    return {
      ...job,
      deadline,
      status,
      budget
    }
  },
}

module.exports = {
  create(_req, res) {
    res.render("job")
  },
  index(_req, res) {
    res.render("index", { jobs: Job.get().map(JobView.one) })
  },
  store(req, res) {
    // Body { name: string, "daily-hours": number, "total-hours": number }
    const jobs = Job.get()
    const lastId = jobs[jobs.length - 1]?.id || 0
    const newId = lastId + 1
    const dailyHours = Number(req.body["daily-hours"])
    const totalHours = Number(req.body["total-hours"])
    const createdAt = Date.now()

    jobs.push({
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
    const jobs = Job.get()
    const job = jobs.find(x => x.id === jobId)

    if (job) {
      res.render("job-edit", { job: JobView.one(job) })
    } else {
      res.send('Job not found!')
    }
  },
  update(req, res) {
    const jobId = Number(req.params.id)
    const jobs = Job.get()
    const index = jobs.findIndex(x => x.id === jobId)

    if (index >= 0) { 
      Job.update(jobs.map((job, i) => {
        if (i === index) return { ...job, ...req.body }
        return job
      }))

      res.redirect('/job/' + req.params.id)
    } else {
      res.send('Job not found!')
    }
  },
  delete(req, res) {
    const jobId = Number(req.params.id)
    const jobs = Job.get()

    const index = jobs.findIndex(x => x.id === jobId)
    if (index >= 0) {
      Job.update(jobs.filter((_job, i) => i !== index))
      res.redirect('/')
    } else {
      res.send('Job not found!')
    }
  }
}
