// Bring in package
const mysql = require('mysql2')

// Create connection to MySQL
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0
})

console.log('Connected to MySQL')

// retrieve determined weather data from MySQL
// it includes time stamp in second since epoch, temperature, humidity, wind speed and UV index
const getWeatherByTimeRange = ({ start, end = 0 }) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT time, temperature, humidity, windSpeed, uvIndex FROM local_weather WHERE time >= ${start}`
        if (end > 0) {
            sql += ` AND time <= ${end}`
        }
        pool.query(sql, (err, rows) => {
            if (err) {
                reject(`${err}`)
            }

            resolve(rows)
        })
    })
}

// disconnect from MySQL
const mysqlExit = () => {
    pool.end((err) => {
        if (err) console.log(`Exit MySQL with error: ${err}`)
        else console.log('Exit MySQL')
    })
}

module.exports = getWeatherByTimeRange