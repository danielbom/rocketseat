const express = require("express")
const routes = express.Router()

const ProfileController = require('./controllers/ProfileController')
const JobController = require('./controllers/JobController')

routes.get("/", JobController.index)
routes.get("/job", JobController.create)
routes.post("/job", JobController.store)
routes.get("/job/:id", JobController.edit)
routes.post("/job/:id", JobController.update)
routes.post("/job/delete/:id", JobController.delete)

routes.get("/profile", ProfileController.show)
routes.post("/profile", ProfileController.update)

module.exports = routes