

const express = require("express")
const errorMiddleware = require("./Middleware/error")
const cookieParser = require("cookie-parser")

const app = express()


const product = require("./Routes/productRoutes")
const user = require("./Routes/userRoutes")      
const order = require("./Routes/OrderRoute")

app.use(express.json()) 
app.use(cookieParser()) 

app.use("/api/v1", product)  
app.use("/api/v1", user)    
app.use("/api/v1", order)    

// app.use(errorMiddleware)


module.exports = app