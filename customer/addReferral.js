//addcustomer

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

 
//addcustomer API call
router.post('/', function (req, res) {
    trycatch(function (err, data) {
           setTimeout(function () {
                var db = req.db;
                
                var customer_id1 = req.body.customer_id;//child
                var referral_id1 = req.body.referral_id;//parent 
                var customer_id = parseInt(customer_id1);
                var referral_id = parseInt(referral_id1);               
                var joiningFees = 100.0; 
                var level;
                console.log("C"+customer_id);
                console.log("R"+referral_id);
               
                if ( typeof customer_id == undefined|| typeof referral_id == undefined) {
                    // console.log("Inside Exception");
                    throw new NE.InvalidArgumentException();
                } else {
                    console.log("Inside customers");
                    console.log("R1"+customer_id);
                    var customers = db.get("customers");
                    customers.find({"customer_id": customer_id},function(err, docs){
                        if(err){
                                 console.log("Error"+err);
                               } else{
                                       if(docs.length !== 0){
                                           console.log("Inside cust");
                                            console.log("Level"+docs[0].level);
                                            level1 = docs[0].level;
                                            level = parseInt(level1);
                        
                                    customers.update({
                                        "customer_id": customer_id},{$set:{
                                            "referral_id": referral_id,
                                            "level": level +1
                                        }}, function (err, doc) {
                                        console.log("helloo");
                                        if (err) {
                                            // console.log("Error" + err);
                                            } else {
                                                //console.log("T"+ _id.getTimestamp());
                                                var date = new Date();
                                                console.log("Referral added successfully");
                                                //parent payback updated
                                                console.log("R"+referral_id);  
                                                var x;
                                                var y;
                                                ref_status(referral_id,resultCallback);
                                                ref_level(customer_id,resultCallback1);
                                            
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
                                                }//result_callback function
                                                
                                                function resultCallback1(result){
                                                    console.log("Result"+result);
                                                    console.log("L"+result.length);
                                                    console.log("Inside level function");
                                                    for(var i=0; i<result.length; i++){
                                                        var x = result[i];
                                                        console.log("X"+x);
                                                   
                                                        ref_level(x, resultCallback1); 
                                                    }
                                                        
                                                }//result_callback function
                                                //console.log("X"+x);
                                                function ref_status(referral_id,callback){  
          console.log("Inside function");
          customers.update({"customer_id": referral_id},                                                           
                   {$set: 
                        {"lastUpdated": date}
                   },function(err, doc2){
                        if(err){
                             console.log("Error"+err);
                        }else{ 
                            console.log("38");
                            customers.find({"customer_id": referral_id},function(err, doc10){
                                if(err){console.log("Error"+err);}
                                else{
                                    console.log("AStatus"+doc10[0].isAmbassador);
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
                                                                        });///payload
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
                                                                        });///payload
                                
                            }
                                }
                            });
                                                                }  
                                                    });
                                               }//ref_status function
function ref_level(customer_id,callback){  
          console.log("Inside function");
          customers.find({"referral_id": customer_id}, function(err, doc2){
                   if(err){console.log("Error"+err);}
                    else{
                          var result = [];
                          if(doc2.length !== 0){
                              console.log("Inside level update");
                              doc2.forEach(function(doc3){
                                  console.log("Inside for Each");
                                    customers.update({"customer_id": doc3.customer_id},                                                           
                                                     {$inc: 
                                                        {"level": 1}
                                                     },function(err, doc4){
                                                if(err){
                                                        console.log("Error"+err);
                                                }else{ 
                                                    console.log("141");
                                                    result.push(doc3.customer_id);
                                                    if(doc2.length === result.length){
                                                        console.log("Result"+result);
                                                        callback(result);
                                                    }
                                                    
                                                     }
                                                 });
                                            });  
                                }
                    }
          });
    }//ref_level function
                                                                                                
                                                
                                            }
                                    });
                                       }
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