var express = require('express');
var router = express.Router();
var request = require('sync-request');

var Mixpanel = require('mixpanel');
var mailchimp =require ("@mailchimp/mailchimp_marketing")

var mixpanel = Mixpanel.init('1d67b29ef426e799247c489e8e854a74');

let mixpanelEvent = () => {

  let userIdMixpanel = "13793"
  let event = "tennis" 
  let value1 ="94"

  mixpanel.track('click', {
    distinct_id: userIdMixpanel,
    $current_url:"list sport",
    sport: event,
    dept: value1,
});

mixpanel.track('screen', {
  distinct_id: userIdMixpanel,
  $current_url:"list sport",
  sport: event,
  dept: value1,
  });
}


/* GET home page. */
router.get('/', function(req, res, next) {
  // Create or update a user in Mixpanel
  mixpanelEvent()

/*
mixpanel.people.set('13793', {
  $first_name: 'Matthieu',
  $last_name: 'Michon',
  $created: (new Date('jan 1 2013')).toISOString(),
  plan: 'premium'
});

*/
  res.render('index', { title: 'hello' });
});

// 48.7926622, 2.5134926,5000



// Type d'activite (onterieur etc ....)
router.post('/nature',async function(req, res, next) {
  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let lat = req.body.lat
  let lon = req.body.long
  let dist = req.body.dist
  let type = req.body.type

// 48.7927087,2.5133559,10000
/*
  lat = 48.7927087
  lon = 2.5133559
  dist = 10000
  type = "Découvrables"
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


// calc nb site total
let oldequipementtypecode
let nbsiteTotal = 0

let nbSiteMap = response.records.map((item)=>{

  if (item.fields.equipementid!==oldequipementtypecode ){
    nbsiteTotal++
    oldequipementtypecode=item.fields.equipementid
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
    if (item.name ===type){
      item.state=true
    } else {
      item.state=false
    }
    item.equipementtypecode=[]
  })
  
// add type code
let baseBoucle = response.records

resultFiltered.map((item,i)=> {  
  for (let i =0 ;i<baseBoucle.length;i++ ){
    resultFiltered[0].equipementtypecode.push(baseBoucle[i].fields.equipementid)
    if (baseBoucle[i].fields.naturelibelle == item.name){
      item.equipementtypecode.push(baseBoucle[i].fields.equipementid)
    }
  }
})

resultFiltered.map((item,i)=>{
  let uniqValue = new Set(item.equipementtypecode)
  const arrayValue = [...uniqValue]
  item.equipementtypecode = arrayValue
  item.nbSite = arrayValue.length
})


res.json({resultFiltered,response});

});




// Liste de tous les sports disponibles
router.post('/sportlist',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = req.body.lat
  let longitude = req.body.long
  let distance = Number(req.body.dist)
  let typeActivity = req.body.type

 /* 
  latitude = 48.7926622
  longitude =  2.5134926
   distance = 1000
   //typeActivity = "Intérieur"
   typeActivity = "Découvert"
  // typeActivity = "Toutes"
*/



  let natureJoin = typeActivity.replace(/ /g, "+")
  let natureActivite = encodeURI(natureJoin);

  let result 
  let resultat

  if (typeActivity == "Toutes" || typeActivity=="undefined" ){
   
    var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&facet=actlib&facet=naturelibelle&facet=utilisation&facet=utilisateurs&facet=famille&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)
    var response = JSON.parse(list.getBody())
     result = response.records
     resultat =response.facet_groups[1].facets
  
  }else {
    var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&facet=actlib&facet=naturelibelle&facet=utilisation&facet=utilisateurs&facet=famille&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&refine.naturelibelle=${natureActivite}&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)
        
    var response = JSON.parse(list.getBody())
    result = response.records
    resultat =response.facet_groups[1].facets
  }


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


res.json({result,response,resultat});
});


// Rechgerche par sport
router.post('/sport',async function(req, res, next) {


   //Un point WGS84 et une distance en mètres pour le géopositionnement


  let latitude = req.body.lat
  let longitude = req.body.long
  let distance = Number(req.body.dist)
  let sport = req.body.sport
  let typeActivity = req.body.type

/*
  latitude = 48.7926622
  longitude =  2.5134926
   distance = 1000
   sport = "Tennis"
   typeActivity = "Toutes"
*/


  let sportJoin = sport.replace(/ /g, "+")
  let sportActivite = encodeURI(sportJoin);

  let natureJoin = typeActivity.replace(/ /g, "+")
  let natureActivite = encodeURI(natureJoin);


  var result 

  if (typeActivity == "Toutes" || typeActivity=="undefined" ){
    var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=10000&facet=actlib&facet=naturelibelle&facet=utilisation&facet=utilisateurs&facet=famille&refine.utilisation=R%C3%A9cr%C3%A9ation+sportive&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&refine.actlib=${sportActivite}&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)
    var response = JSON.parse(list.getBody())
     result = response.records

  }else {
    // Liste des activités hors licence etc ...
    var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&facet=actlib&facet=naturelibelle&facet=utilisation&facet=utilisateurs&facet=famille&refine.actlib=${sportActivite}&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&refine.naturelibelle=${natureActivite}&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)
    var response = JSON.parse(list.getBody())
    result = response.records
  }



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
  let lat = req.body.lat
  let lon = req.body.long
  let dist = Number(req.body.dist)
  let typeActivityRaw = req.body.type


/*
lat = 48.7927087
lon = 2.5133559
//typeActivityRaw ="Toutes"

dist=5000
*/

  let natureJoin = typeActivityRaw.replace(/ /g, "+")
  let natureActivite = encodeURI(natureJoin);


let result

if (typeActivityRaw == "Toutes" || typeActivityRaw==undefined ){
 
  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=10000&facet=naturelibelle&facet=utilisation&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${lat}%2C${lon}%2C${dist}`)
  var response = JSON.parse(list.getBody())
  result = response.records
}else {
  // Liste des activités hors licence etc ...
  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=10000&facet=naturelibelle&facet=utilisation&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&refine.naturelibelle=${natureActivite}&geofilter.distance=${lat}%2C+${lon}%2C${dist}`)
  var response = JSON.parse(list.getBody())
  result = response.records
}
  // Liste des activités hors licence etc ...

  res.json({result});
});


//filtrage par type d'activite

router.post('/filteredType',async function(req, res, next) {
  
  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let lat = req.body.lat
  let long = req.body.long
  let dist = req.body.dist
  let type = req.body.type
   
  let natureJoin = type.replace(/ /g, "+")
  let natureActivite = encodeURI(natureJoin);
/*
lat = 48.7927087
lon = 2.5133559
dist = 1000
typeActivity ="Toutes"
*/
  
  // Liste des activités hors licence etc ...
  if (type == "Toutes" || type==undefined){
    
    var list = request('GET', ` https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=10000&facet=naturelibelle&facet=utilisation&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${lat}%2C${long}%2C${dist}`)
    var response = JSON.parse(list.getBody())
    result = response.records
  }else {
    // Liste des activités hors licence etc ...
    var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=10000&facet=naturelibelle&facet=utilisation&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&refine.naturelibelle=${natureActivite}&geofilter.distance=${lat}%2C+${long}%2C${dist}`)
    var response = JSON.parse(list.getBody())
     result = response.records
  }



res.json({result});
});

//recuperation des informations de google place
router.post('/pointinformation',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = req.body.lat
  let longitude = req.body.lon
  //let distance = 1000000
  let name =req.body.name

 // let placeId = "ChIJcc4MrKYM5kcRy6N7Jcg1nC8"
let placeId = false

  let responseDetail = undefined
  let existe = false
 
  // placeId ='ChIJ4fq5yTmcCUgR0X7sruAW7CE'
  /*
  latitude = '48.800065',
  longitude = '2.53302',
  name= 'Forme Forest',
  placeId = 'false'
  */
// remplacer espace par %20 + ! accent

// pas de photo :   "place_id": "ChIJcc4MrKYM5kcRy6N7Jcg1nC8",


String.prototype.sansAccent = function(){
  var accent = [
      /[\300-\306]/g, /[\340-\346]/g, // A, a
      /[\310-\313]/g, /[\350-\353]/g, // E, e
      /[\314-\317]/g, /[\354-\357]/g, // I, i
      /[\322-\330]/g, /[\362-\370]/g, // O, o
      /[\331-\334]/g, /[\371-\374]/g, // U, u
      /[\321]/g, /[\361]/g, // N, n
      /[\307]/g, /[\347]/g, // C, c
  ];
  var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c']; 
  var str = this;
  for(var i = 0; i < accent.length; i++){
      str = str.replace(accent[i], noaccent[i]);
  }
   
  return str;
}


let nameModif = name.sansAccent() 

  if(placeId == false || placeId=="false"){
    var listRaw = request('GET', `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${nameModif}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry,place_id,icon&locationbias=point:${latitude},${longitude}&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo`)
    var response = JSON.parse(listRaw.getBody())
    placeId = response.candidates[0].place_id
  }

  // Liste des activités hors licence etc ...
  let detailRaw = request('GET', `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=fr&fields=address_component,adr_address,business_status,formatted_address,geometry,icon,name,photo,place_id,formatted_phone_number,international_phone_number,opening_hours,website,price_level,rating,review,user_ratings_total&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo`)
  let responseDetailRaw = JSON.parse(detailRaw.getBody())
  responseDetail=responseDetailRaw.result


// get place details 


  res.json({existe,responseDetail});
});


module.exports = router;
