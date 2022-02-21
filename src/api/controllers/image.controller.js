const _ = require('lodash')
const { cloudinary } = require('../../config/cloudinary')
const Image = require('../models/image.model')
const ExpressError = require('../utils/ExpressError')

module.exports.new = async (req, res) => {
    const { image, category, user, tags, description, location } = req.body
    let newImage = new Image({ image, category, user, tags, description, location })
    newImage.image = { url: req.file.path, filename: req.file.filename, size: req.file.size }
    newImage = await newImage.save()
    res.status(200).json({ data: newImage, meta: { message: "Image Posted Successfully", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.all = async (req, res) => {
    const image = await Image.find({}).select('-createdAt -updatedAt -__v')
    res.status(200).json({ data: image, meta: { message: "Fetched All Images Successfully....", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.update = async (req, res) => {
    const { id } = req.params
    const image = await Image.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!image) throw new ExpressError("Image doesn't exists...", 400)
    res.status(200).json({ data: image, meta: { message: "Updated Image Successfully...", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.delete = async (req, res) => {
    const { id } = req.params
    const image = await Image.findByIdAndDelete(id)
    if (!image) throw new ExpressError("Image doesn't exists...", 400)
    await cloudinary.uploader.destroy(image.image.filename, function (error, result) {
        console.log(result, error)
    });
    res.status(200).json({ data: image, meta: { message: "Image Deleted Successfully...", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.one = async (req, res) => {
    const { id } = req.params
    const image = await Image.findById(id).select('-createdAt -updatedAt -__v')
    if (!image) throw new ExpressError("Image doesn't exists...", 400)
    res.status(200).json({ data: image, meta: { message: "Fetched All Images Successfully....", flag: "SUCCESS", statusCode: 200 } })
}