var express = require('express');
var router = express.Router();
var request = require('sync-request');





/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});



router.get('/nature',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = 48.866667
  let longitude = 2.333333
  let distance = 10000

  // Liste des activités hors licence etc ...

  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=100&facet=naturelibelle&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)

  var response = JSON.parse(list.getBody())

  var result = response.facet_groups[1]


  console.log(result)
  res.json({result});
});




// Liste de tous les sports disponibles
router.get('/sportlist',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = 48.866667
  let longitude = 2.333333
  let distance = 10000

  // Liste des activités hors licence etc ...

  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=100&facet=famille&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)

  var response = JSON.parse(list.getBody())

  var result = response.facet_groups[1]


  console.log(result)
  res.json({result});
});


// Rechgerche par sport
router.get('/sport',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = 48.866667
  let longitude = 2.333333
  let distance = 10000
  let sport = 'Boulodrome'
  // Liste des activités hors licence etc ...

  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=100&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&refine.famille=${sport}&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)




  var response = JSON.parse(list.getBody())

  var result = response


  console.log(result)
  res.json({result});
});














module.exports = router;
