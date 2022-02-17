const express = require('express')
const controller = require('../controllers/user.controller')
const catchAsync = require('../utils/catchAsync')
const validation = require('../validations/user.validation')

const router = express.Router()

router.post('/',validation.registerUser, catchAsync(controller.register))
// router.get('/', controller.all)
// router.patch('/:id', validation.updateUser, catchAsync(controller.update))
// router.delete('/:id', catchAsync(controller.delete))

module.exports = router