var mongoose = require('mongoose');

var options = {
connectTimeoutMS: 5000,
useNewUrlParser: true,
useUnifiedTopology : true
}

mongoose.connect('mongodb+srv://mmr:Revenga94@cluster0-pg57n.mongodb.net/SiteSport?retryWrites=true&w=majority',
options,
function(err) {
console.log(err);
}
);