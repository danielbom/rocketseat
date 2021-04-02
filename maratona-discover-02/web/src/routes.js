const express = require('express')
const routes = express.Router()
const path = require('path')

const view = (name) => path.resolve(__dirname, 'view', name);

routes.get('/', (_req, res) => res.sendFile(view('index.html')))
routes.get('/job', (_req, res) => res.sendFile(view('/job.html')))
routes.get('/job/edit', (_req, res) => res.sendFile(view('/job-edit.html')))
routes.get('/profile', (_req, res) => res.sendFile(view('/profile.html')))

module.exports = routes