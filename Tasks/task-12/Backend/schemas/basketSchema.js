const mongoose = require('mongoose')

const basketItem = mongoose.Schema({
   productId : {
        ref : 'product',
        type : String,
   },
   quantity : Number,
   userId : String,
},{
    timestamps : true
})

const basketModel = mongoose.model("addToCart",basketItem)

module.exports = basketModel
