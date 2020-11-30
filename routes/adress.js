var express = require('express');
var router = express.Router();

var request = require('sync-request');
// Require the framework and instantiate it
const app = express();



//recherche des adresses via lat & long
router.get('/',async function(req, res, next) {
adress="helllo adress"
    res.json({adress});
  });



router.post('/getrdvpoint',  function(req, res, next) {
  /* 

  adress moa : 16 rue saint hilaire 
 [48.792554,2.513751]


maman : 
 [48.797556,2.482743]

saint paris : 243 rue de bercy,75012
  lat = 48.84715175285345
lon = 2.368497848510742


la mamie 
[48.80666,2.486434]

  adress moa : 16 rue saint hilaire 
 [48.792554,2.513751]


kev1
[48.851496,2.507546]

thibs
[48.84402,2.296319]

pat 
[48.835927,2.726672]


let listAdressArray = [
  [48.792554,2.513751],
  [48.84402,2.296319],
  [48.851496,2.507546],
  [48.835927,2.726672],
]
*/

let listAdressArray2 = []
let adressFromFront = JSON.parse(req.body.info)
console.log(req.body)


adressFromFront.map((item,i)=>{

  let value=[item.lat,item.lon]
  console.log(value)
  listAdressArray2.push(value)
})




let x =0
let y = 0
let z =0
let total =0

listAdressArray2.map((item,i)=>{

  total = total +1
  var latitude = item[0] * Math.PI / 180;
  var longitude = item[1] * Math.PI / 180;

  x = x + (Math.cos(latitude) * Math.cos(longitude))
  y = y + (Math.cos(latitude) * Math.sin(longitude))
  z = z + Math.sin(latitude)
})

x = x / total;
y = y / total;
z = z / total;

var centralLongitude = Math.atan2(y, x);
var centralSquareRoot = Math.sqrt(x * x + y * y);
var centralLatitude = Math.atan2(z, centralSquareRoot);

let finalLatitude=(centralLatitude * 180 )/ Math.PI
let finalLongitude=(centralLongitude * 180) / Math.PI

var list = request('GET', `https://api-adresse.data.gouv.fr/reverse/?lon=${finalLongitude}&lat=${finalLatitude}`)
var response = JSON.parse(list.getBody())




let finalAdress = {
  name: 'Point central',
  adress:response.features[0].properties.name,
  city:response.features[0].properties.city,
  postCode:  response.features[0].properties.postcode,
  lat:finalLatitude,
  lon:finalLongitude
}

res.json(finalAdress);
  });



  router.post('/coords',  function(req, res, next) {
    
  //Un point WGS84 et une distance en mètres pour le géopositionnement

  let adress =req.body.adress


  let adressModif = adress.replace(/ /g, '+');

  // Liste des activités hors licence etc ...
  var list = request('GET', `https://api-adresse.data.gouv.fr/search/?q=${adressModif}&limit=20`)
  var response = JSON.parse(list.getBody())

  var result = response.features
  res.json(result);
    });
   

//recherche des adresses via lat & long
router.post('/adressesListCoord',async function(req, res, next) {

  let lon = req.body.lon
  let lat = req.body.lat
  
    // Liste des activités hors licence etc ...
    var list = request('GET', `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`)
    var response = JSON.parse(list.getBody())
  
    let name = response.features[0].properties.name
    let postCode = response.features[0].properties.postcode
    let city =response.features[0].properties.city
    let adress = name + ','+ postCode + ','+city
    res.json({adress,response});
  });


  module.exports = router;