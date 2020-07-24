var express = require('express');
var router = express.Router();
var request = require('sync-request');





/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});



router.get('/individuel',async function(req, res, next) {

  // Liste des activités hors licence etc ...

  var list = request('GET', "https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&facet=actlib&facet=naturelibelle&facet=utilisation&facet=utilisateurs&facet=famille&refine.utilisateurs=Individuel(s)+%2F+Famille(s)")

  var response = JSON.parse(list.getBody())
  res.json({response});
});





module.exports = router;
