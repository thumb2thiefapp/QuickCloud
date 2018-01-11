require('./config/config.js');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('./db/mongoose');
var multer  = require('multer');
let date = require('date-and-time');

var User = require('./models/user.js');
var Admin = require('./models/admin.js');
var Licence = require('./models/licence.js');
var shortid = require('shortid');
const _ = require('lodash');
var userAuthenticate = require('./middleware/userAuthenticate.js');
var adminAuthenticate = require('./middleware/authenticate.js');

var ImagePath = require('./models/image.js');
var VideoPath = require('./models/video.js');
var MusicPath = require('./models/music.js');
var ip = require("ip");


var app = express();
const port = process.env.PORT;

app.use(express.static('QuickBackUp'));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var formidable = require('formidable'),
    fs   = require('fs-extra');


app.post('/uploadImage',userAuthenticate,function (req, res){ 

   var email = req.user.email;

      var form = new formidable.IncomingForm();
     form.parse(req, function(err, fields, files) {
          });

     form.on('field',function(name,value){

      });

  form.on('end', function(fields, files) {

        for(var x in this.openedFiles)
        {
                var temp_path = this.openedFiles[x].path;
               /* The file name of the uploaded file */
                var file_name = this.openedFiles[x].name;
              
                var target_path = 'QuickBackUp/'+email+'/Image/'+file_name;  
                fs.copy(temp_path, target_path , function(err) {  
                  if (err) {
                    console.log(err);
                  }
               });//fscopy

                 ImagePath.update({email},{$push: {paths:{path:target_path}}},{new:true}).then((doc)=>{
                  if(doc){
                    //res.send({"statusCode":200});
                  }
                   else{
                      //res.send({"foo": String(err)});
                   }
                    
                })
          }//for loop

    });//form end
res.send({"statusCode":200});

});//post


app.post('/uploadVideo',userAuthenticate,function (req, res){ 

   var email = req.user.email;

      var form = new formidable.IncomingForm();
     form.parse(req, function(err, fields, files) {
          });

     form.on('field',function(name,value){

      });

  form.on('end', function(fields, files) {

        for(var x in this.openedFiles)
        {
                var temp_path = this.openedFiles[x].path;
               /* The file name of the uploaded file */
                var file_name = this.openedFiles[x].name;
              
                var target_path = 'QuickBackUp/'+email+'/Video/'+file_name;  
                fs.copy(temp_path, target_path , function(err) {  
                  if (err) {
                    console.log(err);
                  }
               });//fscopy

                 VideoPath.update({email},{$push: {paths:{path:target_path}}},{new:true}).then((doc)=>{
                  if(doc){
                    //res.send({"statusCode":200});
                  }
                   else{
                    //res.send({"foo": String(err)});
                  }
                })
          }//for loop

    });//form end
res.send({"statusCode":200});

});//post


app.post('/uploadMusic',userAuthenticate,function (req, res){ 

   var email = req.user.email;

      var form = new formidable.IncomingForm();
     form.parse(req, function(err, fields, files) {
          });

     form.on('field',function(name,value){

      });

  form.on('end', function(fields, files) {

        for(var x in this.openedFiles)
        {
                var temp_path = this.openedFiles[x].path;
               /* The file name of the uploaded file */
                var file_name = this.openedFiles[x].name;
              
                var target_path = 'QuickBackUp/'+email+'/Music/'+file_name;  
                fs.copy(temp_path, target_path , function(err) {  
                  if (err) {
                    console.log(err);
                  }
               });//fscopy

                 MusicPath.update({email},{$push: {paths:{path:target_path}}},{new:true}).then((doc)=>{
                  if(doc){
                    //res.send({"statusCode":200});
                  }
                   else{
                    //res.send({"foo": String(err)});
                  }
                })
          }//for loop

    });//form end
res.send({"statusCode":200});

});//post


app.post('/',(req,res)=>{

  var p = __dirname+'/'+req.body.filepath;
  console.log(p);
  fs.stat(p,(doc)=>{console.log(doc)});
  // var email = req.user.email;

  // ImagePath.find({email}).then((doc)=>{
  //   res.send(doc);
  // })
  

});

app.post('/restoreImage',userAuthenticate,(req,res)=>{

  var email = req.user.email;

  ImagePath.findOne({email}).then((doc)=>{
    res.status(200).send({"statusCode":200,doc});
  })

});

app.post('/restoreVideo',userAuthenticate,(req,res)=>{

  var email = req.user.email;

  VideoPath.findOne({email}).then((doc)=>{
    res.send(doc);
  })

});

app.post('/restoreMusic',userAuthenticate,(req,res)=>{

  var email = req.user.email;

  MusicPath.findOne({email}).then((doc)=>{
    res.send(doc);
  })

});


      //for register user
app.post('/registrationUser',(req,res)=>{
  
  var body = _.pick(req.body, ['email','name','password','key']);
  console.log(body);
  var user = new User(body);

 


  const pathsArry = [];
  pathsArry.push('kuldeep');

  var email = req.body.email;
  var key = req.body.key;

  var imagePath = new ImagePath({
    email,
    paths:{path:[pathsArry]}
  });

  var videoPath = new VideoPath({
    email,
    paths:{path:[pathsArry]}
  });

  var musicPath = new MusicPath({
    email,
    paths:{path:[pathsArry]}
  });

  User.findOne({email}).then((doc)=>{
    if(!doc)
    {
      Licence.findOne({key}).then((doc) => {
        if (!doc) {
          return res.status(404).send("no doc");
        }

        if (doc.active === true) {
          return res.status(404).send("false");
        };
        var year = doc.year;
        var ad = date.format(new Date(), 'DD-MM-YYYY');
        let now = new Date();
        var edd = date.addYears(now, year);
        var ed = date.format(new Date(edd), 'DD-MM-YYYY');
        var active = true;
        var email = req.body.email;
        var key = req.body.key;

      
        Licence.findOneAndUpdate({key}, {$set: {year,ad,ed,active,email}}, {new: true}).then((doc) => {
        if (!doc) {
          return res.status(404).send();
        }

         user.save().then(() => {
          return user.generateAuthToken();
        }).then((token) => {
          res.header('x-auth', token).send({"statusCode":200,doc,token});
        }).catch((e) => {
          res.status(400).send(e);
        })
        
      
          imagePath.save().then((doc)=>{
            //res.send({doc});
          }).catch((e)=>{  res.status(400).send();});

          videoPath.save().then((doc)=>{
              //res.send({doc});
          }).catch((e)=>{  res.status(400).send();});

          musicPath.save().then((doc)=>{
              //res.send({doc});
          }).catch((e)=>{  res.status(400).send();});


      }).catch((e) => {
        console.log(e);
        res.status(400).send();
      })


      }).catch((e) => {
        console.log(e);
        res.status(400).send();
      });
    }
    else {
      res.status(200).send({"statusCode":777});
    }
  });

})

// --------------------------------
//   Login USer
// -------------------------------
app.post('/loginUser',(req,res)=>{
  var email = req.body.email;
  var password = req.body.password;

  User.loginAuthenticate(email,password).then((user) => {
    if(!user){
        // res.status(200).send({"statusCode":201});
    }
    else{
      Licence.findOne({email}).then((doc)=>{
            //res.status(200).send({"statusCode":200,doc});
            return user.generateAuthToken().then((token) => {
              res.header('x-auth', token).send({"statusCode":200,token,doc});
            });
        });
    }
  }).catch((e) => {
    res.status(200).send({"statusCode":403});
  });

});




// --------------------------------
//   create key for users if you are admin
// -------------------------------

app.post('/createKey',adminAuthenticate , (req, res) => {
  var key = shortid.generate();

  var licence = new Licence({
    key,
    year : req.body.year,
    _creator: req.admin._id,

  });

  licence.save().then((doc) => {
    res.send(doc);
    }, (e) => {
    res.status(400).send(e);
  });

});


// --------------------------------
//   create multiple keys for users if you are admin
// -------------------------------
app.post('/multipleKey',adminAuthenticate , (req, res) => {
  
  var number = req.body.number;

  
  var docs = [];

  for(var i=1;i<=number;i++){

    var key = shortid.generate();
    var licence = new Licence({
    key,
    year : req.body.year,
    _creator: req.admin._id,

  });

    licence.save().then((doc) => {
      docs.push(doc);
    }).catch((e) => {
    res.status(400).send(e);
  });

  }
  res.json(docs);
  console.log(docs); 
  
});

// --------------------------------
//   create multiple keys for users if you are admin
// -------------------------------
app.post('/multipleKeys',adminAuthenticate , (req, res) => {
  
  var number = req.body.number;

  

  for(var i=1;i<=number;i++){

    var key = shortid.generate();
    var licence = new Licence({
    key,
    year : req.body.year,
    _creator: req.admin._id,

  });
    licence.save().then((doc) => {
      if(i==number){
        res.send(doc);
      }
    }, (e) => {
      res.status(400).send(e);
    });
  }
});



// --------------------------------
//   admin
// --------------------------------

// app.post('/registerAdmin', (req, res) => {
//   var body = _.pick(req.body, ['username', 'password']);
//   var admin = new Admin(body);

//   admin.save().then(() => {
//     return admin.generateAuthToken();
//   }).then((token) => {
//     res.header('x-auth', token).send({token,admin});
//   }).catch((e) => {
//     res.status(400).send(e);
//   })
// });



app.post('/loginAdmin', (req, res) => {
  var body = _.pick(req.body, ['username', 'password']);

  Admin.findByCredentials(body.username, body.password).then((admin) => {
    return admin.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({token,admin});
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/logoutAdmin', adminAuthenticate, (req, res) => {
  req.admin.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.listen(port,(res,err)=>{
  if(err)
    console.log('error occured while connecting port');
  else{
    console.log(ip.address());
    console.log('Server is Up on'+port);
  }
});
