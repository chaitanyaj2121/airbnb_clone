const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})

    res.render("./listings/index.ejs", { allListings })
    console.log("Listing Success!");

};
module.exports.newRoute = (req, res) => {

    if (req.isAuthenticated()) {
        console.log(req.user);   // Gives the info of user
        res.render("./listings/new.ejs");
        console.log("form is sent to fill");
    }

}
module.exports.showRoute = async (req, res) => {
    let { id } = req.params;

    //populate gives all the info from the id
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exists!");
        res.redirect("/listings")
    }
    else {
        res.render("./listings/show.ejs", { listing })
    }
    // console.log(listing);
};

module.exports.createListing = async (req, res, next) => {
    // console.log("From filled data:",req.body)
    let { title, description, price, location, country } = req.body;
    let responce = await geocodingClient
    .forwardGeocode({
        query: location,
        limit: 1,
    })
        .send();
//    console.log(responce.body.features[0].geometry);

    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    let newListing = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
    })
    // res.send("Done!");

    newListing.image = { url, filename };
    newListing.owner = req.user._id;
    newListing.geometry=responce.body.features[0].geometry;

   let savedListing= await newListing.save();
   console.log(savedListing);
   
    req.flash("success", "New listing created");
    res.redirect("/listings");
    console.log("Form is filled success");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exists!");
        res.redirect("/listings")
    }
    if (req.isAuthenticated()) {
        res.render("./listings/edit.ejs", { listing });
    }
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;

    // if you writte return then it will not execute the below code

    let listing = await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,

    }, { new: true, runValidators: true })

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    if (req.isAuthenticated()) {
        let delR = await Listing.findByIdAndDelete(req.params.id);
        req.flash("success", "Listing deleted Successfully!");
        console.log("Deletion listing result:", delR);
        res.redirect("/listings")
    }
}
