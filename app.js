//  WE USE .ENV FILE ONLY FOR THE DEVELOPMENT NOT FOR PRODUCTION LEVEL

require('dotenv').config()

//Setting the express
const express = require("express");
const app = express();

// setting ejs
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Requiring method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));


//require ExpressError.js from utils
const ExpressError = require("./utils/ExpressError.js")

// Basic setup for the authentication
const passport = require('passport');
const LocalStratergy = require('passport-local');
const User = require("./models/user.js");

//EJS mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// To parse the data or params comes in req or res
app.use(express.urlencoded({ extended: true }));

//Static files from public folder
app.use(express.static(path.join(__dirname, "/public")))


// ------------------------------------ROUTING/Restructuring-----------------------------------

//require routes for restructuring of listings
const listingsRouter = require("./routes/listing.js")

//require routes for restructuring of reviews
const reviewsRouter = require("./routes/review.js")

//require routes for restructuring of User
const userRouter = require("./routes/user.js")

//require flash 
const flash = require("connect-flash");
app.use(flash());

// -------------------------------------SESSIONS----------------------------------------

const session = require("express-session");
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {    // ek hafte me woh bhul jayega of puchega fir se login karo 
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));

//-----------------------Authentication code here because it uses Sessions------------------

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStratergy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// --------------------------------------flash msg-----------------------------------------------
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    // we are using this in navbar.ejs you can see that
    res.locals.currUser = req.user;
         console.log(req.user);
         
    next();
})

// -----------------------------------Database connection---------------------------------------
const mongoose = require("mongoose");
const { log } = require('console');

main()
    .then(() => {
        console.log("Connection To DB");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


app.listen(8080, () => {
    console.log("Server is listening to the port 8080!");
})

// app.get("/demouser",async(req,res)=>{
//    let fakeUser= new User({
//     email:"student@gmail.com",
//      username:"student", 
//    })
//  let registeredUser= await User.register(fakeUser,"helloworld");
//  res.send(registeredUser);
// })

//----------------------------------------------MiddleWares-----------------------------------

app.use("/listings", listingsRouter);

app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", userRouter);

// if the request does not matches any route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"))
})

// Defining middleware to handle errors
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Sometiing Went Wrong" } = err;
    //   res.status(statusCode).send(message);
    res.status(statusCode).render("./listings/error.ejs", { message })
})