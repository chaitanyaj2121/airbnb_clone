const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

//require Schema.js 
let { listingSchema,reviewSchema} = require("./schema.js");

//require ExpressError.js from utils
const ExpressError = require("./utils/ExpressError.js")


module.exports.isLoggedIn=(req,res,next)=>{
      // in req
    console.log(req.path,"..",req.originalUrl); // in which the path that user want to go is give in the req object
    // that helps us to get the user at that path after log in

    //check the user is logged in? if Y then render required .ejs file
    if (!req.isAuthenticated()) {

        //redirectUrl Save
        req.session.redirectUrl=req.originalUrl; 
        req.flash("error","You must be logged in!");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();

}
module.exports.isOwner= async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    //aurthorization
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error','You dont have access to listing')
       return res.redirect(`/listings/${id}`);
    }
    next();
}


// Using joy as a middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        // throw new ExpressError(404,error);
        // ----orr---
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    else {
        next();
    }
}

//Validating reviews from server side by usning joy middleware
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        // throw new ExpressError(404,error);
        // ----orr---
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    else {
        next();
    }

}

module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id, reviewId } = req.params;
    let review= await Review.findById(reviewId);
    
    //aurthorization
console.log();
if (!(res.locals.currUser==undefined)) {
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash('error','You are not author of the review')
       return res.redirect(`/listings/${id}`);
    }
}
else{
    req.flash('error','You are not author of the review')
    return res.redirect(`/listings/${id}`);
}
    next();
}