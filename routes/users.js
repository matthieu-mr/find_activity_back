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
  res.send('respond with a resource');
});


/* GET users listing. */
router.post('/create',async function(req, res, next) {

  console.log("creation user", req.body)

  var pseudo = "aa"
  var email = "aa@a.com"
  var password = "test"

/* API sendi in blue 
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
YxPQf2waypU1AG7d

*/
  var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });

  console.log("user",user)
  if (user == null){
    // no user and pseudo
    var salt = uid2(32);
    SHA256(password + salt).toString(encBase64);

    var newUser = new UserModel ({
      pseudo: pseudo,
      email: email,
      salt : salt,
      password: SHA256(password + salt).toString(encBase64),
      token: uid2(32)
    });
   await newUser.save();
   res.json({ created: true });
  }else {
    // user exist
    var hash = SHA256(password + user.salt).toString(encBase64);
    console.log(hash)
  
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

  console.log("creation user", req.body)

  var pseudo = "aa"
  var email = "aa@a.com"
  var password = "test"


  var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });

  console.log("user",user)

  if (user == null){
    // no user and pseudo
    let retour = "Utilisateur inconnu "
    res.json({ login: false,userKnow:false,retour });
  }else {
    // user exist
    var hash = SHA256(password + user.salt).toString(encBase64);
    console.log(hash)
  
    if (hash === user.password) {
      let retour = true
      res.json({ login: true,userKnow:true, retour });

    } else {
      let retour = "Mauvais password"
      res.json({ login: false,userKnow:true,retour });
    }
  }


 res.json('respond with a resource');
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

//let send = await mailchimp.get('/lists/2676498d95/members')


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


    




module.exports = router;
