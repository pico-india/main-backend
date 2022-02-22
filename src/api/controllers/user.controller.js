const User = require('../models/user.model')
const _ = require('lodash')
const ExpressError = require('../utils/ExpressError')

module.exports.register = async (req, res) => {
    const { firstName, lastName, username, email, password, role } = req.body
    let user = await User.find({ email })
    if (!user) throw new ExpressError("E-Mail Already exists", 400)
    user = await User.find({ username })
    if (!user) throw new ExpressError("Username Already exists", 400)
    user = new User({ firstName, lastName, username, email, password, role })
    user = await user.save()
    const token = await user.generateAuthToken()
    res.status(200).json({ data: { ..._.pick(user, ['firstName', 'lastName', 'username', 'email', 'bio', 'website', 'instagram', 'facebook', '_id']), token }, meta: { message: "User Registration Successful....", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.all = async (req, res) => {
    const user = await User.find({}).select('-createdAt -updatedAt -__v -password -role -emailVerified')
    res.status(200).json({ data: user, meta: { message: "Fetched All Users Successfully....", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.profile = async (req, res) => {
    const { username } = req.params
    const user = await User.findOne({ username }).select('-password -role -emailVerified -__v')
    if (!user) throw new ExpressError('No Such User Found', 404)
    res.status(200).json({ data: user, meta: { message: "Fetched User Successfully....", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.update = async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!user) throw new ExpressError("No such user found...", 400)
    res.status(200).json({ data: user, meta: { message: "User Updated Successfully...", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.delete = async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)
    if (!user) throw new ExpressError("No such user found", 400)
    res.status(200).json({ data: user, meta: { message: "User Deleted Successfully...", flag: "SUCCESS", statusCode: 200 } })
}