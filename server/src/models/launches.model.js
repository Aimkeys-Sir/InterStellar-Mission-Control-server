const { planets} = require('./planets.model')

const launches = new Map()

const launch = {
    mission_id: 2022001,
    launch_date: new Date(2024, 1, 24).toDateString(),
    ETA: new Date(2027, 3, 4).toDateString(),
    arrival: "Future",
    mission_name: "Zoe one",
    space_craft: "Falcon-9",
    destination: "Kepler-442 b",
    upcoming: true,
    created_at: new Date().toDateString()
}

launches.set(launch.mission_id, launch)


function getLaunches() {
    return Array.from(launches.values())
}

function postLaunch(mission) {

   
  
    let ETA = calculateETA(planets.find(planet => planet.pl_name === mission["destination"]), mission["launch_date"])
    let launch = {
        ...mission,
        mission_id: setMissionId(mission.launch_date),
        created_at: new Date().toDateString(),
        arrival: "Future",
        upcoming: true,
        launch_date: new Date(mission.launch_date).toDateString(),
        ETA
    }

    launches.set(launch.mission_id, launch)
    return launch
}

function setMissionId(launch_date) {
    let size = String(launches.size + 1)
    size = "0".repeat(3 - size.length) + size
    return Number(new Date(launch_date).getFullYear() + size)
}

function calculateETA(planet, launchDate) {
    let dist = Number(planet['sy_dist']) || 10

    const time = dist * 365.25 * 24 * 60 * 60 * 1000

    return new Date(Date.parse(launchDate) + time).toDateString()
}

module.exports = {
    getLaunches,
    postLaunch
}