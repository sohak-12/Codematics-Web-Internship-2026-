const checkAdminAccess = require("../../utils/accessControl")
const itemModel = require("../../schemas/itemSchema")

async function createItem(req,res){
    try{
        const sessionUserId = req.userId

        if(!await checkAdminAccess(sessionUserId)){
            throw new Error("Permission denied")
        }
    
        const uploadProduct = new itemModel(req.body)
        const saveProduct = await uploadProduct.save()

        res.status(201).json({
            message : "Product upload successfully",
            error : false,
            success : true,
            data : saveProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = createItem
