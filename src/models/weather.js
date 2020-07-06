const mongoose = require('mongoose')
require('../db/mongoose')

// Define mongoDB collection and basic schema restriction
const weatherSchema = new mongoose.Schema({
    time: {
        type: Number,
        required: true,
        unique: true
    },
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    pressure: {
        type: Number
    },
    windSpeed: {
        type: Number,
        required: true
    },
    uvIndex: {
        type: Number,
        required: true,
        min: 0
    },
    visibility: {
        type: Number,
        min: 0
    }
}, {
    // enforce collection name
    collection: process.env.MONGODB_COLLECTION
})

const Weather = mongoose.model(process.env.MONGODB_COLLECTION, weatherSchema)

module.exports = Weather