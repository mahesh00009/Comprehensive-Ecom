

const ErrorHandler = require("../Utils/errorhandler")
const catchAsyncErrors = require("../Middleware/catchAsyncErrors")
const User = require("../Models/UserModel")
const dotenv = require("dotenv");
const sendToken = require("../Utils/JwtToken");
const sendEmail = require("../Utils/SendEmail");
const crypto = require("crypto")
//User Registration


const envPath = '../Config/config.env';

dotenv.config({ path: envPath });

exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    
    const { name, email, password } = req.body

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "sample id",
            url: "sample url"
        }
    })

    sendToken(user, 201, res)

})

exports.loginUser = catchAsyncErrors(async(req, res, next) => {

    const{email, password} = req.body

    if(!email || !password) {
        return next(new ErrorHandler("please Enter email and password", 400))
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const isPasswordMatched = user.comparePassword(password)

    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    sendToken(user, 200, res)

})

exports.logout = catchAsyncErrors(async(req,res, next) => {

    res.cookie("token", null , {
        expires : new Date(Date.now()), 
        httpOnly : true
    })

    res.status(200).json({
        success : true, 
        message : "loggedout successful"
    })
})

exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findOne({email : req.body.email})

    if(!user){
        return next(new ErrorHandler("User Not found", 404))
    }

    const resetToken = await user.getResetPasswordToken()

    await user.save({validateBeforeSave : false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token \n\n ${resetPasswordUrl}`

    try{

        await sendEmail({
            email : user.email, 
            subject : "Your Ecom Password Recovery",
            message : message

        })

        res.status(200).json({
            success : true, 
            message : `Email send to ${user} successfully`,
            resetPasswordUrl
        })

    } catch(e) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave : false})

        return next(new ErrorHandler(e.message, 500))
    }
})


exports.resetPassword = catchAsyncErrors(async(req, res, next) => {
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")


    const user = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire : {$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been Expired!", 400))
    }

    if(req.body.password === req.body.confirmPassword){
        return next(new ErrorHandler("Please add new password", 400))

    }
    user.password =  req.body.password

    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined

    await user.save()

    sendToken(user, 200, res)


})

exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success : true, 
        user
    })
})