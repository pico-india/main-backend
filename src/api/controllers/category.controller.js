const Category = require('../models/category.model')
const _ = require('lodash')

module.exports.new = async (req, res) => {
    let category = new Category({...req.body})
    category = await category.save()
    res.status(200).json({data: {..._.pick(category, ['name', 'isActive', 'isFeatured', '_id'])}, meta:{message: "Created new Category Successfully....", flag: "SUCCESS", statusCode: 200}})
}

module.exports.all = async (req, res) => {
    const category = await Category.find({}).select('-createdAt -updatedAt -__v')
    res.status(200).json({data: category, meta:{message: "Fetched All Categories Successfully....", flag: "SUCCESS", statusCode: 200}})
}