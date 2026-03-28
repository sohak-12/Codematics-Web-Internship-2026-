const checkAdminAccess = require('../../utils/accessControl')
const itemModel = require('../../schemas/itemSchema')

async function modifyItem(req,res){
    try{
        if(!await checkAdminAccess(req.userId)){
            throw new Error("Permission denied")
        }

        const { _id, ...resBody} = req.body

        const updateProduct = await itemModel.findByIdAndUpdate(_id,resBody)
        
        res.json({
            message : "Product update successfully",
            data : updateProduct,
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

module.exports = modifyItem
