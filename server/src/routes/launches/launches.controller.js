const {getLaunches,postLaunch} = require('../../models/launches.model')
const {validate,validateDate} = require('./helpers/validate')

async function httpGetLaunches(req,res){
    return res.status(200).json(await getLaunches())
}
function httpPostLaunches(req,res){
    const errors = []
    const mission = req.body

    if(validateDate(mission.launch_date)){
        errors(validateDate(mission.launch_date))
    }

    Object.keys(mission).forEach(key=>{
        if(validate(mission,key)){
            errors.push(validate(mission,key))
        }
    })
    if(errors.length){
        return res.status(422).json(errors)
    }
    return res.status(201).json(postLaunch(mission))
}

module.exports = {
    httpGetLaunches,
    httpPostLaunches
}