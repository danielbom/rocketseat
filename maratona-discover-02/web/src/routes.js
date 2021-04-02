const express = require('express')
const routes = express.Router()
const path = require('path')

const view = (name) => path.resolve(__dirname, 'view', name);

routes.get('/', (_req, res) => res.render(view('index.ejs')))
routes.get('/job', (_req, res) => res.render(view('job.ejs')))
routes.get('/job/edit', (_req, res) => res.render(view('job-edit.ejs')))
routes.get('/profile', (_req, res) => res.render(view('profile.ejs')))

module.exports = routes