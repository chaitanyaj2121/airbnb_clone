const express = require("express");
const router = express.Router();

//require wrapAsnc.js from utils
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");

const {storage}=require("../cloudconfig.js");
// to parse the form data file uploaded !
const multer  = require('multer')
const upload = multer({ storage})


const { isLoggedIn, isOwner, validateListing } = require('../middlewares.js');

const
    {
        index,
        newRoute,
        showRoute,
        createListing,
        renderEditForm,  
        updateListing,
        deleteListing

    } = require("../controlers/listings.js");

// replaced "/" to "/listings for routing"




//New route    //passing isLoggedIn middleware the callback is in controllers
router.get("/new",isLoggedIn , newRoute)

// Show Route
router.get("/:id", wrapAsync(showRoute));

//Create Route
// ;

// Index Route
router
.route("/")
.get(wrapAsync(index))
.post( isLoggedIn, upload.single('image'),validateListing, wrapAsync(createListing))     

//EDIT Route 
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(renderEditForm))

//Update Route
router.put("/:id", upload.single('image'),validateListing, isLoggedIn,isOwner, wrapAsync(updateListing));

// delete listings route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing))


module.exports = router;