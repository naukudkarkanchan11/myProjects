//addCustomer

var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var trycatch = require('trycatch');
var NE = require('node-exceptions');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

class InvalidArgumentException extends NE.InvalidArgumentException {};


//browser data
router.get('/', function (req, res, next) {
    res.send('addCustomer API');
});

// GET  addCustomer page.
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('customers');
    collection.find({}, {}, function (e, docs) {
        res.render('addCustomer', {
            "addCustomer": docs
        });
    });
});

 
//addCustomer API call
router.post('/', function (req, res) {
    trycatch(function (err, data) {
           setTimeout(function () {
                var db = req.db;
                
                var name = req.body.name; //non use case fields
                var email = req.body.email; 
                console.log("E"+email);
                var contactNumber = req.body.contactNumber;////non use case fields
                var referral_id1 = req.body.referral_id;//none or value 
                var level;
                var rnumber;
                console.log("R"+referral_id1);
                if(referral_id1 === undefined){
                    referral_id = "NONE";
                    level = 0;                    
                }else{
                     var referral_id = parseInt(referral_id1);
                }
                var password = req.body.password; //non use case fields
                var joiningFees = 100.0; 
               
                if (typeof name == undefined || typeof email == undefined || typeof contactNumber == undefined || typeof referral_id == undefined || typeof password == undefined || typeof level == undefined) {
                    // console.log("Inside Exception");
                    throw new NE.InvalidArgumentException();
                } else {
                    console.log("Inside customers");

                    var customers = db.get("customers");                    
                    //email using as username
                    customers.find({
                        "email": email
                    }, function (err, docs) {
                        console.log("L"+docs.length);
                        if (docs.length == 0) {
                            
                           var joiningDate = new Date();
                           console.log("joining Date" + joiningDate);
                           var hash = bcrypt.hashSync(password, salt);
                           console.log("HASH"+hash);
                            customers.find({}, function(err, doc1){
                               if(err){
                                   console.log("Error"+err);
                               }
                               else{
                                   var count = doc1.length;                                   
                                   console.log("Count"+ count);
                                   if(referral_id === "NONE"){
                                       
                                    customers.insert({
                                        "customer_id": count+1001, //integer
                                        "name": name, //string
                                        "email": email, //string
                                        "password": hash, //string
                                        "level": level,
                                        "contactNumber": contactNumber, //string
                                        "referral_id": referral_id, //integer
                                        "isAmbassador": false, //boolean
                                        "payback": 0.0, //double
                                        "joiningDate" : joiningDate, //date
                                        "lastUpdated": joiningDate //date
                                    }, function (err, doc) {
                                        console.log("helloo");
                                        if (err) {
                                            // console.log("Error" + err);
                                            } else {
                                                //console.log("T"+ _id.getTimestamp());
                                                console.log("Customer added successfully");
                                                res.status(res.statusCode).send({
                                                                            "Status": " Customer added successfully"
                                                                            });
                                            }
                                    });                                                                           
                                       
                                       
                                   }else{
                                       console.log("Level");
                                    customers.find({"customer_id":referral_id},function(err, doc5){
                                       if(err){
                                           console.log("Error"+err);
                                       }
                                       else{
                                           console.log("Level"+doc5[0].level);
                                           level1 = doc5[0].level;
                                           level = parseInt(level1);
                        
                                    customers.insert({
                                        "customer_id": count+1001, //integer
                                        "name": name, //string
                                        "email": email, //string
                                        "password": hash, //string
                                        "level": level+1,
                                        "contactNumber": contactNumber, //string
                                        "referral_id": referral_id, //integer
                                        "isAmbassador": false, //boolean
                                        "payback": 0.0, //double
                                        "joiningDate" : joiningDate, //date
                                        "lastUpdated": joiningDate //date
                                    }, function (err, doc) {
                                        console.log("helloo");
                                        if (err) {
                                            // console.log("Error" + err);
                                            } else {
                                                //console.log("T"+ _id.getTimestamp());
                                                console.log("Customer added successfully");
                                                console.log("R"+referral_id);  
                                                var x;
                                                ref_status(referral_id,resultCallback);
                                                
                                                function resultCallback(result){
                                                    console.log("Result"+result);
                                                    x= result;
                                                    console.log("X"+x);
                                                    if(x === "NONE")
                                                        {
                                                            console.log("Parent upated successfully");
                                                            res.status(res.statusCode).send({
                                                            "Status": "Parent upated successfully"
                                                            });
                                                        }else{
                                                            console.log("inside function else");
                                                            console.log("input"+x);
                                                            ref_status(x, resultCallback);                                                            
                                                        }
                                                }
                                                //console.log("X"+x);
                                                function ref_status(referral_id,callback){  
          console.log("Inside function");
          customers.update({"customer_id": referral_id},                                                           
                   {$set: 
                        {"lastUpdated": joiningDate}
                   },function(err, doc2){
                        if(err){
                             console.log("Error"+err);
                        }else{ 
                            console.log("38");
                            customers.find({"customer_id":referral_id},function(err, doc10){
                                if(err){console.log("Error"+err);}
                                else{
                                    if(doc10[0].isAmbassador === true){
                            
                             customers.update({"customer_id": referral_id},                                                           
                                      {$inc: {"payback": 0.4*joiningFees}},
                                             function(err, doc3){ 
                                                    if(err){console.log("Error"+err);}else{
                                                            console.log("Payback updated");                                                                                    
                                                            customers.find({"customer_id":referral_id},function(err,doc6){
                                                                if(err){ console.log("Error"+err);}
                                                                        else{
                                                                            console.log("Doc"+doc6[0].referral_id);
                                                                                            if(doc6[0].referral_id === "NONE")
                                                                                                callback("NONE");
                                                                                            else{
                                                                                            rnumber = parseInt(doc6[0].referral_id); 
                                                                                            console.log("R"+rnumber);                                                                                            
                                                                                            callback(rnumber);
                                                                                            }                                                                                                
                                                                                        }
                                                                                    });
                                                                           
                                                                            }
                                                                        });//payback update
                                                                }else{
                                                                     customers.update({"customer_id": referral_id},                                                           
                                      {$inc: {"payback": 0.3*joiningFees}},
                                             function(err, doc3){ 
                                                    if(err){console.log("Error"+err);}else{
                                                            console.log("Payback updated");                                                                                    
                                                            customers.find({"customer_id":referral_id},function(err,doc6){
                                                                if(err){ console.log("Error"+err);}
                                                                        else{
                                                                            console.log("Doc"+doc6[0].referral_id);
                                                                                            if(doc6[0].referral_id === "NONE")
                                                                                                callback("NONE");
                                                                                            else{
                                                                                            rnumber = parseInt(doc6[0].referral_id); 
                                                                                            console.log("R"+rnumber);                                                                                            
                                                                                            callback(rnumber);
                                                                                            }                                                                                                
                                                                                        }
                                                                                    });
                                                                           
                                                                            }
                                                                        });//payback update
                                                                } //else of isAmbassador 
                                                            }
                                                        });
                                                  }//else
              
          });
                                
                                                }//function status
                                                                     
                                            }
                                    });
                                       }
                                    });
                                   }
                               }
                            });
                           }else{
                            console.log("Already existing customer");
                            res.status(res.statusCode).send({
                                "Status": "Already existing customer"
                            });
                        }
                    });
                }
            }, 1000);           
        },
        function (err) {
            /*  console.log("Input is not of required type");
              res.status(res.statusCode).send({
                  "Error": "Please fill the required field"
              });
              console.log("Async error caught!\n", err.stack);*/
        });   
		
		
}); //router


module.exports = router;