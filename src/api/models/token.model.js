const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')

const tokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    usage: {
        type: String,
        required: true,
        enum: ['email-verify', 'password-reset'],
    },
    expires: {
        type: Date
    }
})

tokenSchema.statics.generateToken = async function (user, usage) {
    const randomToken = crypto.randomBytes(20).toString('hex')
    const encryptedToken = crypto.createHash('sha256').update(randomToken).digest('hex')
    console.log(encryptedToken)
    let token = new Token({ user, token: encryptedToken, expires: Date.now() + 24 * 60 * (60 * 1000), usage })
    token = await token.save()
    console.log(token)
    return randomToken
}

const Token = mongoose.model('Token', tokenSchema)
module.exports = Token