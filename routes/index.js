var express = require('express');
var router = express.Router();
var request = require('sync-request');





/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'hello' });
});

// 48.7926622, 2.5134926,5000



// Type d'activite (onterieur etc ....)
router.post('/nature',async function(req, res, next) {
  console.log("req.body nature",req.body)
  //Un point WGS84 et une distance en mètres pour le géopositionnement

  let lat = req.body.lat
  let lon = req.body.long
  let dist = req.body.dist
 let type = req.body.type
 // let nbActivity = 0 ;
/*
lat = 48.7927087
lon = 2.5133559
dist = 1000
*/


  let distAround = dist + " metres";


  // Liste des activités hors licence etc ...
  
  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=10000&facet=naturelibelle&facet=utilisation&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${lat}%2C${lon}%2C${dist}`)

  
  var response = JSON.parse(list.getBody())
  var result = response.facet_groups[2]
  
  let resultFiltered =result.facets
  let total = response.nhits

 
if (dist>999){
  calcDistAround = dist / 1000;
  distAround = calcDistAround + " Km"
}


let test = response.records


// calc nb site total
let oldequipementtypecode
let nbsiteTotal = 0

let nbSiteMap = response.records.map((item)=>{
  if (item.fields.equipementtypecode!==oldequipementtypecode ){
    nbsiteTotal++
    oldequipementtypecode=item.fields.equipementtypecode
  }
})


let allResult =resultFiltered.unshift({ 
  "count": total,
  "path": "Toutes",
  "state": "false",
  "name": "Toutes",
  "nbSite":nbsiteTotal})
  
  // Affichage liste appli true / false checked
  resultFiltered.map((item,i)=>{
    if (item.name ==type){
      item.state=true
   
      item.equipementtypecode=[]
    } else {
      item.state=false,
  
      item.equipementtypecode=[]
    }
   
  })
  

let baseBoucle = response.records

let countNbSite = resultFiltered.map((item,i)=> {
  console.log(item)

  

  for (let i =0 ;i<baseBoucle.length;i++ ){
    resultFiltered[0].equipementtypecode.push(baseBoucle[i].fields.equipementtypecode)
    if (baseBoucle[i].fields.naturelibelle == item.name){
      item.equipementtypecode.push(baseBoucle[i].fields.equipementtypecode)
    }
  }
})





res.json({resultFiltered,total});

});




// Liste de tous les sports disponibles
router.post('/sportlist',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = req.body.lat
  let longitude = req.body.long
  let distance = req.body.dist


  // Liste des activités hors licence etc ...

  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&facet=actlib&facet=naturelibelle&facet=utilisation&facet=utilisateurs&facet=famille&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)
  var response = JSON.parse(list.getBody())
  var result = response.facet_groups[1].facets
  var resultat =response.facet_groups[1]


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


res.json({result,resultat});
});


// Rechgerche par sport
router.post('/sport',async function(req, res, next) {


   //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = req.body.lat
  let longitude = req.body.lon
  let distance = req.body.dist
  let sport = req.body.sport

  //let sport = "Aquagym"

  let sportJoin = sport.replace(/ /g, "+")
  let sportActivite = encodeURI(sportJoin);

  // Liste des activités hors licence etc ...

  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&facet=actlib&facet=naturelibelle&facet=utilisation&facet=utilisateurs&facet=famille&refine.actlib=${sportActivite}&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)
    
    var response = JSON.parse(list.getBody())
    var result = response.records
  res.json({result});
});


//recherche des adresses
router.post('/adressesList',async function(req, res, next) {
  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let adress =req.body.adress
  let adressModif = adress.replace(/ /g, '+');

  // Liste des activités hors licence etc ...
  var list = request('GET', `https://api-adresse.data.gouv.fr/search/?q=${adressModif}&limit=15`)
  var response = JSON.parse(list.getBody())

  var result = response.features
  res.json({result});
});


//recherche des adresses via lat & long
router.post('/adressesListCoord',async function(req, res, next) {

let lonCon = req.body.long
let latCon = req.body.lat

  // Liste des activités hors licence etc ...

  var list = request('GET', `https://api-adresse.data.gouv.fr/reverse/?lon=${lonCon}&lat=${latCon}`)
  var response = JSON.parse(list.getBody())


  let name = response.features[0].properties.name
  let postCode = response.features[0].properties.postcode
  let city =response.features[0].properties.city
  let adress = name + ','+ postCode + ','+city

  res.json({adress});
});


//recuperation des points map
router.post('/listpoint',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = req.body.lat
  let longitude = req.body.long
  let distance = req.body.dist


  latitude = 48.7927087
  longitude = 2.5133559
  distance = 1000



  // Liste des activités hors licence etc ...

  var list = request('GET', ` https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=10000&facet=naturelibelle&facet=utilisation&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)
  
   
  var response = JSON.parse(list.getBody())
  var result = response.records

  res.json({result});
});


//filtrage par type d'activite

router.post('/filteredType',async function(req, res, next) {
  
  console.log('recup in',req.body)

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let lat = req.body.lat
  let long = req.body.long
  let dist = req.body.dist

  let natureRaw = req.body.type
  let natureJoin = natureRaw.replace(/ /g, "+")
  let natureActivite = encodeURI(natureJoin);

  
  // Liste des activités hors licence etc ...

  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=10000&facet=naturelibelle&facet=utilisation&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&refine.naturelibelle=${natureActivite}&geofilter.distance=${lat}%2C+${long}%2C${dist}`)
  
  var response = JSON.parse(list.getBody())

  var result = response.records




res.json({result});
});

//recuperation des informations de google place
router.post('/pointinformation',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = req.body.lat
  let longitude = req.body.lon
  //let distance = 1000000
  let name =req.body.name


  // Liste des activités hors licence etc ...

  var listRaw = request('GET', `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${name}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry,place_id,icon&locationbias=point:${latitude},${longitude}&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo`)
  var response = JSON.parse(listRaw.getBody())

let placeId
let responseDetail = undefined
let existe = false

if (response.candidates[0] == undefined){
  
}else {
  existe = true

  placeId = response.candidates[0].place_id
  let detailRaw = request('GET', `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component,adr_address,business_status,formatted_address,geometry,icon,name,photo,place_id,formatted_phone_number,international_phone_number,opening_hours,website,price_level,rating,review,user_ratings_total&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo`)
  let responseDetailRaw = JSON.parse(detailRaw.getBody())
  responseDetail=responseDetailRaw.result
}


// get place details 


  res.json({existe,response,responseDetail});
});


module.exports = router;
