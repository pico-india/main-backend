const express = require('express')
const categoryRoute = require('./category.route')
const userRoute = require('./user.route')
const authRoute = require('./auth.route')
const imageRoute = require('./image.route')
const Image = require('../models/image.model')

const router = express.Router()

router.get('/status', (req, res) => {
    res.status(200).json({ data: {}, meta: { message: "Pico is Live", flag: "SUCCESS", statusCode: 200 } })
})

router.get('/search', async (req, res) => {
    const { photos } = req.query
    const keys = ['tags', 'description', 'category.name', 'user.username']
    const search = new RegExp(photos, 'i')
    const result = await Image.find({
        // $or: [{ search },
        // {
        //     tags
        // }]
    })
    res.status(200).json({ data: {}, meta: { message: "Here are your search results", flag: "SUCCESS", statusCode: 200 } })
})

router.use('/category', categoryRoute)
router.use('/user', userRoute)
router.use('/auth', authRoute)
router.use('/image', imageRoute)

module.exports = router