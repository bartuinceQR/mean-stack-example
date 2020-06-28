var express = require('express');
var db = require('./queries.js');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getOrders', db.getOrders);
router.get('/foodTypes', db.getFoodTypes);
router.get('/siteUsers', db.getUsers);
router.get('/siteUsersGet/:id', db.getSpecificUser);
router.get('/siteUsersOrder/:basket_id',db.getUserOrders)

router.post('/siteUsers', db.createUser);
router.post('/foodTypes', db.createFoodType);
router.post('/createOrder', db.createOrder);
router.post('/deleteOrder', db.deleteOrder);

router.post('/makePurchase', db.makePurchase);

module.exports = router;
