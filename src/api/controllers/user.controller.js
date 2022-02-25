const User = require('../models/user.model')
const _ = require('lodash')
const ExpressError = require('../utils/ExpressError')
const Image = require('../models/image.model')
const { cloudinary } = require('../../config/cloudinary')
const Token = require('../models/token.model')
const sendEmail = require('../utils/sendMail')
const crypto = require('crypto')

module.exports.register = async (req, res) => {
    const { firstName, lastName, username, email, password, role } = req.body
    let user = await User.find({ email })
    if (!user) throw new ExpressError("E-Mail Already exists", 400)
    user = await User.find({ username })
    if (!user) throw new ExpressError("Username Already exists", 400)
    user = new User({ firstName, lastName, username, email, password, role })
    user = await user.save()
    const authToken = await user.generateAuthToken()

    const token = await new Token({
        user: user._id,
        token: crypto.randomBytes(32).toString('hex'),
    }).save();

    const url = `http://localhost:8080/api/user/${user._id}/confirmation_token/${token.token}`
    console.log(url)
    const text = `
    <div>
    <p>Hey ${user.firstName},</p>
    <p>In order to get full access to Pico features, you need to confirm your email address by following the link below.</p>
    <a href=${url} clicktracking=off>Click Here</a>
    <p>Note: If you did not sign up for this account, you can ignore this email and the account will be deleted within 60 days.
    <br>
    — Pico</p>
    </div>
    `
    await sendEmail({ to: user.email, subject: 'Verify your Pico Account', text })

    res.status(200).json({ data: { ..._.pick(user, ['firstName', 'lastName', 'username', 'email', 'bio', 'website', 'instagram', 'facebook', '_id']), authToken }, meta: { message: "Verify Your Email", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.verifyEmail = async (req, res) => {
    const { id, confirmation_token } = req.params
    const user = await User.findById(id)
    if (!user) throw new ExpressError('Invalid User', 400)
    const token = await Token.findOne({
        user: id,
        token: confirmation_token
    })
    if (!token) throw new ExpressError('Invalid/Expired Link', 400)
    await User.updateOne({ id: user._id, emailVerified: true })
    await token.remove()
    res.status(200).json({ data: {}, meta: { message: "Email Verified Successfully! Welcome to Pico", flag: "SUCCESS", statusCode: 200 } })

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