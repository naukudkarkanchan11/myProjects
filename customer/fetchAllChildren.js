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
                var result = [];
                var result1 = [];
              
                
                var customer_id1 = req.body.customer_id;//none or value 
                console.log("C"+customer_id1);
                var level;
                var rnumber;
                var customer_id = parseInt(customer_id1);
                console.log("C1"+customer_id);                
                var joiningFees = 100.0; 
               
                if (customer_id == undefined) {
                    // console.log("Inside Exception");
                    throw new NE.InvalidArgumentException();
                } else {
                    console.log("Inside customers");

                    var customers = db.get("customers"); 
                    console.log("C"+customer_id);
                    //email using as username
                    console.log("Customer Info");
                   
                    var x;
                    fetch_children(customer_id,resultCallback1);
                    
                     function resultCallback1(result){
                              console.log("Result"+result);
                              console.log("L"+result.length);
                              console.log("Inside level function");
                              if(result === "NONE"){
                                  console.log("Done");
                                  res.status(res.statusCode).send({
                                "Result": "No children found"
                                });
                                  
                              }else{
                              for(var i=0; i<result.length; i++){
                                      var x = result[i];
                                      console.log("X"+x);
                                                   
                                      fetch_children(x, resultCallback1); 
                                  }
                                   res.status(res.statusCode).send({
                                "Result": result
                                });
                              }
                     }//result_callback function
                                                
                    
function fetch_children(customer_id,callback){ 
          
          console.log("Inside function");
          console.log("C"+customer_id);
          customers.find({"referral_id": customer_id},function(err, doc1){
              if(err){
                  console.log("Error"+err);
              }else{
                  console.log("Inside info stuff");
                  console.log("L"+doc1.length);
                  if(doc1.length !== 0){
                      console.log("Info");
                      doc1.forEach(function(doc2){
                          console.log(91);
                          result.push(doc2);
                          result1.push(doc2.customer_id);
                          console.log(result.length);
                          if(doc1.length === result.length){
                              console.log("Result"+JSON.stringify(result));
                              console.log("R1"+JSON.stringify(result1));
                               callback(result1);
                              // res.status(res.statusCode).send({
                               // "Result": result
                               // });
                             
                          }                        
                          
                      });  
                             
                       
                  }else{
                      console.log("No ref");
                      callback("NONE");
                  }
                 
                 // callback(result1);
              }
          });
      }//end function                                                                       
                                                
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