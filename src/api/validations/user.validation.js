const Joi = require('joi')
const ExpressError = require('../utils/ExpressError')

const newUserSchema = Joi.object({
    firstName: Joi.string().required().min(2).max(255).alphanum(),
    lastName: Joi.string().required().min(2).max(255).alphanum(),
    username: Joi.string().required().alphanum().min(5).max(255),
    email: Joi.string().required().email().min(5).max(255),
    emailVerified: Joi.boolean(),
    password: Joi.string().required().min(5).max(1024),
    bio: Joi.string().min(1).max(255),
    website: Joi.string().min(1).max(2048),
    instagram: Joi.string().min(1).max(2048),
    facebook: Joi.string().min(1).max(2048),
    role: Joi.string().valid('user', 'admin'),
    isActive: Joi.boolean()
})

module.exports.registerUser = (req, res, next) => {
    const { error } = newUserSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}