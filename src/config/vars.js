const path = require('path')

require('dotenv-safe').config({
    path: path.join(__dirname, '../../.env'),
    example: path.join(__dirname, '../../.env.example'),
});

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongo: {
        uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
    logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryKey: process.env.CLOUDINARY_KEY,
    cloudinarySecret: process.env.CLOUDINARY_SECRET,
};