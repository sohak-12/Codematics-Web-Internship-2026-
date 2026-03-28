const itemModel = require("../../schemas/itemSchema")

const fetchItemDetail = async(req,res)=>{
    try{
        const { productId } = req.body

        const product = await itemModel.findById(productId)

        res.json({
            data : product,
            message : "Ok",
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err?.message  || err,
            error : true,
            success : false
        })
    }
}

module.exports = fetchItemDetail
