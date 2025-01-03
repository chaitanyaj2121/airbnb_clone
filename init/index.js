const initData=require("./data.js");

const Listing=require("../models/listing.js");

// Database connection
const mongoose=require("mongoose");

main()
.then(()=>{console.log("Connection To DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hms');
}


const initDB=async () => {
    await Listing.deleteMany({});
    // Adding the owner obj to each object in the data
    initData.data=initData.data.map((obj)=>({ ...obj, owner:"6728f9abc40224353eb3a9c0"}))
    await Listing.insertMany(initData.data);

    console.log("Database was initialized");
}
initDB();