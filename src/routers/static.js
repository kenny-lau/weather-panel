const express = require('express')
const router = new express.Router()
const path = require('path')
const hbs = require('hbs')

const publicDirectoryPath = path.join(__dirname, '../../public')
const partialsPath = path.join(__dirname, '../../templates/partials')
const author = process.env.AUTHOR

// Setup static directory to serve
router.use(express.static(publicDirectoryPath));

// set handlebars engine
hbs.registerPartials(partialsPath)

// render weather panel
router.get('', (req, res) => {
    res.render('index', {
        title: 'Weather Panel',
        name: author
    })
})

// help page
router.get('/help', (req, res) => {
    res.render('help', {
        helpTitle: 'Project Description',
        title: 'Weather Panel',
        name: author
    })
})

// catch all page
router.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: author,
        errorMessage: 'Page not found.'
    })
})

module.exports = router