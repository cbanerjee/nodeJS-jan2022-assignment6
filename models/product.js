const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productmodel = new Schema({
    name: {type:String},
    price: {type:String},
})

module.exports = mongoose.model('productmodel', productmodel, 'product_list')