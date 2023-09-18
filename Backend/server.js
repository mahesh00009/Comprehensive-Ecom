const app = require("./App")

const dotenv = require("dotenv")
const connectDatabase = require("./Config/database")

const host = '127.0.0.1'
const PORT = 4000         

//uncaught exception

process.on("uncaughtException", (err) => {
    console.log("Error", err.message)
    console.log("shutting down server")
    process.exit(1)
})

dotenv.config({path : "Backend/Config/config"})

connectDatabase()

const server = app.listen(PORT , host, ()=> {
    console.log(`server is running on http://${host}:${PORT}`)
})


//Unhandled Promise

process.on("unhandledRejection", err => {
    console.log("Error" + err.message)
    console.log("shutting down server")

    server.close(() => {
        process.exit(1)
    })
})