const User = require('../models/user.model')
const _ = require('lodash')
const ExpressError = require('../utils/ExpressError')
const Image = require('../models/image.model')
const { cloudinary } = require('../../config/cloudinary')
const Token = require('../models/token.model')
const sendEmail = require('../utils/sendMail')
const { template } = require('../utils/verficationTemplate')

module.exports.register = async (req, res) => {
    const { firstName, lastName, username, email, password, role } = req.body
    let user = await User.find({ email })
    if (!user) throw new ExpressError("E-Mail Already exists", 400)
    user = await User.find({ username })
    if (!user) throw new ExpressError("Username Already exists", 400)
    user = new User({ firstName, lastName, username, email, password, role })
    user = await user.save()
    const authToken = await user.generateAuthToken()

    const token = await Token.generateToken(user._id, 'email-verify')
    const url = `http://localhost:8080/api/auth/${user._id}/confirmation_token/${token}`
    const text = template(user.firstName, url)
    await sendEmail({ to: user.email, subject: 'Verify your Pico Account', text })

    res.status(200).json({ data: { ..._.pick(user, ['firstName', 'lastName', 'username', 'email', 'bio', 'website', 'instagram', 'facebook', '_id']), authToken }, meta: { message: "Verify Your Email", flag: "SUCCESS", statusCode: 200 } })
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
    if (req.body.isActive === false) {
        const image = await Image.updateMany({ user: user._id }, { isActive: false })
    }
    if (req.body.isActive === true) {
        const image = await Image.updateMany({ user: user._id }, { isActive: true })
    }
    res.status(200).json({ data: { user }, meta: { message: "User Updated Successfully...", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.delete = async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)
    if (!user) throw new ExpressError("No such user found", 400)
    let image = await Image.find({ user: user._id })
    const deletedImages = await Image.deleteMany({ user: user._id })
    image = image.map(i => (i.image.filename))
    cloudinary.api.delete_resources(
        image,
        function (error, result) {
            console.log(result, error)
        }
    );
    res.status(200).json({ data: { user, deletedImages }, meta: { message: "User Deleted Successfully...", flag: "SUCCESS", statusCode: 200 } })
}