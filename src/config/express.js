const express = require('express')
const cors = require('cors')
const routes = require('../api/routes/index')
const morgan = require('morgan')
const {logs} = require('./vars')

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(cors())

app.use(morgan(logs))

app.use('/api', routes)

module.exports = app