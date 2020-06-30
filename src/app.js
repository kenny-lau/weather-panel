const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { mongodbGetData } = require('./utils/mongo')
const getWeatherByTimeRange = require('./utils/mysql')

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const port = process.env.SERVER_PORT
const author = process.env.AUTHOR

const app = express()
// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// set handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// render weather panel
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather Panel',
        name: author
    })
})

// help page
app.get('/help', (req, res) => {
    res.render('help', {
        helpTitle: 'Project Description',
        title: 'Weather Panel',
        name: author
    })
})

// send data to chartjs, data could come from MySQL, mongoDB or any other DB
const sendDataToChart = (res, time, results) => {
    const dateString = time.getFullYear() + '.' + (time.getMonth() + 1) + '.' + time.getDate()
    const todayStart = Math.floor(new Date(dateString).getTime() / 1000)
    const twoHoursAgo = (Math.floor(time.getTime() / 1000)) - 8100

    const labels = [], temperature = [], humidity = [], windSpeed = [], uvIndex = []
    const twoHoursLabels = [], twoHoursTemperature = [], twoHoursHumidity = [], twoHoursWindSpeed = [], twoHoursUVIndex = []
    const todayDate = time.toDateString()
    const twoHoursDate = new Date(twoHoursAgo * 1000).toDateString()

    results.forEach(entry => {
        let timeLabel = new Date(entry.time * 1000).toTimeString().substr(0, 5)
        if (entry.time >= twoHoursAgo) {
            twoHoursLabels.push(timeLabel)
            twoHoursTemperature.push(entry.temperature)
            twoHoursHumidity.push(entry.humidity * 100)
            twoHoursWindSpeed.push(entry.windSpeed)
            twoHoursUVIndex.push(entry.uvIndex)
        }
        if (entry.time >= todayStart) {
            labels.push(timeLabel)
            temperature.push(entry.temperature)
            humidity.push(entry.humidity * 100)
            windSpeed.push(entry.windSpeed)
            uvIndex.push(entry.uvIndex)
        }
    })

    res.send({
        todayDate,
        twoHoursDate,
        labels, temperature, humidity, windSpeed, uvIndex,
        twoHoursLabels, twoHoursTemperature, twoHoursHumidity, twoHoursWindSpeed, twoHoursUVIndex
    })
}

// end point to obtain data for display from MySQL
app.get('/todaymysql', (req, res) => {
    const now = new Date()
    const start = Math.floor(now.getTime() / 1000) - 87300 // 86400(1 day) + 900(15 min)

    getWeatherByTimeRange({ start }).then((results) => {
        sendDataToChart(res, now, results)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// end point to obtain data for display from MongoDB
app.get('/today', (req, res) => {
    const now = new Date()
    const start = Math.floor(now.getTime() / 1000) - 87300 // 86400(1 day) + 900(15 min)

    mongodbGetData({ start }).then((results) => {
        sendDataToChart(res, now, results)
    }).catch((error) => {
        res.status(500).send(error)
    })
})

// catch all page
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: author,
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => (
    console.log('Server is up on port: ' + port)
))