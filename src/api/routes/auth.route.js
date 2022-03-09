const express = require('express')
const controller = require('../controllers/auth.controller')
const catchAsync = require('../utils/catchAsync')
const validation = require('../validations/auth.validation')
const { auth } = require('../middlewares/auth')

const router = express.Router()

router.post('/', validation.loginUser, catchAsync(controller.login))

router.post('/forgotPassword', catchAsync(controller.forgotPassword))
router.patch('/resetPassword/:resetToken', catchAsync(controller.resetPassword))

router.get('/:id/confirmation_token/:confirmationToken', catchAsync(controller.verifyEmail))
router.get('/resendVerify', auth, catchAsync(controller.resendEmailVerify))

module.exports = router