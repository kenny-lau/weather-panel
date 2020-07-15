const path = require('path')
const express = require('express')
const weatherRouter = require('./routers/weather')
const staticRouter = require('./routers/static')

const app = express()

// set views location
const viewsPath = path.join(__dirname, '../templates/views')
app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.json())
app.use(weatherRouter)
app.use(staticRouter)   // must be the end for catch all page, 404

module.exports = app