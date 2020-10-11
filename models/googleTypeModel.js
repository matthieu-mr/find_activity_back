var mongoose = require('mongoose');


var googleTypeSchema = mongoose.Schema({
    google_label : String,
    setAffichageSortie:Boolean,
    wording_fr:String,
    category: String, 
    category_fr:String, 
});


var googleTypeModel = mongoose.model('googletypes', googleTypeSchema);

module.exports=googleTypeModel;