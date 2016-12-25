//addcustomer

var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var trycatch = require('trycatch');
var NE = require('node-exceptions');

class InvalidArgumentException extends NE.InvalidArgumentException {};


//browser data
router.get('/', function (req, res, next) {
    res.send('getCustomerById API');
});

// GET  addCustomer page.
router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('customers');
    collection.find({}, {}, function (e, docs) {
        res.render('getCustomerById', {
            "getCustomerById": docs
        });
    });
});


//addcustomer API call
router.post('/', function (req, res) {
    trycatch(function (err, data) {
           setTimeout(function () {
                var db = req.db;
                
                var customer_id1 = req.body.customer_id;
                console.log("Helloo");
                var customer_id = parseInt(customer_id1);
                console.log("C"+customer_id);
               
                               
                if (typeof customer_id == undefined) {
                    // console.log("Inside Exception");
                    throw new NE.InvalidArgumentException();
                } else {
                    console.log("Inside");

                    var customers = db.get("customers");                    

                    customers.find({
                        "customer_id": customer_id
                    }, function (err, docs) {
                        if (docs.length !== 0) {
                            console.log("got it");
                            console.log("Customer Info" + docs)
                             res.status(res.statusCode).send({
                                 "Customer_Info": docs
                             });
                        }else{
                            console.log("No customer with given Id");
                            res.status(res.statusCode).send({
                                 "Customer_Info": "No customer with given Id"
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