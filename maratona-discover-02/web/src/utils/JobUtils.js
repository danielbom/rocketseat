
module.exports = {
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
