const Job = require('../models/Job')
const Profile = require('../models/Profile')
const JobMapper = require('../mappers/JobMapper')

module.exports = {
  create(_req, res) {
    res.render("job")
  },
  async store(req, res) {
    // Body { name: string, "daily-hours": number, "total-hours": number }
    await Job.create({
      name: req.body.name,
      "daily-hours": Number(req.body["daily-hours"]),
      "total-hours": Number(req.body["total-hours"]),
      createdAt: Date.now()
    })

    res.redirect("/")
  },
  async edit(req, res) {
    const jobId = Number(req.params.id)
    const jobs = await Job.get()
    const job = jobs.find(x => x.id === jobId)

    if (job) {
      const profile = await Profile.get()
      res.render("job-edit", { job: JobMapper.one({ profile })(job) })
    } else {
      res.send('Job not found!')
    }
  },
  async update(req, res) {
    const jobId = Number(req.params.id)
    const job = await Job.getById(jobId)

    if (job) {
      Job.updateById({
        id: jobId,
        name: req.body.name ?? job.name,
        "daily-hours": req.body["daily-hours"] ? Number(req.body["daily-hours"]) : job["daily-hours"],
        "total-hours": req.body["total-hours"] ? Number(req.body["total-hours"]) : job["total-hours"],
      })

      res.redirect('/job/' + req.params.id)
    } else {
      res.send('Job not found!')
    }
  },
  async delete(req, res) {
    const jobId = Number(req.params.id)
    const job = await Job.getById(jobId)

    if (job) {
      await Job.deleteById(jobId)
      res.redirect('/')
    } else {
      res.send('Job not found!')
    }
  }
}
