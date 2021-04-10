const Job = require('../models/Job')
const Profile = require('../models/Profile')
const JobMapper = require('../mappers/JobMapper')

module.exports = {
  async index(_req, res) {
    const profile = await Profile.get()
    let jobs = await Job.get()
    jobs = jobs.map(JobMapper.one({ profile }))

    const status = {
      progress: 0,
      done: 0,
      total: jobs.length
    }
    let freeHours = profile["hours-per-day"]

    for (const job of jobs) {
      status[job.status]++;

      if (job.status == 'progress') {
        freeHours -= job["daily-hours"]
      }
    }

    res.render("index", {
      profile,
      jobs,
      status,
      freeHours
    })
  },
}