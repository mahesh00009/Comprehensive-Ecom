const ErrorHandler = require("../Utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../Models/UserModel")


exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next) => {

    const {token} = req.cookies

    if(!token){
        console.log("no token available")
        return next(new ErrorHandler("please login", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodedData.id)

    next();


})

exports.authorizedRoles=(...roles) => {
    return(req, res, next) => {

        if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(`Not allowed`, 403))
        }

        next()

    }
}