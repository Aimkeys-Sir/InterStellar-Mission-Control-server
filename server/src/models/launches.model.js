const axios = require('axios')

const planets = require('./planets.mongo')
const launchesDatabase = require('./launches.mongo')

const launches = new Map()


const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

async function getLaunchFromDb(launch) {
    return await launchesDatabase.findOne(launch)
}

async function getFromSpaceX() {
    const res = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                }
            ]
        }
    })
    if (res.statusText === "OK") {
        const launchDocs = res.data.docs

        for (const launchDoc of launchDocs) {
            const launch = {
                mission_id: await setMissionId(launchDoc["date_utc"], launchDoc["flight_number"]),
                launch_date: launchDoc["date_utc"],
                mission_name: launchDoc["name"],
                success: launchDoc["success"],
                upcoming: launchDoc["upcoming"],
                space_craft: launchDoc["rocket"]["name"]
            }
            upsertLaunches(launch)
        }
        console.log("SpaceX data loaded successfully")
    }else{
        console.error(`Error downloading spaceX data`)
        throw new Error("Downloading data from spaceX failed.")
    }


}

async function loadLaunchesData() {
    const firstLaunch = await getLaunchFromDb({ mission_id: 2006001, mission_name: "FalconSat" })
    if (firstLaunch) {
        console.log("SpaceX launches data already loaded!")
        return
    } else {
        getFromSpaceX()
    }
}

async function upsertLaunches(launch) {
    await launchesDatabase.updateOne({
        mission_id: launch.mission_id,
        mission_name: launch.mission_name
    },
        launch,
        { upsert: true }
    )
}

async function getLaunches(skip,limit) {
    return await launchesDatabase
    .find({upcoming: true}, '-_id -__v')
    .sort({mission_id: 'desc'})
    .skip(skip)
    .limit(limit)
}

async function postLaunch(mission) {
    let ETA = await calculateETA(mission)
    let launch = {
        ...mission,
        mission_id: await setMissionId(mission.launch_date),
        success: true,
        upcoming: true,
        launch_date: new Date(mission.launch_date).toDateString(),
        ETA
    }
    const planet = await planets.findOne({
        pl_name: launch.destination
    })

    if (!planet) {
        throw new Error("That planet, I don't know about!")
    }

    upsertLaunches(launch)
    return launch
}

async function setMissionId(launch_date, flight_number = null) {
    let size = flight_number || (await launchesDatabase.find({})).length + 1
    size = String(size)
    size = "0".repeat(3 - size.length) + size
    return Number(new Date(launch_date).getFullYear() + size)
}

async function calculateETA(mission) {
    let dist = Number((await planets.find({ pl_name: mission.destination })))['sy_dist'] || 10


    const time = dist * 365.25 * 24 * 60 * 60 * 1000

    return new Date(Date.parse(mission.launch_date) + time).toDateString()
}

async function arbortLaunch(mission_id) {
    await launchesDatabase.updateOne({ mission_id }, { upcoming: false, success: false })
    return await launchesDatabase.findOne({ mission_id })
}

async function getHistory(skip,limit){
    return await launchesDatabase
    .find({upcoming:false},'-__v -_id')
    .sort({'mission_id': "desc"})
    .skip(skip)
    .limit(limit)
}

module.exports = {
    loadLaunchesData,
    getLaunches,
    postLaunch,
    arbortLaunch,
    getHistory
}