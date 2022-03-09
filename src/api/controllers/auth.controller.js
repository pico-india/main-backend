const User = require('../models/user.model')
const _ = require('lodash')
const ExpressError = require('../utils/ExpressError')
const Token = require('../models/token.model')
const sendEmail = require('../utils/sendMail')
const { template } = require('../utils/verficationTemplate')
const { resetTemplate } = require('../utils/resetTemplate')
const crypto = require('crypto')

module.exports.login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findAndValidate(email, password)
    if (!user) throw new ExpressError("Invalid Credentials", 400)
    const token = await user.generateAuthToken()
    res.status(200).json({ data: token, meta: { message: "Login Successful....", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.verifyEmail = async (req, res) => {
    const { id, confirmationToken } = req.params
    const user = await User.findById(id)
    if (!user) throw new ExpressError('Invalid User', 400)
    const encryptedToken = crypto.createHash('sha256').update(confirmationToken).digest('hex')
    const token = await Token.findOne({
        user: id,
        token: encryptedToken,
        expires: { $gt: Date.now() },
        usage: 'email-verify'
    })
    if (!token) throw new ExpressError('Invalid / Expired Link', 400)
    const verifiedUser = await User.findByIdAndUpdate(token.user, { emailVerified: true }, { new: true, runValidators: true })
    await token.remove()
    res.status(200).json({ data: verifiedUser.emailVerified, meta: { message: "Email Verified Successfully! Welcome to Pico", flag: "SUCCESS", statusCode: 200 } })

}

module.exports.resendEmailVerify = async (req, res) => {
    let token
    const { _id: id } = req.user
    const user = await User.findById(id)
    if (user.emailVerified) throw new ExpressError('User Already Verified', 400)
    const usableToken = await Token.deleteOne({
        user: id,
        usage: 'email-verify'
    })
    token = await Token.generateToken(id, 'email-verify')
    const url = `http://localhost:8080/api/auth/${id}/confirmation_token/${token}`
    const text = template(user.firstName, url)
    await sendEmail({ to: user.email, subject: 'Verify your Pico Account', text })
    res.status(200).json({ data: {}, meta: { message: "Verification mail sent!", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new ExpressError('This email is not registered', 400)
    const token = await Token.generateToken(user._id, 'password-reset')
    const url = `http://localhost:8080/api/auth/resetPassword/${token}`
    const text = resetTemplate(user.firstName, url)
    await sendEmail({ to: user.email, subject: 'Reset Pico Password', text })
    res.status(200).json({ data: { url, token }, meta: { message: "Reset password mail sent!", flag: "SUCCESS", statusCode: 200 } })
}

module.exports.resetPassword = async (req, res) => {
    const { resetToken } = req.params
    const { password } = req.body
    const encryptedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    const token = await Token.findOne({
        token: encryptedToken,
        expires: { $gt: Date.now() },
        usage: 'password-reset'
    })
    if (!token) throw new ExpressError('Invalid / Expired Link', 400)
    const user = await User.findById(token.user)
    user.password = password
    await user.save()
    await token.remove()
    res.status(200).json({ data: {}, meta: { message: "Password reset Successful!", flag: "SUCCESS", statusCode: 200 } })
}
