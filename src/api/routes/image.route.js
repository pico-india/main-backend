const express = require('express')
const multer = require('multer')
const controller = require('../controllers/image.controller')
const catchAsync = require('../utils/catchAsync')
const validation = require('../validations/image.validation')
const { storage } = require('../../config/cloudinary')
const { auth, isAuthorOrAdminImage, isVerified } = require('../middlewares/auth')

const router = express.Router()
const upload = multer({ storage })

router.post('/', auth, catchAsync(isVerified), upload.single('image'), validation.imageDetail, catchAsync(controller.new))
router.get('/', controller.all)
router.get('/:id', catchAsync(controller.one))
router.patch('/:id', auth, catchAsync(isVerified), catchAsync(isAuthorOrAdminImage), validation.updateImage, catchAsync(controller.update))
router.delete('/:id', auth, catchAsync(isVerified), catchAsync(isAuthorOrAdminImage), catchAsync(controller.delete))

module.exports = router