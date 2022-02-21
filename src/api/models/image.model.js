const { array } = require('joi')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const imageSchema = Schema({
    url: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 2048
    },
    filename: {
        type: String,
        required: true,
        maxlength: 1000
    },
    size: {
        type: Number,
        required: true
    }
})

const imageDetailSchema = new Schema({
    image: imageSchema,
    isActive: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        maxlenght: 255
    },
    description: {
        type: String,
        maxlength: 500
    },
    tags: {
        type: String,
        maxlenght: 100
    },
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Image', imageDetailSchema)