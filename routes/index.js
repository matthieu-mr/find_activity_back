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
  let distance = 100
  let nbActivity = 0 ;
  let distAround = distance + " metres";

  // Liste des activités hors licence etc ...

  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=100&facet=naturelibelle&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)
  var response = JSON.parse(list.getBody())
  var result = response.facet_groups[1]
  

  let nbActivityMap = result.facets.map ((item,i)=>{
    nbActivity += item.count
  })


if (distance>999){
  calcDistAround = distance / 1000;
  distAround = calcDistAround + " Km"
}

  res.json({result,nbActivity:nbActivity,distAround:distAround});
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
  var result = response.facet_groups[1].facets

//Tri de la list
result.sort(function(a,b){
  //return a.attributes.OBJECTID - b.attributes.OBJECTID;
  if(a.name == b.name)
      return 0;
  if(a.name < b.name)
      return -1;
  if(a.name > b.name)
      return 1;
});

let mefList = []

let mefListFirstLetter = result.map ((item,i)=>{
  lettre =item.name.split("",1)
  mefList.push(lettre)
})

result.map ((item,i)=>{
  let nbLettre = mefList.length ; 
  let lettre =item.name.split("",1)
  
  for (let i = 0 ; i<nbLettre; i++){
    if (lettre[0] == mefList[i][0]){
      console.log("resultat trouvé",item.name,"===",lettre," <=====>",mefList[i] )
    }else {
     // console.log('nada')
    }
  }

})







res.json({mefList});
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
