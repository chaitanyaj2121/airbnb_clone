const Listing = require("../models/listing");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({})
    
    res.render("./listings/index.ejs", { allListings })
    console.log("Listing Success!");

};

module.exports.newRoute=isLoggedIn ,(req, res) => {

    if (req.isAuthenticated()) {
        console.log(req.user);   // Gives the info of user
        res.render("./listings/new.ejs");
        console.log("form is sent to fill");
    }
   
}