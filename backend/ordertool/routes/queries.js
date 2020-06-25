const mongoose = require('mongoose');
const db = require("./connect.js");
const Order = require("../models/orderSchema.js");
const FoodType = require("../models/foodSchema.js");


function calculateCost(ftype, hasSalad, hasDrink){
	return ftype.cost + (hasSalad ? 5 : 0) + (hasDrink ? 3 : 0);
}

async function getFoodTypes(req, res){
	const orders = await FoodType.find({}, {_id : 0, name : 1});
	res.send(orders);
}

async function getOrders(req, res){
	const orders = await Order.find({}, {name : 1, foodType: 1, hasSalad : 1, hasDrink : 1, cost: 1, _id : 0});
	res.send(orders);
}

async function createFoodType(req, res){
	const {name, cost} = req.body;
	var id = mongoose.Types.ObjectId();
	const newtype = new FoodType({
		_id : id,
		name : name,
		cost : cost
	}) 
	const result = await newtype.save();
	res.send(result);
}

async function createOrder(req, res){
	const {name, foodType, hasSalad, hasDrink} = req.body;
	var id = mongoose.Types.ObjectId();
	const ftype = await FoodType.findOne({name : foodType});
	var cost = calculateCost(ftype, hasSalad,hasDrink);

	const neworder = new Order({
		_id : id,
		name : name,
		foodType: ftype.name,
		hasSalad : hasSalad,
		hasDrink : hasDrink,
		cost : cost
	})
	const result = await neworder.save(function(err, order){
		if (err) return console.error(err);
		console.log(order);
		res.send(order.toObject());
	});

}

module.exports = {
	getFoodTypes,
	getOrders,
	createFoodType,
	createOrder
}