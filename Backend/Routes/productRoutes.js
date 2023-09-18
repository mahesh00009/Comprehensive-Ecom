

const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../Controllers/productController')
const { isAuthenticatedUser, authorizedRoles } = require('../Middleware/Auth')

const router = express.Router()


router.route("/products")
.get(getAllProducts)
router.route("/products/new").post(isAuthenticatedUser, authorizedRoles("admin"), createProduct)

router.route("/product/:id")
.put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)
.delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct).get(getProductDetails)


module.exports = router