const express = require('express')

const {
    httpGetLaunches,
    httpPostLaunches,
    httpAbortLaunch,
    httpGetHistory } = require("./launches.controller")

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetLaunches)
launchesRouter.post('/', httpPostLaunches)
launchesRouter.patch('/', httpAbortLaunch)
launchesRouter.get('/history', httpGetHistory)

module.exports = launchesRouter
