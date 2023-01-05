const mongoose = require('mongoose')

const launchesSchema = new mongoose.Schema({
    mission_id:{
        type: Number,
        required: true
    },
    launch_date:{
        type: Date,
        required: true
    },
    ETA:{
        type: Date,
    },
    success:{
        type: Boolean,
        required: true,
        default: true
    },
    mission_name:{
        type: String,
        required: true
    },
    space_craft:{
        type: String,
        required: true
    },
    destination:{
        type: String,
    },
    upcoming:{
        type: Boolean,
        required: true
    },
})

module.exports = mongoose.model("Launch",launchesSchema)