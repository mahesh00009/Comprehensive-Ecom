

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken") 
const dotenv = require("dotenv")
const crypto = require('crypto')

dotenv.config();

const userSchema = new mongoose.Schema({
    name : {
        type: String, 
        require : [true, "Enter your name"], 
        maxLength : [30, "Name cannot exceed 30 characters"], 
        minLength : [3, "Name should have more than 3 characters"]
    }, 
    email : {
        type :String, 
        required : [true, "Enter you email"],
        unique : true, 
        validate : [validator.isEmail, "Please enter a valid email"]
    }, 
    password : {
        type : String, 
        required : [true, "Enter your password"], 
        unique : true, 
        minLength : [6, "Password should be more than 6 characters"], 
        select : false
    }, 
    avatar : {
        public_id : {
            type : String, 
            required : true
        }, 
        url : {
            type : String, 
            required : true

        }, 
    }, 
    role : {
        type : String,
        default : "user"
    }, 
    resetPasswordToken : String, 
    resetPasswordExpire : Date
})

userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//Token

userSchema.methods.getJWTToken = function() {
    return jwt.sign({id : this._id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRE,
    })
}

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPasswordToken = async function(){

    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

    this.resetPasswordExpire = Date.now() +  15 * 60 * 1000

    return resetToken

}


module.exports = mongoose.model("User", userSchema)