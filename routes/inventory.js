var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

const inventorySchema = require('../MongoDB_Schema/inventory');
const checkAuth = require('../middleware/check-auth');


/* GET All inventorys. */
router.get('/', checkAuth, function(req, res, next) {
  inventorySchema.find(function(err, inventoryListResponse){
    if(err){
      res.send({status: 500, message: 'Unable to find inventorys'});
    }
    else{
      const recordCount = inventoryListResponse.length;
      res.send({status: 200, recordcount: recordCount, result: inventoryListResponse});
    }
  })

});

// Get Detail of a Specific inventory
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  inventorySchema.findById(id, function(err, inventoryResponse){
    if(err){
      res.send({status: 500, message: 'Unable to find the inventorys'});
    }
    else{
      res.send({status: 200, result: inventoryResponse});
    }
  })
});

router.post('/', function(req, res, next) {
  let schema = inventorySchema({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    userId: null
  });

  schema.save(function(err, data){
    if(err){
      res.send({status: 500, message: 'Unable to add Inventory'});
    }
    else{
      res.send({status: 200, message: 'Inventory added successfully', inventory: data});
    }
  })
});

router.put('/', function(req, res, next) {
  const id = req.body.id;
  let inventoryObj = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category
  };

  inventorySchema.findByIdAndUpdate(id, inventoryObj, function(err, inventoryResponse){
    console.log(inventoryResponse);
    if(err){
      res.send({status: 500, message: 'Unable to update the Inventory'});
    }
    else{
      res.send({status: 200, message: 'Inventory updated Successfully', result: inventoryResponse});
    }
  });
});

// Delete Existing inventory
router.delete('/', async function(req, res, next) {
  console.log(req.query.inventoryIds);
   const Ids = req.query.inventoryIds.split(',');
  // console.log(Ids);
  if(Ids.length > 0) {
    const deletedRecords = [];
    let isError = false;
    for(let i = 0; i < Ids.length; i++) {
      const result = await inventorySchema.findByIdAndDelete(Ids[i]).exec();
      if(!result) {
        isError = true;
        break;
      }
      deletedRecords.push(result);
    }

    if(isError) {
      res.send({status: 500, message: 'Unable to delete the inventorys'});
    } else {
      res.send({status: 200, message: 'User deleted Successfully', result: deletedRecords});
    }

    /*
    const promise = new Promise(function(resolve, reject) {
      let errFlag = false;
      const deletedinventorys = [];
      Ids.forEach(function(id) {
        inventoryModel.findByIdAndDelete(id, function(err, inventoryResponse){
          if(err) {
            errFlag = true;
            reject('Unable to delete the inventorys');
          } else {
            deletedinventorys.push(inventoryResponse);
          }

          if(Ids[Ids.length - 1] == id) {
            if(!errFlag) {
              resolve({
                message: 'User deleted Successfully',
                deletedRecords: deletedinventorys
              });
            }
          } 
        })
      });
    });

    promise.then(function(response) {
      res.send({status: 200, message: response.message, result: deletedRecords});
    }, 
    function(err) {
      res.send({status: 500, message: err});
    });
    */
  } else {
    
  }
  
});

module.exports = router;
