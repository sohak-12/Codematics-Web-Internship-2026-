const basketModel = require("../../schemas/basketSchema")

async function countBasketItems(req,res){
    try{
        const userId = req.userId
        const count = await basketModel.countDocuments({ userId })
        
        res.json({
            message : "ok",
            data : { count },
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

module.exports = countBasketItems
