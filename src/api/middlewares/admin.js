const ExpressError = require("../utils/ExpressError")

module.exports = (req, res, next) => {
    console.log(req.user)
    if (req.user.role === 'user') throw new ExpressError('Access denied', 401)
    next()
}