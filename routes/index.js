var express = require('express');
var router = express.Router();
var request = require('sync-request');





/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});


// Type d'activite (onterieur etc ....)
router.post('/nature',async function(req, res, next) {

  console.log(req.body)

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = 48.866667
  let longitude = 2.333333
  let distance = 100000
  let nbActivity = 0 ;
  let distAround = distance + " metres";

  // Liste des activités hors licence etc ...

  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=100&facet=naturelibelle&refine.utilisateurs=Individuel(s)+%2F+Famille(s)&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)
  var response = JSON.parse(list.getBody())
  var result = response.facet_groups[1]
  
  let resultFiltered =result.facets
let total = 0
 

 let mefListFirstLetter = resultFiltered.map ((item,i)=>{
  console.log(item.name)
  item.state=true
  total = total + item.count
})


if (distance>999){
  calcDistAround = distance / 1000;
  distAround = calcDistAround + " Km"
}
res.json({resultFiltered,total});

});




// Liste de tous les sports disponibles
router.post('/sportlist',async function(req, res, next) {

  console.log("recup requete",req.body)


  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = 48.866667
  let longitude = 2.333333
  let distance = 10000



  //let latitude = req.body.lat
  //let longitude = req.body.long
  //let distance = 1000

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

// recuperation premieres lettres
let mefList = []

let mefListFirstLetter = result.map ((item,i)=>{
  lettre =item.name.split("",1)
  nLettre =`lettre[0]`
  //mefList=mefList+{nLettre}
 mefList.push(lettre[0])
 item.first_letter = lettre[0]
})

res.json({result,resultat});
});


// Rechgerche par sport
router.post('/sport',async function(req, res, next) {

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


//recherche des adresses
router.get('/adressesList',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let adress = "8 bd du port"

  // Liste des activités hors licence etc ...

  var list = request('GET', `https://api-adresse.data.gouv.fr/search/?q=${adress}`)
  var response = JSON.parse(list.getBody())

  var result = response


  console.log(result)
  res.json({result});
});


//recherche des adresses via lat & long
router.post('/adressesListCoord',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let lon = 2.37
  let lat = 48.357

  // Liste des activités hors licence etc ...

  var list = request('GET', `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`)
  var response = JSON.parse(list.getBody())

  var result = response


  console.log(result)
  res.json({result});
});


//recuperation des points map
router.post('/listpoint',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = 48.866667
  let longitude = 2.333333
  let distance = 1000000

  // Liste des activités hors licence etc ...

  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&facet=actlib&rows=100&facet=naturelibelle&facet=utilisation&facet=utilisateurs&facet=famille&geofilter.distance=${latitude}%2C${longitude}%2C${distance}`)
  var response = JSON.parse(list.getBody())

  var result = response.records

  res.json({result});
});


//filtrage par type d'activite

router.post('/filteredType',async function(req, res, next) {

//  console.log("recup requete",req.body)
  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = 48.866667
  let longitude = 2.333333
  let distance = 10000
// let natureActivite = encodeURI("Intérieur");

//  let latitude = req.body.lat
 // let longitude = req.body.long
 // let distance = 1000
   let natureRaw = req.body.type
  let natureJoin = natureRaw.replace(/ /g, "+")
  let natureActivite = encodeURI(natureJoin);


  console.log("mon encodage",natureActivite,'leur encodage ----  Site+naturel+am%C3%A9nag%C3%A9')

  // Liste des activités hors licence etc ...

  var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=1000&&geofilter.distance=${latitude}%2C${longitude}%2C${distance}&refine.naturelibelle=${natureActivite}`)

  
  var response = JSON.parse(list.getBody())
  var result = response.records
  console.log(response)

res.json({result});
});

//recuperation des informations de google place
router.post('/pointinformation',async function(req, res, next) {

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let latitude = 48.86701
  let longitude = 2.35399
  let distance = 1000000
  let name ="petanque"

/*

https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo
  &key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo


                      "actnivlib": "Loisir - Entretien - Remise en forme",
                    "equipementtypelib": "Terrain de pétanque",
                    "dist": "1511.44144296",
                    "insnovoie": "93 BIS",
                    "utilisation": "Récréation sportive",
                    "insarrondissement": 75103,
                    "actcode": 6001,
                    "famille": "Boulodrome",
                    "naturelibelle": "Découvert",
                    "equnbequidentique": 1,
                    "deplib": "Paris",
                    "insnom": "Square Emile Chautemps",
                    "depcode": 75,
                    "gps": [
                        48.86701,
                        2.35399
                    ],

*/



  // Liste des activités hors licence etc ...

  var listRaw = request('GET', `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${name}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry,place_id,icon&locationbias=point:${latitude},${longitude}&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo`)
  var response = JSON.parse(listRaw.getBody())

  var placeId = response.candidates[0].place_id

  //https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name,rating,formatted_phone_number&key=YOUR_API_KEY
// get place details 
  var detailRaw = request('GET', `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component,adr_address,business_status,formatted_address,geometry,icon,name,photo,place_id,formatted_phone_number,international_phone_number,opening_hours,website,price_level,rating,review,user_ratings_total&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo`)
  var responseDetailRaw = JSON.parse(detailRaw.getBody())
  var responseDetail=responseDetailRaw.result
  
  res.json({responseDetail});
});


module.exports = router;
