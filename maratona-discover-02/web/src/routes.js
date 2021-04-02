const express = require('express')
const routes = express.Router()
const path = require('path')

const view = (name) => path.resolve(__dirname, 'views', name);

const profile = {
  name: 'Daniel',
  avatar: 'https://github.com/danielbom.png',
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4
}

routes.get('/', (_req, res) => res.render(view('index.ejs')))
routes.get('/job', (_req, res) => res.render(view('job.ejs')))
routes.get('/job/edit', (_req, res) => res.render(view('job-edit.ejs')))
routes.get('/profile', (_req, res) => res.render(view('profile.ejs'), { profile }))

module.exports = routes