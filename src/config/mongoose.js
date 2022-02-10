const mongoose = require('mongoose');
const { mongo } = require('./vars')


module.exports.connect = async function () {
    await mongoose.connect(mongo.uri);
    console.log('DataBase connected');
}