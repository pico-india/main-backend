const express = require('express')
const controller = require('../controllers/category.controller')
const catchAsync = require('../utils/catchAsync')
const validation = require('../validations/category.validation')
const { auth } = require('../middlewares/auth')
const admin = require('../middlewares/admin')

const router = express.Router()

router.post('/', auth, admin, validation.newCategory, catchAsync(controller.new))
router.get('/', controller.all)
router.patch('/:id', auth, admin, validation.updateCategory, catchAsync(controller.update))
router.delete('/:id', auth, admin, catchAsync(controller.delete))

module.exports = router