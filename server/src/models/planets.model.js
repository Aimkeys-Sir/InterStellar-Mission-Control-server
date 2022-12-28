const { parse } = require('csv-parse')
const fs = require('fs')
const path = require('path')

console.log(parse)
const habitablePlanets = []

function isHabitablePlanet(planet) {
    return planet["soltype"] === 'Published Confirmed'
        && planet["pl_insol"] > 0.36
        && planet["pl_insol"] < 1.11
        && planet["pl_rade"] < 1.6
}

function loadPlanetsData() {
    return new Promise((resolve,reject) => {
        
        fs.createReadStream(path.join(__dirname,'..','..','data','exoplanets_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', data => {
                if (isHabitablePlanet(data)) {
                    habitablePlanets.push(data)
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



module.exports = { 
    loadPlanetsData,
    planets: habitablePlanets 
}