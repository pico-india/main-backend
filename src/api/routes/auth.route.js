const express = require('express')
const controller = require('../controllers/auth.controller')
const catchAsync = require('../utils/catchAsync')
const validation = require('../validations/auth.validation')

const router = express.Router()

router.post('/',validation.loginUser, catchAsync(controller.login))

module.exports = router