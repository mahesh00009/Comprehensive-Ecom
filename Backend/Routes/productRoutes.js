

const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReviews } = require('../Controllers/productController')
const { isAuthenticatedUser, authorizedRoles } = require('../Middleware/Auth')

const router = express.Router()


router.route("/products")
.get(getAllProducts)
router.route("/products/new").post(isAuthenticatedUser, authorizedRoles("admin"), createProduct)

router.route("/product/:id")
.put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)
.delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct)

router.route("/product/:id").get(getProductDetails)

router.route("/review").put(isAuthenticatedUser, createProductReview)
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReviews)


module.exports = router