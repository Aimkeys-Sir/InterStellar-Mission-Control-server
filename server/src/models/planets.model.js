const { parse } = require('csv-parse')
const fs = require('fs')
const path = require('path')

const planets = require('./planets.mongo')



function isHabitablePlanet(planet) {
    return planet["soltype"] === 'Published Confirmed'
        && planet["pl_insol"] > 0.36
        && planet["pl_insol"] < 1.11
        && planet["pl_rade"] < 1.6
}

const loadPlanetsData = () => {
    return new Promise((resolve, reject) => {

        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'exoplanets_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', data => {
                if (isHabitablePlanet(data)) {
                    upsertPlanets(data)
                }
            })
            .on('error', err => {
                reject(err)
            })
            .on('end', () => {
                resolve()
            })
    })
}

async function getAllPlanets() {
    return await planets.find({},'-_id -__v')
}
async function upsertPlanets(planet) {
  try{ 
     await planets.updateOne(
        {
            pl_name: planet.pl_name
        },
        {
            pl_name: planet.pl_name,
            sy_dist: planet.sy_dist
        },
        { 
            upsert: true 
        }
    )}catch(err){
        console.error(`Planet could not be inserted/updated. ${err}`);
    }
}


module.exports = {
    loadPlanetsData,
    getAllPlanets
}