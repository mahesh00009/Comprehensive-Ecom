
const Product = require("../Models/productModel")
const ErrorHandler = require("../Utils/errorhandler")
const catchAsyncErrors = require("../Middleware/catchAsyncErrors")
const ApiFeatures = require("../Utils/ApiFeature")



exports.createProduct = catchAsyncErrors(async(req, res, next) => {

    req.body.user = await req.user.id

    const product =await Product.create(req.body)
    res.status(201).json({msg : "success", product}
    )
}
)

exports.updateProduct = catchAsyncErrors(async(req, res, next) => {
    let product = await Product.findById(req.params.id)

   
    if(!product){
        return next(new ErrorHandler("Product not found", 404))

    } 

    product = await Product.findByIdAndUpdate(req.params.id , req.body, {
        new : true, 
        runValidators : true, 
        useFindAndModify: false
    })

    res.status(200).json({
        success : true, 
        product 

    })

})

exports.deleteProduct = catchAsyncErrors(async(req, res, next) => {
    const product  = await Product.findByIdAndDelete(req.params.id)
  
    if(!product){
        return next(new ErrorHandler("Product not found", 404))

    }  else{
        res.status(200).json({
            success : true, 
            msg : "Product deleted successfully"
        })
    }
})

exports.getProductDetails = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found", 404))

    } 
    res.status(200).json({
        success : true, 
        product
    })
})

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments()

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    const products =await apiFeatures.query 

    console.log(products)
    res.status(200).json({success : true, products, productCount})
})


// Creating Review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const {rating, comment, productId} = req.body

    const review = {
        user : req.user.id,
        name : req.user.name, 
       rating: Number(rating), 
       comment
    }

    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())
    if(isReviewed){

        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user._id.toString()){
            rev.rating = rating, 
            rev.comment = comment
            }
        })
    } else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }


    const average = 0;
    product.ratings = product.reviews.forEach((rev) => {
        average = average + rev.rating

    }) 
    
    product.ratings = average / product.reviews.length


    await product.save({validateBeforeSave: false})
    res.status(200).json({success : true})
})



// Get All Reviews

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id)

    if(!product){
        return next(new ErrorHandler("Product not found", 400))
    }
    res.status(200).json({
        success : true, 
        reviews : product.reviews
    })


})


// Delete Review

exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product not found", 400))
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString())

    const average = 0;
    product.ratings = reviews.forEach((rev) => {
        average = average + rev.rating

    }) 
    
    const ratings = average / reviews.length

    const numOfReviews = reviews.length;

    await Product.findById(req.query.productId, {
        reviews, ratings, numOfReviews
    }, {
        new : true, 
        runValidators : true, 
        useFindAndModify : false
    })


    res.status(200).json({
        success : true, 
        reviews : product.reviews
    })


})