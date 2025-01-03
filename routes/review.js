const express= require("express");

//mergeParams:true if you not add this (req.params.id) we will getting the value of this is undefined
// 
const router=express.Router({mergeParams:true});

//require wrapAsnc.js from utils
const wrapAsync = require("../utils/wrapAsync.js");

//require Schema.js 
let { reviewSchema} = require("../schema.js");

//require ExpressError.js from utils
const ExpressError = require("../utils/ExpressError.js")

//Taking Review Schema from review.js
const Review = require("../models/review.js");

const Listing = require("../models/listing.js");
const { isLoggedIn,validateReview, isReviewAuthor} = require("../middlewares.js");



// -----------------------------------------Reviews---------------------------------------------

//  for routing we delete common part her commnon part before routing is 
// /listings/:id/reviews in both methods post and delete
//Reviews post Route

router.post("/",validateReview,isLoggedIn,wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
      newReview.author=req.user._id;   
    //   console.log(newReview);
       await newReview.save();
       req.flash("success","New review created Successfully!");
    listing.reviews.push(newReview);
    await listing.save();
  
    // console.log("New review saved");
    // res.send("New review was saved");
    res.redirect(`/listings/${req.params.id}`)

}));

//Delete Route 
router.delete("/:reviewId",isReviewAuthor,isLoggedIn,wrapAsync( async (req,res) => {
     let {id,reviewId}=req.params;
    let delR= await Review.findByIdAndDelete(reviewId);

    // by using pull we find the specific review and delete it 
    req.flash("success","Review deleted Successfully!");
    await Listing.findByIdAndUpdate(id,{$pull:{ reviews:reviewId}});
    res.redirect(`/listings/${id}`); 
     
}))


module.exports=router;
