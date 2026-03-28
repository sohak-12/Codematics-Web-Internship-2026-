const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : String,
    role : String,
    profilePic : String,
},{
    timestamps : true
})

const accountModel = mongoose.model("user",accountSchema)

module.exports = accountModel
