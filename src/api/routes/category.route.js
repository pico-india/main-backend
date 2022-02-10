const express = require('express')
const controller = require('../controllers/category.controller')
const catchAsync = require('../utils/catchAsync')
const validation = require('../validations/category.validation')

const router = express.Router()

router.post('/',validation.newCategory, catchAsync(controller.new))
router.get('/', controller.all)

module.exports = router