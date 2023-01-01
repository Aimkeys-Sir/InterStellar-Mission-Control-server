const planets = require('./planets.mongo')
const launchesDatabase = require('./launches.mongo')

const launches = new Map()

const launch = {
    mission_id: 2022001,
    launch_date: new Date(2024, 1, 24).toDateString(),
    ETA: new Date(2027, 3, 4).toDateString(),
    success: true,
    mission_name: "Zoe one",
    space_craft: "Falcon-9",
    destination: "Kepler-442 b",
    upcoming: true,
}

// launches.set(launch.mission_id, launch)
upsertLaunches(launch)

async function upsertLaunches(launch) {

    const planet = await planets.findOne({
        pl_name: launch.destination
    })

    if (!planet) {
        throw new Error("That planet, I don't know about!")
    }

    await launchesDatabase.updateOne({
        mission_id: launch.mission_id,
        mission_name: launch.mission_name
    },
        launch,
        { upsert: true }
    )
}

async function getLaunches() {
    return await launchesDatabase.find({}, '-_id -__v')
}

function postLaunch(mission) {
    let ETA = calculateETA(planets.find(mission["destination"], mission["launch_date"]))
    let launch = {
        ...mission,
        mission_id: setMissionId(mission.launch_date),
        created_at: new Date().toDateString(),
        arrival: "Future",
        upcoming: true,
        launch_date: new Date(mission.launch_date).toDateString(),
        ETA
    }

    upsertLaunches(launch)
    return launch
}

async function setMissionId(launch_date) {
    let size = String((await launchesDatabase.find({})).length + 1)
    size = "0".repeat(3 - size.length) + size
    return Number(new Date(launch_date).getFullYear() + size)
}

async function calculateETA(destination, launchDate) {
    let dist = Number((await planets.find({ pl_name: destination })))['sy_dist'] || 10

    const time = dist * 365.25 * 24 * 60 * 60 * 1000

    return new Date(Date.parse(launchDate) + time).toDateString()
}

module.exports = {
    getLaunches,
    postLaunch
}