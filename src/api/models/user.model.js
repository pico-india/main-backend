const { jwtExpirationInterval, jwtSecret } = require('../../config/vars')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 127
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 127
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    emailVerified: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024  
    },
    bio: {
        type: String,
        minlength: 1,
        maxlength: 255 
    },
    website: {
        type: String,
        minlength: 5,
        maxlength: 2048
    },
    instagram: {
        type: String,
        minlength: 5,
        maxlength: 2048
    },
    facebook: {
        type: String,
        minlength: 5,
        maxlength: 2048
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    } else {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }
})

userSchema.statics.findAndValidate = async function (email, password) {
    const foundUser = await this.findOne({ email })
    if (!foundUser) return false
    const isValid = await bcrypt.compare(password, foundUser.password)
    return isValid ? foundUser : false
}

userSchema.methods.generateAuthToken = async function () {
    const token = await jwt.sign({ _id: this._id, role: this.role, username: this.username }, jwtSecret, { expiresIn: jwtExpirationInterval })
    return token
}

module.exports = mongoose.model('User', userSchema)