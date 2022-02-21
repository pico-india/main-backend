const express = require('express')
const categoryRoute = require('./category.route')
const userRoute = require('./user.route')
const authRoute = require('./auth.route')
const imageRoute = require('./image.route')

const router = express.Router()

router.get('/status', (req, res) => {
    res.status(200).json({ data: {}, meta: { message: "Pico is Live", flag: "SUCCESS", statusCode: 200 } })
})

router.use('/category', categoryRoute)
router.use('/user', userRoute)
router.use('/auth', authRoute)
router.use('/image', imageRoute)

module.exports = router