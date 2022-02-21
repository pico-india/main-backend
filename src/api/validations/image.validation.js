const Joi = require('joi')
const ExpressError = require('../utils/ExpressError')

const imageSchema = Joi.object({
    url: Joi.string().required().min(5).max(2048),
    filename: Joi.string().required().max(1000),
    size: Joi.number().required()
})

const imageDetailSchema = Joi.object({
    image: imageSchema,
    isActive: Joi.boolean(),
    views: Joi.number(),
    likes: Joi.number(),
    downloads: Joi.number(),
    location: Joi.string().max(255),
    description: Joi.string().max(500),
    tags: Joi.string().max(100),
    category: Joi.array().items(Joi.string().required().alphanum().min(24).max(24)),
    user: Joi.string().required().min(24).max(24)
})

const updateImageSchema = Joi.object({
    image: imageSchema,
    isActive: Joi.boolean(),
    location: Joi.string().max(255),
    description: Joi.string().max(500),
    tags: Joi.string().max(100),
    category: Joi.array().items(Joi.string().required().alphanum().min(24).max(24)),
})

module.exports.imageDetail = (req, res, next) => {
    const { error } = imageDetailSchema.validate(req.body.data)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.updateImage = (req, res, next) => {
    const { error } = updateImageSchema.validate(req.body.data)
    if (error) {
        const msg = error.details.map(el => el.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}