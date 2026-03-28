const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const dns = require('node:dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])
const initDB = require('./database/connection')
const apiRoutes = require('./api/routes')

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

app.use("/api", apiRoutes)

const PORT = process.env.PORT || 8080

// Connect to DB
initDB()

// Local dev
if (process.env.NODE_ENV !== "production") {
    initDB().then(() => {
        app.listen(PORT, () => {
            console.log("Server running on port", PORT)
        })
    })
}

// Vercel serverless
module.exports = app
