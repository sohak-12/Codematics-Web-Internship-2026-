const itemModel = require("../../schemas/itemSchema")

const fetchAllItems = async(req,res)=>{
    try{
        const allProduct = await itemModel.find().sort({ createdAt : -1 })

        res.json({
            message : "All Product",
            success : true,
            error : false,
            data : allProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = fetchAllItems
