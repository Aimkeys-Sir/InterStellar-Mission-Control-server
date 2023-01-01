const mongoose = require('mongoose')

const planetsSchema = new mongoose.Schema({
    pl_name:{
        type: String,
        required: true
    },
    sy_dist:{
        type: String,
        required: true,
        default: "10"
    },
})

module.exports = mongoose.model("Planet",planetsSchema)