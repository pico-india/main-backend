const jwt = require('jsonwebtoken')
const ExpressError = require("../utils/ExpressError")
const { jwtSecret } = require('../../config/vars')
const Image = require('../models/image.model')
const express = require('express')

module.exports.auth = (req, res, next) => {
    const token = req.header('x-auth-token')
    if (!token) throw new ExpressError('Access denied...', 401)
    try {
        const decoded = jwt.verify(token, jwtSecret)
        req.user = decoded;
        next()
    } catch (error) {
        throw new ExpressError('Invalid Token', 400)
    }
}

module.exports.isAuthorOrAdmin = async (req, res, next) => {
    const { id } = req.params
    const image = await Image.findById(id)
    if (!image) throw new ExpressError("Image Doesn't Exists...", 400)
    if (image.user.equals(req.user._id) || req.user.role === 'admin') next()
    else throw new ExpressError('Access Denied', 401)
}