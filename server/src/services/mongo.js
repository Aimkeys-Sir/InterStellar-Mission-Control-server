const mongoose = require('mongoose')

const MONGO_URL = "mongodb+srv://aimkeys:mwaura45@cluster0.ket5fco.mongodb.net/imc?retryWrites=true&w=majority"

mongoose.connection.once("open",()=>{
    console.log("Database connected successifully!!")
})

mongoose.connection.on("error", (err)=>{
    console.error(err)
})

mongoose.set('strictQuery', false);

async function mongoConnect(){
    await mongoose.connect(MONGO_URL,{})
}

async function mongoDisconnect(){
    await mongoose.disconnect()
}

module.exports = {mongoConnect,mongoDisconnect}