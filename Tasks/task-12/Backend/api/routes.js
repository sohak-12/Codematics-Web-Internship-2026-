const express = require('express')

const router = express.Router()

const registerAccount = require("../handlers/account/registerAccount")
const loginAccount = require('../handlers/account/loginAccount')
const getAccountInfo = require('../handlers/account/getAccountInfo')
const verifySession = require('../guards/sessionGuard')
const logoutAccount = require('../handlers/account/logoutAccount')
const fetchAllAccounts = require('../handlers/account/fetchAllAccounts')
const modifyAccount = require('../handlers/account/modifyAccount')
const createItem = require('../handlers/item/createItem')
const fetchAllItems = require('../handlers/item/fetchAllItems')
const modifyItem = require('../handlers/item/modifyItem')
const fetchCategorySample = require('../handlers/item/fetchCategorySample')
const fetchItemsByCategory = require('../handlers/item/fetchItemsByCategory')
const fetchItemDetail = require('../handlers/item/fetchItemDetail')
const insertToBasket = require('../handlers/account/insertToBasket')
const countBasketItems = require('../handlers/account/countBasketItems')
const viewBasketItems = require('../handlers/account/viewBasketItems')
const modifyBasketItem = require('../handlers/account/modifyBasketItem')
const removeBasketItem = require('../handlers/account/removeBasketItem')
const searchItems = require('../handlers/item/searchItems')
const filterItems = require('../handlers/item/filterItems')

router.post("/signup",registerAccount)
router.post("/signin",loginAccount)
router.get("/user-details",verifySession,getAccountInfo)
router.get("/userLogout",logoutAccount)

//admin panel 
router.get("/all-user",verifySession,fetchAllAccounts)
router.post("/update-user",verifySession,modifyAccount)

//product
router.post("/upload-product",verifySession,createItem)
router.get("/get-product",fetchAllItems)
router.post("/update-product",verifySession,modifyItem)
router.get("/get-categoryProduct",fetchCategorySample)
router.post("/category-product",fetchItemsByCategory)
router.post("/product-details",fetchItemDetail)
router.get("/search",searchItems)
router.post("/filter-product",filterItems)

//user add to cart
router.post("/addtocart",verifySession,insertToBasket)
router.get("/countAddToCartProduct",verifySession,countBasketItems)
router.get("/view-card-product",verifySession,viewBasketItems)
router.post("/update-cart-product",verifySession,modifyBasketItem)
router.post("/delete-cart-product",verifySession,removeBasketItem)

module.exports = router
