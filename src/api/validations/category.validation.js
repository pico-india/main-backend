const Joi = require('joi')
const { join } = require('lodash')
const ExpressError = require('../utils/ExpressError')

const newCategorySchema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    isActive: Joi.boolean(),
    isFeatured: Joi.boolean()
})

module.exports.newCategory = (req, res, next) => {
    const { error } = newCategorySchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}