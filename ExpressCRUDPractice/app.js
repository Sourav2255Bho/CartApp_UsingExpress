//add all imports
const express = require("express")
const app = express();
const path = require("path")
const session = require("express-session")
const bodyparser = require("body-parser")

//all url specific functions are in the file ./routes/router.js 
const routes = require("./routes/router")

//configure the application
app.set("views",path.join(__dirname,"views"))
app.set('view engine', 'ejs');

//add all static reference settings
app.set(express.static(path.join(__dirname,"public")))

app.use(session({
    secret:"mysecretkey",
    resave :true,
    saveUninitialized: true
}))

// add all middlewares
app.use(bodyparser.urlencoded({extended:false}))
app.use("/css", express.static(path.resolve(__dirname,"public/css")))
app.use("/js", express.static(path.resolve(__dirname,"public/js")))


// url specific function
app.use("/",routes)


// start the server
app.listen(3001, function(){
    console.log("Server Started at port http://localhost:3001/login")
})

module.export = app;