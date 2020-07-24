var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
    nom : String,
});


var testModel = mongoose.model('test', testSchema);

module.exports=testModel;