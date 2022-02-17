const User = require('../models/user.model')
const _ = require('lodash')
const ExpressError = require('../utils/ExpressError')

module.exports.register = async (req, res) =>{
    const {firstName, lastName, username, email, password} = req.body
    let user = await User.find({email})
    if(!user) throw new ExpressError("E-Mail Already exists", 400)
    user = await User.find({username})
    if(!user) throw new ExpressError("Username Already exists", 400)
    user = new User({firstName, lastName, username, email, password})
    user = await user.save()
    const token = await user.generateAuthToken()
    res.status(200).json({ data: { ..._.pick(user, ['firstName', 'lastName', 'username', 'email', 'bio', 'website', 'instagram', 'facebook', '_id']), token }, meta: { message: "User Registration Successful....", flag: "SUCCESS", statusCode: 200 } })
}
