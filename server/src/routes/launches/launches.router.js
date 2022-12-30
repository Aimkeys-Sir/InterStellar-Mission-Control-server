const express = require('express')

const {httpGetLaunches, httpPostLaunches} = require("./launches.controller")

const launchesRouter = express.Router()

launchesRouter.get('/',httpGetLaunches)
launchesRouter.post('/',httpPostLaunches)

module.exports= launchesRouter
