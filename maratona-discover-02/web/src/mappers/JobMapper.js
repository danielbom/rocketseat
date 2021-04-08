const Profile = require('../models/Profile')
const JobUtils = require('../utils/JobUtils')

module.exports = {
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
