const Category = require('../models/category.model')
const _ = require('lodash')
const ExpressError = require('../utils/ExpressError')

module.exports.new = async (req, res) => {
    let category = new Category({ ...req.body })
    category = await category.save()
    res.status(200).json({ data: { ..._.pick(category, ['name', 'isActive', 'isFeatured', '_id']) }, meta: { message: "Created new Category Successfully....", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.all = async (req, res) => {
    const category = await Category.find({}).select('-createdAt -updatedAt -__v')
    res.status(200).json({ data: category, meta: { message: "Fetched All Categories Successfully....", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.update = async (req, res) => {
    const { id } = req.params
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!category) throw new ExpressError("Category doesn't exists...", 400)
    res.status(200).json({ data: category, meta: { message: "Updated Category Successfully...", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.delete = async (req, res) => {
    const { id } = req.params
    const category = await Category.findByIdAndDelete(id)
    if (!category) throw new ExpressError("Category doesn't exists...", 400)
    res.status(200).json({ data: category, meta: { message: "Category Deleted Successfully...", flag: "SUCCESS", statusCode: 200 } })
}