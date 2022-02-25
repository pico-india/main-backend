const express = require('express')
const controller = require('../controllers/user.controller')
const catchAsync = require('../utils/catchAsync')
const validation = require('../validations/user.validation')
const { auth, isAuthorOrAdminUser } = require('../middlewares/auth')

const router = express.Router()

router.post('/', validation.registerUser, catchAsync(controller.register))
router.get('/', controller.all)
router.get('/:username', catchAsync(controller.profile))
router.get('/:id/confirmation_token/:confirmationToken', catchAsync(controller.verifyEmail))
router.patch('/:id', auth, isAuthorOrAdminUser, validation.updateUser, catchAsync(controller.update))
router.delete('/:id', auth, isAuthorOrAdminUser, catchAsync(controller.delete))

module.exports = router