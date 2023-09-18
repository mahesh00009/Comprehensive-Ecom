const mongoose = require('mongoose')
const dotenv = require("dotenv")

dotenv.config({path : "Backend/Config/config"})

const connectDB = () => {
    
mongoose.connect("mongodb://127.0.0.1:27017/EcommerceStack").then((data) => {
    console.log("Database connected to Server : "+ data.connection.host)
}).catch((err) => {
    console.log(err)
})
}
module.exports = connectDB