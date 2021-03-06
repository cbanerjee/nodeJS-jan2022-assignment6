const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userModel = new Schema({
    name: {type:String},
    email: {type:String},
    password: {type:String},
    isAdmin: {type:String}
})

module.exports = mongoose.model('user', userModel, 'userlist')