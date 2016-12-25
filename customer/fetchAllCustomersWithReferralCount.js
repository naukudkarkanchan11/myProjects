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
               
                if (0) {
                    // console.log("Inside Exception");
                    throw new NE.InvalidArgumentException();
                } else {
                    console.log("Inside customers");

                   var customers = db.get("customers"); 
                   var result = [];    
                   customers.find({}, 'customer_id email referral_id isAmbassador payback joiningDate lastUpdated', function(err, docs){
                       if(err){
                           console.log("Error"+err);
                       }else{
                           console.log("L"+docs.length);
                           if(docs.length !== 0){
                               docs.forEach(function(doc1){
                                customers.find({"referral_id":doc1.customer_id}, function(err, doc2){
                                        if(err){
                                                 console.log("Error"+err);
                                                }else{
                                                    console.log("RL"+doc2.length);
                                                    result.push({"customer_info":doc1, "referal_count":doc2.length});
                                                    console.log("R1"+result.length);
                                                    if(docs.length === result.length){
                                                        console.log("hello");
                                                        console.log("Result"+result);
                                                         res.status(res.statusCode).send({
                                                                "Customer_info_Referral_Count": result
                                                            });
                                                    }
                                                }
                                });
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