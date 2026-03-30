const itemModel = require("../../schemas/itemSchema")

const fetchItemsByCategory = async(req,res)=>{
    try{
        const { category } = req?.body || req?.query
        const product = await itemModel.find({ category })

        res.json({
            data : product,
            message : "Product",
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = fetchItemsByCategory
