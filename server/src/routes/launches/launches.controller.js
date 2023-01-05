const { getLaunches, postLaunch, arbortLaunch, getHistory } = require('../../models/launches.model')
const getPagination = require('./helpers/query')
const { validate, validateDate } = require('./helpers/validate')


async function httpGetLaunches(req, res) {
    const { skip, limit } = getPagination(req.query)
    const launches = await getLaunches(skip, limit)
    return res.status(200).json(launches)
}
function httpPostLaunches(req, res) {
    const errors = []
    const mission = req.body

    if (validateDate(mission.launch_date)) {
        errors(validateDate(mission.launch_date))
    }

    Object.keys(mission).forEach(key => {
        if (validate(mission, key)) {
            errors.push(validate(mission, key))
        }
    })
    if (errors.length) {
        return res.status(422).json(errors)
    }
    return res.status(201).json(postLaunch(mission))
}

async function httpAbortLaunch(req, res) {
    const launch = await arbortLaunch(req.body.mission_id)
    if (launch) {
        return res.status(204)
    } else {
        return res.status(400).json({ error: "Abort failed!!" })
    }
}

async function httpGetHistory(req, res) {
    const {skip,limit} = getPagination(req.query)
    const history = await getHistory(skip,limit)


    return res.status(200).json(history)
}

module.exports = {
    httpGetLaunches,
    httpPostLaunches,
    httpAbortLaunch,
    httpGetHistory
}