const express = require('express')
const categoryRoute = require('./category.route')

const router = express.Router()

router.get('/status', (req, res) => {
    res.status(200).json({data:{}, meta:{message: "pico is live", flag: "SUCCESS", statusCode: 200}})
})

router.use('/category', categoryRoute)

module.exports = router