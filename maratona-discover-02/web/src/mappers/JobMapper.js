const JobUtils = require('../utils/JobUtils')

module.exports = {
  one: ({ profile }) => job => {
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
  fromDatabase(job) {
    return {
      id: job.id,
      name: job.name,
      "daily-hours": job.daily_hours,
      "total-hours": job.total_hours,
      createdAt: job.createdAt
    }
  }
}
