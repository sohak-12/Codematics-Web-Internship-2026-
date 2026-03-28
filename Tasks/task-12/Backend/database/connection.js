const mongoose = require("mongoose")
const dns = require('node:dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])

async function initDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB")
    }catch(err){
        console.log("MongoDB connection error:", err)
    }
}

module.exports = initDB
