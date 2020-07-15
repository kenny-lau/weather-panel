const express = require('express')
const router = new express.Router()
const { mongodbGetData } = require('../utils/mongo')
const getWeatherByTimeRange = require('../utils/mysql')
const Weather = require('../models/weather')

// create weather data record
router.post('/weather', async (req, res) => {
    const weather = new Weather(req.body)

    try {
        await weather.save()
        res.status(201).send({ weather })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// implement mongoose to retrieve data
router.get('/todayweather', async (req, res) => {
    const now = new Date()
    const start = Math.floor(now.getTime() / 1000) - 87300 // 86400(1 day) + 900(15 min)

    try {
        const results = await Weather.find({ time: { $gte: start } })
        sendDataToChart(res, now, results)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete('/retain7days', async (req, res) => {
    const now = new Date()
    const dateString = now.getFullYear() + '.' + (now.getMonth() + 1) + '.' + now.getDate()
    const since = Math.floor(new Date(dateString).getTime() / 1000) - (86400 * 7) // 86400(1 day), 7 days

    try {
        const weather = await Weather.deleteMany({ time: { $lt: since } })
        if (!weather.ok) {
            return res.status(404).send()
        }
        const deletedCount = weather.deletedCount
        res.send({ deletedCount })
    } catch (e) {
        res.status(500).send()
    }
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
router.get('/todaymysql', async (req, res) => {
    const now = new Date()
    const start = Math.floor(now.getTime() / 1000) - 87300 // 86400(1 day) + 900(15 min)

    try {
        const results = await getWeatherByTimeRange({ start })
        sendDataToChart(res, now, results)
    } catch (e) {
        res.status(500).send(e)
    }
})

// end point to obtain data for display from MongoDB
router.get('/today', async (req, res) => {
    const now = new Date()
    const start = Math.floor(now.getTime() / 1000) - 87300 // 86400(1 day) + 900(15 min)

    try {
        const results = await mongodbGetData({ start })
        sendDataToChart(res, now, results)
    } catch (e) {
        res.status(500).send(error)
    }
})

module.exports = router

// render weather panel
// router.get('', (req, res) => {
//     res.render('index', {
//         title: 'Weather Panel',
//         name: author
//     })
// })

// // help page
// router.get('/help', (req, res) => {
//     res.render('help', {
//         helpTitle: 'Project Description',
//         title: 'Weather Panel',
//         name: author
//     })
// })

// // catch all page
// router.get('*', (req, res) => {
//     res.render('404', {
//         title: '404',
//         name: author,
//         errorMessage: 'Page not found.'
//     })
// })