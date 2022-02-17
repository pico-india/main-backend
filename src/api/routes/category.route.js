const express = require('express')
const controller = require('../controllers/category.controller')
const catchAsync = require('../utils/catchAsync')
const validation = require('../validations/category.validation')

const router = express.Router()

router.post('/',validation.newCategory, catchAsync(controller.new))
router.get('/', controller.all)
router.patch('/:id', validation.updateCategory, catchAsync(controller.update))
router.delete('/:id', catchAsync(controller.delete))

module.exports = router