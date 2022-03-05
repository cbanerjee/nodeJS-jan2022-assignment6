const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shoppingmodel = new Schema({
    product: {type:String},
    date: {type:String},
    price: {type:String},
    Userid: {type:String}
})

module.exports = mongoose.model('shoppingmodel', shoppingmodel, 'shopping_list')