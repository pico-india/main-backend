const jwt = require('jsonwebtoken')
const ExpressError = require("../utils/ExpressError")
const { jwtSecret } = require('../../config/vars')

module.exports.auth = (req, res, next) => {
    const token = req.header('x-auth-token')
    if (!token) throw new ExpressError('Access denied...', 401)
    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.user = decoded;
        next()
    } catch (error) {
        throw new ExpressError('Invalid Token', 400)
    }
}