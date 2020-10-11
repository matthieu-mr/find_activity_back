var mongoose = require('mongoose');

var favoritesPlacesSchema = mongoose.Schema({
        date : Date,
        nom:String,
        category:String,
        type:String,
        adress: String, 
        latitude:Number, 
        longitude:Number,
        googleIdPlace:String,
        contact:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    });



var userSchema = mongoose.Schema({
    pseudo : String,
    email:String,
    password:String,
    token:String,
    salt:String,
    trackingID:String,
    adress: String, 
    latitude:Number, 
    longitude:Number, 
    contact:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    favoritesplaces:[favoritesPlacesSchema]
});


var userModel = mongoose.model('users', userSchema);

module.exports=userModel;