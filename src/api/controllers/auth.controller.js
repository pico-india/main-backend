const User = require('../models/user.model')
const _ = require('lodash')
const ExpressError = require('../utils/ExpressError')

module.exports.login = async (req, res) =>{
    const {email, password} = req.body
    const user = await User.findAndValidate(email, password)
    if(!user) throw new ExpressError("Invalid Credentials", 400)
    const token = await user.generateAuthToken()
    res.status(200).json({ data: token, meta: { message: "Login Successful....", flag: "SUCCESS", statusCode: 200 } })
}
