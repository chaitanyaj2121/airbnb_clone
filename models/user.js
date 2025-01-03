const { string, required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");


//Here we are only defining email becuase passlocalmongoose will add it automatically

const userSchema=new Schema({
        email:{
            type:String,
            required:true
        },

});     

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

