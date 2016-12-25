//fetchChildrenAtNthLEvel

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
    res.send('fetchChildrenAtNthLEvel API');
});

// GET fetchChildrenAtNthLEvel page
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('customers');
    collection.find({}, {}, function (e, docs) {
        res.render('fetchChildrenAtNthLEvel', {
            "fetchChildrenAtNthLEvel": docs
        });
    });
});

 
//fetchChildrenAtNthLEvel API call
router.post('/', function (req, res) {
    trycatch(function (err, data) {
           setTimeout(function () {
                var db = req.db;
                var result = [];
                var result1 = [];   
               
                var customer_id1 = req.body.customer_id;//ambassador
                var customer_id = parseInt(customer_id1);
                var level1 = req.body.level;//none or value 
                var level = parseInt(level1);
                var new_level;
                var result = [];
                console.log("level"+level);;                
                              
                if (level == undefined) {
                    // console.log("Inside Exception");
                    throw new NE.InvalidArgumentException();
                } else {
                    console.log("Inside customers");

                    var customers = db.get("customers"); 
                    customers.find({"customer_id": customer_id}, function(err, docs){
                        if(err){
                            console.log("Error"+err);
                        }else{
                            console.log("L"+docs.length);
                            new_level = docs[0].level + level;
                            console.log("N"+new_level);
                            var x;
                            level_child(customer_id, resultCallback);
                            
                            function resultCallback(result){
                                console.log("R"+result);
                                console.log(typeof(result));
                                if(typeof(result)=== "object")
                                    {
                                        res.status(res.statusCode).send({
                                            "Result": result
                                        }); 
                                    }
                                else{
                                    level_child(result, resultCallback);
                                }                              
                                
                            }//function end
                            
                            function level_child(customer_id, callback){
                                customers.find({"referral_id":customer_id}, function(err, doc1){
                                    if(err){
                                        console.log("Error"+err);
                                    }else{
                                        console.log("L"+doc1.length);
                                        doc1.forEach(function(doc2){
                                            console.log("Level"+doc2.level);
                                            if(doc2.level === new_level){
                                                result.push(doc2);
                                                if(doc1.length === result.length){
                                                callback(result);}
                                            }else{
                                                callback(doc2.customer_id);
                                            }
                                            
                                        });                                      
                                        
                                    }
                                    
                                });
                            }//function end 
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