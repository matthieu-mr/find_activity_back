var express = require('express');
var router = express.Router();
var nodemailer = require ('nodemailer') ; 
//var request = require('sync-request');
var request = require('then-request');
var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

var UserModel = require('../models/userModel')
/*
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "f32f5907752849fe85b7827c9fd9c352-us2",
  server: "us2",
});
*/ 



var Mailchimp = require('mailchimp-api-v3')
var mailchimp = new Mailchimp("f32f5907752849fe85b7827c9fd9c352-us2");

// SendInBlue
var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('route user');
});


/* GET users listing. */
router.post('/createuser',async function(req, res, next) {


  var pseudo = req.body.pseudo
  var email = req.body.email
  var password = req.body.password

  var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });


  if (user == null){
    // no user and pseudo
    var salt = uid2(32);
    SHA256(password + salt).toString(encBase64);

    var newUser = new UserModel ({
      pseudo: req.body.pseudo,
      email:req.body.email,
      salt : salt,
      password: SHA256(password + salt).toString(encBase64),
      token: uid2(32),
      contactInt:[],
      favoritesplaces:[],
      trackingID:"33D",
      adress: "", 
      postcode:"",
      city:"",
      lat:"", 
      lon:"", 
    });
   await newUser.save();

   res.json({ created: true });
  }else {
    // user exist
    var hash = SHA256(password + user.salt).toString(encBase64);
  
    if (hash === user.password) {
      let retour = "Email ou pseudo déjà utilisé, reintialiser mot de passe ? "
      res.json({ login: false, retour });

    } else {
      let retour = "Email ou pseudo déjà utilisé, reintialiser mot de passe ? "
      res.json({ login: false,retour });
    }
  }
// res.json('respond with a resource');
});

/* GET users listing. */
router.post('/login',async function(req, res, next) {

  var pseudo = req.body.pseudo
  var email = req.body.email
  var password = req.body.password


  /*
  pseudo = "aa"
 email = "aa@a.com"
   password = "test"


  */

  var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });

  if (user == null){
    // no user and pseudo
    let retour = "Utilisateur inconnu "
    res.json({ login: false,userKnow:false,retour });
  }else {
    // user exist
    var hash = SHA256(password + user.salt).toString(encBase64);  
    if (hash === user.password) {
      let retour = true
      res.json({ login: true,userKnow:true, retour,user });

    } else {
      let retour = "Mauvais password"
      res.json({ login: false,userKnow:true,retour });
    }
  }

});

// Mailchimp

router.post('/sendmail', async function(req, res, next) {


// api key : f32f5907752849fe85b7827c9fd9c352-us2
//const response = await mailchimp.ping.get();
/*

mailchimp.get({
  path : '/lists'
}, function (err, result) {
 console.log("err",err)
 console.log("result",result)
})
*/

// audience id default : 2676498d95
let response 


let send = await mailchimp.post('/lists/2676498d95/members', {
  email_address : 'thefirst6@gmail.com',
  status : 'subscribed',
  merge_fields: {
    FNAME: "Moimeme",
    PSEUDO:"couac"

},
})

.then(function(results) {
  console.log(results)
  response = results
})
.catch(function (err) {
  console.log(err)

})
//var response = JSON.parse(send.getBody())


res.json( {response} );
});


router.post('/changepassword', async function(req, res, next) {

  var pseudo = "aa"
  var email = "aa@a.com"
  console.log(req.body)
  var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });
  

  res.json( {user} );
  });
  

    
router.post('/userinformation', async function(req, res, next) {

  var pseudo = "aa"
  var email = "aa@a.com"
  var password = "test"
  
  var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });
  

  res.json( {user} );
  });
  

  router.post('/saveactivity', async function(req, res, next) {

    var pseudo = "aa"
    var email = "aa@a.com"
    var password = "test"


    // info place
    let item = {
      date : "02/03/2020",
      name:"la capsule",
      category:"formation",
      adress:"10 rue de la rue",
      type:"sortie",
      city: "Paris", 
      postcode:"75000",
      lat:0.23, 
      lon:51.2,
      googleIdPlace:"0007",
    }
  
  
    var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });

    user.favoritesplaces.push(item)

    await UserModel.updateOne(
      {pseudo: pseudo},
      { favoritesplaces: user.favoritesplaces }
   
   );


    res.json( {user} );
  
    });


 router.post('/savecontactadress', async function(req, res, next) {

      let infoRaw = req.body.info
      let recupInfo = JSON.parse(infoRaw);

      var pseudo = "aa"
      var email = "aa@a.com"

      let item = {
        name : recupInfo.infoFormAdress.name,
        adress:recupInfo.infoFormAdress.adress,
        postcode:recupInfo.infoFormAdress.postcode,
        city:recupInfo.infoFormAdress.city,
        lat:recupInfo.infoFormAdress.lat,
        lon:recupInfo.infoFormAdress.lon,
      }
    
    
      var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });
      //console.log("info",user.contactInt)

      if (req.body.type=="contact"){ 
        user.contactInt.push(item)
        await UserModel.updateOne(
          {pseudo: pseudo},
          { contactInt: user.contactInt }
       );

      }else{
        user.favoritesplaces.push(item)
        await UserModel.updateOne(
          {pseudo: pseudo},
          { favoritesplaces: user.favoritesplaces}
       );
      }

      res.json( {user} );
      });


  router.post('/deleteinfo', async function(req, res, next) {

        var pseudo = "aa"
        var email = "aa@a.com"
        var objectid = req.body.objectid
        var type =req.body.type


        var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });

    if(type == "contact"){

      user.contactInt.map((item,i)=>{
        if(item._id== objectid){
          user.contactInt.splice(i,1)
        }
      })
      await UserModel.updateOne(
        {pseudo: pseudo},
        { contactInt: user.contactInt }
     
     );
    }

    if(type == "activity"){
      user.favoritesplaces.map((item,i)=>{
        if(item._id== objectid){
          user.favoritesplaces.splice(i,1)
        }
      })

      await UserModel.updateOne(
        {pseudo: pseudo},
        { favoritesplaces: user.favoritesplaces }
     
     );
    }
    /*
    if(type == "adressPerso"){

      await UserModel.updateOne(
        {pseudo: pseudo},
        {        
        "adress": "",
        "postcode": "",
        "city": "",
        "lat": "",
        "lon": "",
        }
     
     );
    }

 */
        res.json( {user} );
        });


router.post('/modifinfo', async function(req, res, next) {

  let infoRaw = req.body.info
  let recupInfo = JSON.parse(infoRaw);

  var pseudo = "aa"
  var email = "aa@a.com"

  let newItem = {
    name : recupInfo.infoFormAdress.name,
    adress:recupInfo.infoFormAdress.adress,
    postcode:recupInfo.infoFormAdress.postcode,
    city:recupInfo.infoFormAdress.city,
    lat:recupInfo.infoFormAdress.lat,
    lon:recupInfo.infoFormAdress.lon,
    isFavorite:true,
  }

  var pseudo = "aa"
  var email = "aa@a.com"
  var objectid = recupInfo.infoFormAdress.id
  var type =req.body.type
  var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });



if(type == "contact"){

  user.contactInt.map((item,i)=>{
      if(item._id== objectid){
        user.contactInt.splice(i,1)
        user.contactInt.push(newItem)
      }
    })

    console.log("user finish",user.contactInt)

    
      await UserModel.updateOne(
        {pseudo: pseudo},
        { contactInt: user.contactInt }
      )
      ;
    }

if(type == "activity"){
      user.favoritesplaces.map((item,i)=>{
        if(item._id== objectid){
          user.favoritesplaces.splice(i,1)
          user.favoritesplaces.push(newItem)
        }
      })

      await UserModel.updateOne(
        {pseudo: pseudo},
        { favoritesplaces: user.favoritesplaces }

    );
  }

  res.json( {user} );
  });

module.exports = router;
