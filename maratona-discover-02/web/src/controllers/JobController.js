const Job = require('../models/Job')
const JobMapper = require('../mappers/JobMapper')

module.exports = {
  create(_req, res) {
    res.render("job")
  },
  store(req, res) {
    // Body { name: string, "daily-hours": number, "total-hours": number }
    Job.create({
      name: req.body.name,
      "daily-hours": Number(req.body["daily-hours"]),
      "total-hours": Number(req.body["total-hours"]),
      createdAt: Date.now()
    })

    res.redirect("/")
  },
  edit(req, res) {
    const jobId = Number(req.params.id)
    const jobs = Job.get()
    const job = jobs.find(x => x.id === jobId)

    if (job) {
      res.render("job-edit", { job: JobMapper.one(job) })
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
