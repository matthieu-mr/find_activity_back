var express = require('express');
var router = express.Router();

var request = require('sync-request');
// Require the framework and instantiate it
const app = express();

var googleTypeModel = require('../models/googleTypeModel')

var infoApiKey= require('../config/ApiKey'); 
var infoTest=require ("../config/TestInfo")



router.get('/',  function(req, res, next) {
        let response = "hello from sortie"

    let info=["bar","Restaurant"]
    let wording

    info.map((item,i)=>{
        if(i==0){
            wording=`${item}`
        }else{
            wording=`${wording}|${item}`
        }
        
    })

    res.json(wording);
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

    //Un point WGS84 et une distance en mètres pour le géopositionnement

    let lat = req.body.lat
    let lon = req.body.long
    let typeactivity = req.body.type
    let distance = 15000

    // Liste des activités hors licence etc ...
  
     var listRaw = request('GET', `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&rankby=distance&language="fr"&keyword=${typeactivity}&key=AIzaSyCXI24AWr0Cv2AXnbh29nVA9Ge7SPIvYBo`)
     var response = JSON.parse(listRaw.getBody())
  


  // get place details 
  
  let result = await googleTypeModel.find();

    let arrayResult = []
    let nextPage = response.next_page_token


let mefInformation = response.results.map((item,i)=>{
    let priceLevel = item.price_level == undefined ? "Non communiqué":item.price_level
    let nature_libelle = [`Niveau de prix : ${priceLevel}`,`Note : ${item.rating}`]
        let itemInfo = {
            name:item.name,
            lat:item.geometry.location.lat,
            lon:item.geometry.location.lng,
            place_id:item.place_id,
            typeActivity:typeactivity,
            price_level:item.price_level,
            rating:item.rating,
            adress:item.vicinity,
            photo:item.photos,
            nature_libelle:nature_libelle,
        }
        arrayResult.push(itemInfo)

    })

    res.json({response,arrayResult,nextPage});
  });
  
//recuperation des informations de google place
router.post('/pointinformation',async function(req, res, next) {
    let lat= req.body.lat
    let lon = req.body.lon
    let name =req.body.name
    let placeId = req.body.place_id
  
    let responseDetail = undefined
  
    console.log(lat,lon,name,placeId)

   // Modifiy space and accent in name
    let nameJoin = name.replace(/ /g, "+");
    let nameWithoutSpecCarac = encodeURI(nameJoin);
  
  // get information place id
    if(placeId == false || placeId=="false" || placeId==""){
        console.log('pas de place id')
      var listRaw = request('GET', `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${nameWithoutSpecCarac}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry,place_id,icon&locationbias=point:${lat},${lon}&key=${infoApiKey.googleApiKey}`)
      var response = JSON.parse(listRaw.getBody())
      placeId = response.candidates[0].place_id
    }
  
    // get info using place id 
    let detailRaw = request('GET', `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=fr&fields=address_component,adr_address,business_status,formatted_address,geometry,icon,name,photo,place_id,formatted_phone_number,international_phone_number,opening_hours,website,price_level,rating,review,user_ratings_total&key=${infoApiKey.googleApiKey}`)
    let responseDetailRaw = JSON.parse(detailRaw.getBody())
    responseDetail=responseDetailRaw.result
    
    console.log(responseDetail)
    res.json({responseDetail});
  });
  

  module.exports = router;