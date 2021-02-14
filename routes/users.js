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
const { getMaxListeners } = require('../models/userModel');
var defaultClient = SibApiV3Sdk.ApiClient.instance;



/* GET users listing. */
router.get('/', function(req, res, next) {
res.send('route user');
});


/* GET users listing. */
router.post('/createuser',async function(req, res, next) {

  // get info from front
  var pseudo = req.body.pseudo
  var email = req.body.email
  var password = req.body.password
  // get info from BDD
  var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });

if (user == null){
// no user and pseudo
var token =uid2(32);

// create salt & SHA
  var salt = uid2(32);
  SHA256(password + salt).toString(encBase64);

// get user info from query & add more
    var newUser = new UserModel ({
        pseudo: req.body.pseudo,
        email:req.body.email,
        salt : salt,
        password: SHA256(password + salt).toString(encBase64),
        token: token,
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
  res.json({ created: true,token:token});
  }else {
    // user already exist
    let retour = "Email ou pseudo déjà utilisé, reintialiser mot de passe ? "
    res.json({ login: false, retour });
    }
});




/* GET users listing. */
router.post('/login',async function(req, res, next) {

var pseudo = req.body.pseudo
var email = req.body.email
var password = req.body.password

console.log(req.body)
var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });
console.log(user)

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




router.post('/userinformation', async function(req, res, next) {

console.log(req.body)

var pseudo = req.body.pseudo
var email = req.body.email
var id = req.body.id
//email = "m.michon.rossel@gmail.com"
var allInfo = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo},{_id:id}] });

var user={
  id:allInfo._id,
  pseudo:allInfo.pseudo,
  email: allInfo.email,
  contactInt:allInfo.contactInt,
  favoritesplaces:allInfo.favoritesplaces,
  trackingID:allInfo.trackingID
}

console.log(user)


res.json( {user} );
});




router.post('/savecontactadress', async function(req, res, next) {

let infoRaw = req.body.info
let recupInfo = JSON.parse(infoRaw);

var pseudo = ""
var email = req.body.email
//email="m.michon.rossel@gmail.com"

let item = {
  name : recupInfo.name,
  adress:recupInfo.adress,
  postcode:recupInfo.postcode,
  city:recupInfo.city,
  lat:recupInfo.lat,
  lon:recupInfo.lon,
  isFavorite:true,
  icon:recupInfo.icon,
  googleIdPlace:recupInfo.googleIdPlace
  }


var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });


if (req.body.type=="contact"){ 
  let listAdress =  user.contactInt
  listAdress.push(item)

await UserModel.updateOne(
    {email: email},
    {contactInt: listAdress}
  );

}else{
  let listAdress =  user.favoritesplaces
  listAdress.push(item)

  await UserModel.updateOne(
    {email: email},
    { favoritesplaces: listAdress}
  );
}

  res.json( {user} );
});


router.post('/deleteinfo', async function(req, res, next) {

var pseudo = ""
var email = req.body.email
var objectid = req.body.objectid
var type =req.body.type
var id = req.body.id
//email = "m.michon.rossel@gmail.com"

var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo},{_id:id}] });

if(type == "contact"){
  user.contactInt.map((item,i)=>{
    if(item._id== objectid){
    user.contactInt.splice(i,1)
    }
  })
await UserModel.updateOne(
  {email: email},
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
    {email: email},
    {favoritesplaces: user.favoritesplaces }
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
console.log(user)
res.json( {user} );
});


router.post('/modifinfo', async function(req, res, next) {

  let infoRaw = req.body.info
  let recupInfo = JSON.parse(infoRaw);
  var pseudo = ""
  var email = req.body.email


  let newItem = {
    name : recupInfo.name,
    adress:recupInfo.adress,
    postcode:recupInfo.postcode,
    city:recupInfo.city,
    lat:recupInfo.lat,
    lon:recupInfo.lon,
    isFavorite:true,
    icon:recupInfo.icon,
    googleIdPlace:recupInfo.googleIdPlace
  }

  var objectid = recupInfo.id
  var type =req.body.type
  var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });

  if(type == "contact"){
    console.log('type contact')
    user.contactInt.map((item,i)=>{
      if(item._id== objectid){
      user.contactInt.splice(i,1,newItem)
      }
    })

    await UserModel.updateOne(
    {email: email},
    { contactInt: user.contactInt }
    )
  ;
  }

  if(type == "activity"){
  user.favoritesplaces.map((item,i)=>{
  if(item._id== objectid){
  user.favoritesplaces.splice(i,1,newItem)
  }
  })

  await UserModel.updateOne(
  {email: email},
  { favoritesplaces: user.favoritesplaces }

  );
  }
res.json( {user} );
});





router.post('/sendmailnewpassword', async function(req, res, next) {
  let result =true 

  var pseudo = req.body.pseudo
  var email = req.body.email

  var user = await UserModel.findOne({$or: [{'email': email}, {'pseudo': pseudo}] });

  let idUser = user._id
  let emailUser = user.email
  let url =`http://localhost:3001/newpassword${idUser}`

    let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      // should be replaced with real sender's account
      user: 'm.michon.rossel@gmail.com',
      pass: 'hbmxoxyvcrunsrxb'
    },
    tls: { 
      // do not fail on invalid certs 
      rejectUnauthorized: false 
    } 
    });
    let mailOptions = {
      // should be replaced with real recipient's account
      from: '"Quoi Faire" <m.michon.rossel@gmail.com>',
      to: emailUser,
      subject: "Quoi Faire - Réinitialisation de votre mot de passe ",
      text:  `<b>Bonjour <strong>${user.pseudo} </strong> ! </b><br/> <p>	Vous avez oublié votre mot de passe ? <br/> Pas d’inquiétude ! Cela arrive à tout le monde. </p>
      Pour réinitialiser ce dernier, suivez ce lien : <br/> 
      <a href="${url}" target="_blank" >Changer mon mot de passe</a>` ,
      html: `<b>Bonjour <strong>${user.pseudo}</strong> </b><br/> <p>	Vous avez oublié votre mot de passe ? <br/> Pas d’inquiétude ! Cela arrive à tout le monde. </p>
      Pour le réinitialiser, il vous suffit juste de suivre ce lien : <br/> <br/>
      <a href="${url}" target="_blank" >Changer mon mot de passe</a>
      <br/><br/> <br/>
      Cordialement,<br/>
      L'équipe de Quoi faire` // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
    console.log(info,error)
    if (error) {
    result = false
    return console.log("erreure transporter",error);
    }
    result = true
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });

res.json( {result} );
});


router.post('/changepassword', async function(req, res, next) {

  let userId = "5f86cb003d835c1a2cc317fc"
  let password = "test"

  var salt = uid2(32);
  SHA256(password + salt).toString(encBase64);

  await UserModel.updateOne(
  {_id: userId},
  { 
  salt : salt,
  password: SHA256(password + salt).toString(encBase64),
  token: uid2(32) }
  )

  let user=await UserModel.findById(
  {_id:userId},
  )

  res.json( {user} );
  });

module.exports = router;
