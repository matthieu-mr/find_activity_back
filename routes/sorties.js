var express = require('express');
var router = express.Router();

var request = require('sync-request');
// Require the framework and instantiate it
const app = express();

var googleTypeModel = require('../models/googleTypeModel')

router.get('/',  function(req, res, next) {
        let response = "hello"
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
           let info ={category_fr:item.category_fr,setAffichageSortie:false,nb_acitivity:0}
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




    res.json( {showCatergory,} );
});

  module.exports = router;