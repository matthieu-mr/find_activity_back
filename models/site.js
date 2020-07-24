var mongoose = require('mongoose');


var gpsSchema = mongoose.Schema({
    0:Number,
    1:Number,
    });
    
var fieldsSchema = mongoose.Schema({
    insnumeroinstall:Number,
    equipementid:Number,
    equipementtypelib:String,
    utilisateurs:String,
    naturelibelle:String,
    actnivlib:String,
    typeerp:String,
    comlib:String,
    equnbequidentique:Number,
    deplib:String,
    actlib:String,
    utilisation:String,
    equipementtypecode:String,
    cominsee:Number,
    actcode:Number,
    inscodepostal:Number,
    insnom:String,
    depcode:Number,
    famille:String,
    inslibellevoie:String,
    gps:[gpsSchema],
});




var siteSchema = mongoose.Schema({
    datasetid : String,
    recordid:String,
    fields:String,
    geometry:String,
    record_timestamp:String,
    fields:fieldsSchema,
    record_timestamp:Date,
});



var siteModel = mongoose.model('liste', siteSchema);

module.exports=siteModel;