var express = require('express');
var router = express.Router();
var request = require('sync-request');


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


//filtrage par type d'activite

router.post('/filteredtype',async function(req, res, next) {

/*
Request all
https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=1000&facet=naturelibelle&facet=actlib&exclude.utilisateurs=Scolaires+%2F+Universit%C3%A9s&geofilter.distance=48.7926622%2C+2.5134926%2C5000
Request typr 
https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=1000&facet=naturelibelle&facet=actlib&refine.naturelibelle=D%C3%A9couvert&exclude.utilisateurs=Scolaires+%2F+Universit%C3%A9s&geofilter.distance=48.7926622%2C+2.5134926%2C5000

*/
console.log(req.body)

  //Un point WGS84 et une distance en mètres pour le géopositionnement
  let lat = req.body.lat
  let lon = req.body.long
  let dist = req.body.dist
  let type = req.body.type
  dist = 2500
  /*
    lat = 48.7927087
    lon = 2.5133559
    type ="Toutes"
*/
    console.log( `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=1000&facet=naturelibelle&facet=actlib&exclude.utilisateurs=Scolaires+%2F+Universit%C3%A9s&geofilter.distance=${lat}%2C${lon}%2C${dist}`)
   
  let natureJoin = type.replace(/ /g, "+")
  let natureActivite = encodeURI(natureJoin);

  let resultTypeActivity 
  let resultSport
  
  // Liste des activités hors licence etc ...
  if (type == "Toutes" || type==undefined){
    
    var list = request('GET', `https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=1000&facet=naturelibelle&facet=actlib&exclude.utilisateurs=Scolaires+%2F+Universit%C3%A9s&geofilter.distance=${lat}%2C${lon}%2C${dist}`)
    var response = JSON.parse(list.getBody())

    resultTypeActivity = response.facet_groups[1].facets
    resultSport = response.facet_groups[2].facets
  }else {
    // Liste des activités hors licence etc ...
    var list = request('GET', ` https://data.iledefrance.fr/api/records/1.0/search/?dataset=recensement-des-equipements-sportifs&q=&rows=1000&facet=naturelibelle&facet=actlib&refine.naturelibelle=${natureActivite}&exclude.utilisateurs=Scolaires+%2F+Universit%C3%A9s&geofilter.distance=${lat}%2C+${lon}%2C${dist}`)
    var response = JSON.parse(list.getBody())
     
    resultTypeActivity = response.facet_groups[1].facets
    resultSport = response.facet_groups[2].facets
  }

  let arrayTypeActivity = resultTypeActivity

  
  arrayTypeActivity.unshift({ 
    "path": "Toutes",
    "state": "false",
    "name": "Toutes",
    })

//Tri de la list
resultSport.sort(function(a,b){
  //return a.attributes.OBJECTID - b.attributes.OBJECTID;
  if(a.name == b.name)
      return 0;
  if(a.name < b.name)
      return -1;
  if(a.name > b.name)
      return 1;
});



res.json({arrayTypeActivity,resultSport});
});


//recuperation des points map on 1 sport
router.post('/mapactivity',async function(req, res, next) {

   //Un point WGS84 et une distance en mètres pour le géopositionnement

   let latitude = req.body.lat
   let longitude = req.body.long
   let distance = Number(req.body.dist)
   let sport = req.body.type
   let typeActivity = "Toutes"
   distance = 2500
 /*
   latitude = 48.7926622
   longitude =  2.5134926
    
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
 
   let arrayResult = []
   
   let mefInformation = result.map((item,i)=>{
        let adress=item.fields.insnovoie+" "+ item.fields.inslibellevoie+","+item.fields.comlib
        let nature_libelle = [item.fields.naturelibelle]

        let issimilare = true

        let arrayResultmap = arrayResult.map((search)=>{
          if(search.place_id_sport ==item.fields.insnumeroinstall ){
            issimilare = !issimilare
            search.nature_libelle.push(item.fields.naturelibelle)
          }
        })

        if(issimilare){
          let itemInfo = {
            name:item.fields.insnom,
            lat:item.fields.gps[0],
            lon:item.fields.gps[1],
            place_id:false,
            typeActivity:item.famille,
            place_id_sport:item.fields.insnumeroinstall,
            nature_libelle:nature_libelle,
            price_level:false,
            rating:false,
            adress:adress,
            photo:false
        }
        arrayResult.push(itemInfo)
        }

   
       })


arrayResult.map((item,i)=>{
  let uniqValue = new Set(item.nature_libelle)
  const arrayValue = [...uniqValue]
  item.nature_libelle = arrayValue
  })
          
  let nextPage = false
 
   res.json({arrayResult,result});
 });





module.exports = router;
