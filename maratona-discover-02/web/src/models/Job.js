const Database = require("../database")
const JobMapper = require('../mappers/JobMapper')

module.exports = {
  async get() {
    const db = await Database()
    const jobs = await db.all("SELECT * FROM jobs")
    db.close()

    return jobs.map(JobMapper.fromDatabase)
  },
  async update(job) {
    const db = await Database()
    await db.exec(`UPDATE profile 
      SET
        name = "${job.name}",
        daily_hours = "${profile["daily-hours"]}",
        total_hours = ${profile["total-hours"]},
      WHERE id = ${job.id}
    `)
    await db.close()
  },
  async create(job) {
    const db = await Database()
    await db.exec(`INSERT INTO jobs (name, daily_hours, total_hours, createdAt)
    VALUES ("${job.name}", ${job["daily-hours"]}, ${job["total-hours"]}, ${Date.now()})`)
    await db.close()
  },

  async getById(jobId) {
    const db = await Database()
    const job = await db.get(`SELECT * FROM jobs WHERE id = ${jobId}`)
    await db.close()

    return job ? JobMapper.fromDatabase(job) : job
  },
  async deleteById(jobId) {
    const db = await Database()
    await db.exec(`DELETE FROM jobs WHERE id = ${jobId}`);
    await db.close()
  }
}