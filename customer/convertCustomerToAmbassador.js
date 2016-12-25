//convertCustomerToAmbassador

var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var trycatch = require('trycatch');
var NE = require('node-exceptions');

class InvalidArgumentException extends NE.InvalidArgumentException {};


//browser data
router.get('/', function (req, res, next) {
    res.send('convertCustomerToAmbassador API');
});

// GET convertCustomerToAmbassador page.
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('customers');
    collection.find({}, {}, function (e, docs) {
        res.render('convertCustomerToAmbassador', {
            "convertCustomerToAmbassador": docs
        });
    });
});


//convertCustomerToAmbassador API call
router.post('/', function (req, res) {
    trycatch(function (err, data) {
           setTimeout(function () {
                var db = req.db;
                
                var customer_id1 = req.body.customer_id;
                var customer_id = parseInt(customer_id1);
                var isAmbassador1 = req.body.isAmbassador;
                if(isAmbassador1 === "true")
                    var isAmbassador = true;
                else
                    var isAmbassador = false;
                console.log("C"+customer_id);
               
                               
                if (typeof customer_id == undefined || typeof isAmbassador == undefined) {
                    // console.log("Inside Exception");
                    throw new NE.InvalidArgumentException();
                } else {
                    console.log("Inside");

                    var customers = db.get("customers");                    

                    customers.update({
                        "customer_id": customer_id
                    }, {$set: {
                        "isAmbassador": isAmbassador
                        }
                       }, function (err, docs) {
                           if(err){
                               console.log("Error"+err);
                           }else{
                               console.log("customer conveted to Ambassador");
                                res.status(res.statusCode).send({
                                "Status": "Customer converted to Ambassador"
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