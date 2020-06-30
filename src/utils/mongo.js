const { MongoClient, ObjectID } = require('mongodb')

// setup MongoDB parameters
const connectionURL = process.env.MONGODB_URL
const databaseName = process.env.MONGODB_DATABASE
const collectionName = process.env.MONGODB_COLLECTION

// Create connection for the duration of the connection. By default, MongoDB maintains 5 connection pool
const client = new MongoClient(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true })
const connection = client.connect()

console.log('Connected to MongoDB')

// Retrieve today data
const mongodbGetData = ({ start, end = 0 }) => {
    return new Promise((resolve, reject) => {
        const condition = []
        condition.push({ time: { $gte: start } })
        if (end) condition.push({ time: { $lte: end } })

        // Get the connection
        const connect = connection
        connect.then(() => {
            const db = client.db(databaseName)
            db.collection(collectionName).find(
                { $and: condition }, { projection: { _id: 0, pressure: 0, visibility: 0 } }
            ).toArray((err, docs) => {
                if (err) {  // return error message
                    reject(`Retrieve MongoDB data error: ${err}`)
                }
                resolve(docs)
            })
        })
    })
}

// close connection to exit mongodb
const mongodbExit = (() => {
    client.close()
    console.log('Exit MongoDB')
})

module.exports = {
    mongodbExit,
    mongodbGetData
}