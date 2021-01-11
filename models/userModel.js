var mongoose = require('mongoose');

    var favoritesPlacesSchema = mongoose.Schema({
        date : Date,
        name:String,
        category:String,
        adress:String,
        type:String,
        city: String, 
        postcode:String,
        lat:Number, 
        lon:Number,
        googleIdPlace:String,
        icon:String,
        contact:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    });

    var adressSchema = mongoose.Schema({
        name : String,
        tel:String,
        mail:String,
        adress:String,
        type:String,
        postcode:String,
        city:String,
        lat:Number, 
        lon:Number,
        isFavorite:String,

    });


var userSchema = mongoose.Schema({
    pseudo : String,
    email:String,
    password:String,
    token:String,
    salt:String,
    trackingID:String,
    adress: String, 
    city:String,
    postcode:String,
    lat:Number, 
    lon:Number,
    contactInt:[adressSchema],
    contact:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    favoritesplaces:[favoritesPlacesSchema]
});


var userModel = mongoose.model('users', userSchema);

module.exports=userModel;