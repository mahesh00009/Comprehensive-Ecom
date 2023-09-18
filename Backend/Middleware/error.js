

const ErrorHandler = require('../Utils/errorhandler')


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server error"

    //path error
    if(err.name ==="CastError"){
        const message = "Resource not found on" + err.path
        err = new ErrorHandler(message , 400)
    }

    //duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message , 400)
        
    }

    //jwt error
    if(err.name === "JsonWebTokenError"){
        const message = "JWt is Invalid" + err.path
        err = new ErrorHandler(message , 400)
    }

    //jwt expire error

    if(err.name === "TokenExpiredError"){
        const message = "JWt is expired" 
        err = new ErrorHandler(message , 400)

    }



    res.status(err.statusCode).json({
        success : false,
        message : err.message
    })
}

//wrongMongodb ID error

