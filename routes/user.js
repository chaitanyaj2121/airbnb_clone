const express = require("express");

//mergeParams:true if you not add this (req.params.id) we will getting the value of this is undefined
// 
const router = express.Router();

// in the above user.js the schema is defined
const User = require('../models/user.js');

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});


// here we have used try and catch because we have to show the only flash not the permanant error msg
router.post("/signup", wrapAsync(async (req, res) => {

  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username })
    
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    // the below lines will remove the signup and login btns and automatically sigups to the web

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WonderLust!");
      res.redirect("/listings")
    })
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}));

router.get("/login", async (req, res) => {
  res.render("users/login.ejs");
});

// passport.authenticate() it will check the 
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {

  req.flash("success", "Welcome to Wanderlust! You are logned in !");
  // console.log(res.locals.redirectUrl);
let redirecturl=res.locals.redirectUrl || "/listings"
res.redirect(redirecturl);

})

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logout Success!")
    res.redirect("/listings");
  })
})

module.exports = router;