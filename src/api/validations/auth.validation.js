const Joi = require('joi')
const ExpressError = require('../utils/ExpressError')

const loginUserSchema = Joi.object({
    email: Joi.string().required().email().min(5).max(255),
    password: Joi.string().required().min(5).max(1024),
})

module.exports.loginUser = (req, res, next) => {
    const { error } = loginUserSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}