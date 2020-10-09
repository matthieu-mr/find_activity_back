var express = require('express');
var router = express.Router();

var request = require('sync-request');
// Require the framework and instantiate it
const app = express();


router.get('/',  function(req, res, next) {
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

  */

let array1 = [
  [48.792554,2.513751],
  [48.84402,2.296319],
  [48.851496,2.507546],
  [48.835927,2.726672],
]

let info = [
  [48.792554,2.513751],
  [48.84402,2.296319],
  [48.84571143,2.47587204],
  [48.835927,2.726672]
]

let x =0
let y = 0
let z =0
let total =0

array1.map((item,i)=>{

  total = total +1
  var latitude = item[0] * Math.PI / 180;
  var longitude = item[1] * Math.PI / 180;
//  console.log("lat = ",latitude,"lon =",latitude )

  x = x + (Math.cos(latitude) * Math.cos(longitude))
  y = y + (Math.cos(latitude) * Math.sin(longitude))
  z = z + Math.sin(latitude)
  console.log("total",total,"----",x,"----",y,"-----",z)
})

x = x / total;
y = y / total;
z = z / total;

var centralLongitude = Math.atan2(y, x);
var centralSquareRoot = Math.sqrt(x * x + y * y);
var centralLatitude = Math.atan2(z, centralSquareRoot);

let finalLatitude=(centralLatitude * 180 )/ Math.PI
let finalLongitude=(centralLongitude * 180) / Math.PI

console.log(finalLatitude,finalLongitude)

var list = request('GET', `https://api-adresse.data.gouv.fr/reverse/?lon=${finalLongitude}&lat=${finalLatitude}`)
var response = JSON.parse(list.getBody())


let name = response.features[0].properties.name
let postCode = response.features[0].properties.postcode
let city =response.features[0].properties.city
let adress = name + ','+ postCode + ','+city


console.log("lat = ", finalLatitude,",",finalLongitude )

res.json(response);
  });



  router.post('/coords',  function(req, res, next) {
    
  //Un point WGS84 et une distance en mètres pour le géopositionnement

  let adress =req.body.adress


  let adressModif = adress.replace(/ /g, '+');

  // Liste des activités hors licence etc ...
  var list = request('GET', `https://api-adresse.data.gouv.fr/search/?q=${adressModif}&limit=50`)
  var response = JSON.parse(list.getBody())

  var result = response.features
  // console.log(result)
  res.json(result);
    });
   
  

  module.exports = router;