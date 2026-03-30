const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    productName : String,
    brandName : String,
    category : String,
    productImage : [],
    description : String,
    price : Number,
    sellingPrice : Number
},{
    timestamps : true
})

const itemModel = mongoose.model("product",itemSchema)

module.exports = itemModel
