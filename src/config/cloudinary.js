const cloudinary = require('cloudinary').v2;
const { cloudinaryName, cloudinaryKey, cloudinarySecret } = require('./vars')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: cloudinaryName,
    api_key: cloudinaryKey,
    api_secret: cloudinarySecret
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'pico',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}