// get element from the html page; index
const countdown = document.getElementById('countdown')

// create chart on chartjs
const newLineChart = ((canvasElement) => {
    return new Chart(canvasElement, {
        type: 'line',
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
})

const liveTemperature = newLineChart(document.getElementById('live-temp-chart'))
const dayTemperature = newLineChart(document.getElementById('day-temp-chart'))
const liveHumidity = newLineChart(document.getElementById('live-humidity-chart'))
const dayHumidity = newLineChart(document.getElementById('day-humidity-chart'))
const liveWindspeed = newLineChart(document.getElementById('live-windspeed-chart'))
const dayWindspeed = newLineChart(document.getElementById('day-windspeed-chart'))
const liveUVIndex = newLineChart(document.getElementById('live-uvindex-chart'))
const dayUVIndex = newLineChart(document.getElementById('day-uvindex-chart'))

// convenience function to update various chart
const updateChart = ((chart, title, xLabels, dataPoints) => {
    chart.data = {
        labels: xLabels,
        datasets: [{
            label: title,
            data: dataPoints,
            backgroundColor: 'rgba(62, 149, 205, 0.3)',
            borderColor: 'rgba(62, 149, 205, 0.3)',
            pointRadius: 1
        }]
    }
    chart.update({ duration: 0 })
})

// obtain data from the server
const getData = (() => {
    fetch('/todayweather').then((response) => {
        response.json().then((data) => {
            const twoHoursTitle = data.twoHoursDate + ' ' + data.twoHoursLabels[0]

            updateChart(liveTemperature, twoHoursTitle, data.twoHoursLabels, data.twoHoursTemperature)
            updateChart(dayTemperature, data.todayDate, data.labels, data.temperature)

            updateChart(liveHumidity, twoHoursTitle, data.twoHoursLabels, data.twoHoursHumidity)
            updateChart(dayHumidity, data.todayDate, data.labels, data.humidity)

            updateChart(liveWindspeed, twoHoursTitle, data.twoHoursLabels, data.twoHoursWindSpeed)
            updateChart(dayWindspeed, data.todayDate, data.labels, data.windSpeed)

            updateChart(liveUVIndex, twoHoursTitle, data.twoHoursLabels, data.twoHoursUVIndex)
            updateChart(dayUVIndex, data.todayDate, data.labels, data.uvIndex)
        })
    })
})

// handle click event on the selection tab
// Unselect all buttons, remove 'active' from class name and add the word 'active'
// to clicked button's class name. stylesheet will take care of the highlight
const tabAction = ((evt, tabName) => {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
})

// create count down timer string
const countdownString = () => `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`

getData()

let min = 15
let sec = 0
countdown.textContent = countdownString()
// update count down timer every second
setInterval(() => {
    if (sec === 0) {
        sec = 59
        min--
    }
    else sec--

    countdown.textContent = countdownString()
    if (min === 0 && sec === 0) {
        min = 15
        sec = 0
        getData()
    }
}, 1000)