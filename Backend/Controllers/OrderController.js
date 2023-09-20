const Order = require("../Models/OrderModel");
const Product = require("../Models/productModel")
const ErrorHandler = require("../Utils/errorhandler")
const catchAsyncErrors = require("../Middleware/catchAsyncErrors")


exports.newOrder = catchAsyncErrors(async(req, res, next) => {

    const {shippingInfo, orderItems,paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice} = req.body

    const order = await Order.create({
        shippingInfo, orderItems,paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice, paidAt : Date.now(), user : req.user._id
    })

    res.status(201).json({success : true, order})
})


exports.getSingleOrder = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
         return next(new ErrorHandler("Order Not found with this id", 404))
    }

    res.status(200).json({ success : true, order})


})



exports.myOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find({user : req.user._id})

    res.status(200).json({ success : true, orders})


})



exports.getAllOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find()


    let totalAmount = 0

    orders.forEach(order => totalAmount += order.totalPrice)

    res.status(200).json({ success : true, totalAmount, orders})


})



exports.updateOrder = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.findById(req.params.id)

    if(!orders){
        return next(new ErrorHandler("Order not found with this id", 404))
    }

    if(orders.orderStatus === "Delivered"){
        return next(new ErrorHandler("You Have Delivered This Order", 404))
    }

    orders.orderItems.forEach( async (order) => {
        await updateStock(order.product, order.quantity)
    })

    orders.orderStatus = req.body.status

    if(req.body.status === "Delivered"){
    orders.deliveredAt = Date.now()

    }

    await orders.save({validateBeforeSave : false})
    res.status(200).json({ success : true, totalAmount, orders})


})

async function updateStock(id, quantity){
    const product = await Product.findById(id)

    product.stock = product.stock - quantity

    await product.save({validateBeforeSave: false})
}

exports.deleteOrder = catchAsyncErrors(async(req, res, next) => {

    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("Order not found with this id", 404))
    }

    await order.remove()

    res.status(200).json({
        success: true
    })

})