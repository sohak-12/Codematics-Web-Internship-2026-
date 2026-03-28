const itemModel = require("../../schemas/itemSchema")

const fetchCategorySample = async(req,res)=>{
    try{
        const productCategory = await itemModel.distinct("category")

        console.log("category",productCategory)

        const productByCategory = []

        for(const category of productCategory){
            const product = await itemModel.findOne({category })

            if(product){
                productByCategory.push(product)
            }
        }

        res.json({
            message : "category product",
            data : productByCategory,
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

module.exports = fetchCategorySample
