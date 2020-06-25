var express = require('express');
var db = require('./queries.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getOrders', db.getOrders);
router.get('/foodTypes', db.getFoodTypes);
router.post('/foodTypes', db.createFoodType);
router.post('/createOrder', db.createOrder);

module.exports = router;
