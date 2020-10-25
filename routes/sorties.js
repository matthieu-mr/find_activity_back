var express = require('express');
var router = express.Router();

var request = require('sync-request');
// Require the framework and instantiate it
const app = express();

var googleTypeModel = require('../models/googleTypeModel')

router.get('/',  function(req, res, next) {
        let response = "hello from sortie"
    res.json(response);
});

router.get('/typegoogle',async function(req, res, next) {
        let result = await googleTypeModel.find();
        
        let showCatergory = []
        let listCategory = []
       
        result.map((item,i) =>{
            if (item.setAffichageSortie == true){
                item.category_fr = item.category_fr.charAt(0).toUpperCase()+item.category_fr.substr(1)
                item.wording_fr = item.wording_fr.charAt(0).toUpperCase()+item.wording_fr.substr(1)
                item.setAffichageSortie = false

                showCatergory.push(item)
                let info ={category_fr:item.category_fr,setAffichageSortie:false,nb_activity:0}
                listCategory.push(info)
            }
        })

        
listCategory.sort(function compare(a, b) {
  if (a.category_fr < b.category_fr)
     return -1;
  if (a.category_fr > b.category_fr )
     return 1;
  return 0;
});

let valueActivity =""
let nbTypeActivity =0
let categoryList = []

listCategory.map((item,i)=>{
    if(item.category_fr == valueActivity){
        nbTypeActivity++
        item.nb_activity=nbTypeActivity
    }else{
        valueActivity= item.category_fr 

        let infoToPush ={
            category_fr: item.category_fr,
            setAffichageSortie: false,
            nb_activity: nbTypeActivity
        }
        categoryList.push(infoToPush)
      
    }
})

/*
nbTypeActivity.filter((item,index)=>{
})

*/
    res.json( {categoryList,showCatergory} );
});



//recuperation des informations de google place
router.post('/mapactivity',async function(req, res, next) {



    /* Exemple request 
    api key key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo

    coocrindtaes ! lat,lon

  lat = 48.7927087
  lon = 2.5133559

 48.7927087,2.5133559

  dist = 10000 in meter
globaltype :  // request for all specifified type
type :       //search on one type activity 


exempel : 

https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=48.7927087,2.5133559&radius=1500&keyword=bar|restaurant&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo

https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=CrQCIwEAAD5ScfMhCrgt1MgZH9yIpTF6e7TtGcM8-yUdFBvIhypmooviMogHihsBPNbn3bzl-muNdWVkkr0zH3t62BKoQJEZoMk3qMOVyWHSNVzc2VbDEmlPAl4zyK_FHC_8irG8KoT0YK8awAe-g_uLLPERsJTD5XelX-q9uFPItYx6-X5_VKroKfqf8XaCf-vuDXJ9x8FKqp9RAcvI8gah5h50ygV0Q5C99xOSelCODp2_bVCR41mPjhbAt7qGKdcOYENEsZBgZypcowOsz1m4JH7JgFzDVa-Q4uIu-ba9fa5TyREmMmiefC8JSvKyFrM-JvfWJW7YHcLIF8PhxpLtxjusIfeCd0G-c4_zJXTPBOV23yqWI0NLTtuNaMXkQCMrDNhhifOJjyAlcI6il0NgetLnA-ASEM2vn4kuvJXffyl5SSm79LsaFCeP98JCM0BVmjemL9ZJQXQrLSeW&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo




resposne/"status": "ZERO_RESULTS" => aucun resultats 


    */
    //Un point WGS84 et une distance en mètres pour le géopositionnement


    let lat = 48.7927087
    let lon = 2.5133559
    let typeactivity = "bar|restaurant"
    let distance = 1500
    // Liste des activités hors licence etc ...
  
     var listRaw = request('GET', `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${distance}&keyword=${typeactivity}&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo`)
     var response = JSON.parse(listRaw.getBody())
  


  // get place details 
  
  let result = await googleTypeModel.find();

let arrayResult = []
let nextPage = response.next_page_token

let mefInformation = response.results.map((item,i)=>{
    console.log("information",item.name)
        let itemInfo = {
            name:item.name,
            lat:item.geometry.location.lat,
            lon:item.geometry.location.lng,
            place_id:item.place_id,
            price_level:item.price_level,
            rating:item.rating,
            adress:item.vicinity,
            photo:item.photos
        }
        arrayResult.push(itemInfo)

    })

    res.json({arrayResult,nextPage});
  });
  


  module.exports = router;