const mongoose = require('mongoose');
const db = require("./connect.js");
const Order = require("../models/orderSchema.js");
const FoodType = require("../models/foodSchema.js");
const UserContent = require("../models/userSchema.js");
const Basket = UserContent.Basket;
const User = UserContent.User;


function calculateCost(ftype, hasSalad, hasDrink, qty){
	return (ftype.cost + (hasSalad ? 5 : 0) + (hasDrink ? 3 : 0)) * qty;
}

//obviously not healthy, but this isn't a proper login system, it's a test ground
async function getUsers(req,res){
	const users = await User.find({}, {_id : 1, name : 1, balance:1});
	res.send(users);
}

async function getSpecificUser(req, res){
	var id = req.params.id;
	const user = await User.findById(id).populate('basket');
	res.send(user);
}

async function getFoodTypes(req, res){
	const orders = await FoodType.find({}, {_id : 0, name : 1});
	res.send(orders);
}

async function getOrders(req, res){
	const orders = await Order.find({}, {name : 1, foodType: 1, hasSalad : 1, hasDrink : 1, cost: 1, _id : 1});
	res.send(orders);
}

async function getUserOrders(req,res){
	var id = req.params.basket_id;
	const basket = await Basket.findById(id).populate('orders');
	res.send(basket.orders);
}

async function createUser(req, res){
	const {name, balance} = req.body;

	var id = mongoose.Types.ObjectId();

	const newbasket = new Basket({
		_id : new mongoose.Types.ObjectId(),
		orders: []
	})
	const result = await newbasket.save(function (err){
		if (err) res.status(400).send("oops");

		const newuser = new User({
			_id : id,
			name : name,
			balance : balance,
			basket : newbasket._id
		})

		newuser.save(function(err){
			if (err) res.status(400).send("oops");
		})
	});

	res.send(result);
}

async function createFoodType(req, res){
	const {name, cost} = req.body;
	const newtype = new FoodType({
		_id : mongoose.Types.ObjectId(),
		name : name,
		cost : cost
	}) 
	const result = await newtype.save();
	res.send(result);
}

async function createOrder(req, res){
	const {user, name, foodType, hasSalad, hasDrink, qty} = req.body;

	const ftype = await FoodType.findOne({name : foodType});
	var cost = calculateCost(ftype, hasSalad,hasDrink, qty);

	const neworder = new Order({
		_id : mongoose.Types.ObjectId(),
		name : name,
		foodType: ftype.name,
		hasSalad : hasSalad,
		hasDrink : hasDrink,
		qty: qty,
		cost : cost
	})


	const result = await neworder.save(function(err, order){
		if (err) return console.error(err);
		/*Basket.findById(user.basket._id).exec(function (err, bask){
			if (err) res.status(400).send("couldn't find basket");
			bask.orders.push(neworder);
			res.send(order.toObject());
		}); */
		Basket.updateOne({_id : user.basket._id}, {$push: {orders: {$each: [neworder]}}}, {upsert:true}, function(err){
			if (err) {console.log(err);} else {
				res.send(order);
			}
		})
	});
}

async function deleteOrder(req, res){
	const {order_id, basket_id} = req.body;

	await Order.findByIdAndDelete(order_id, function(err, data){
		if (err) res.status(400).send("couldn't delete");
        Basket.updateOne({_id : basket_id}, { $pull: {orders : {$in : [order_id]}}}, function(err, data){
        	res.send(data);
        });
	});
}

async function makePurchase(req, res){
	const {id} = req.body;

	var cost = 0;
	const user = await User.findById(id);
	const basket = await Basket.findById(user.basket).populate('orders').then(function(basket){
		for (var i in basket.orders){
			cost = cost + basket.orders[i].cost;
			if (cost > user.balance){
				console.log(cost);
				console.log(user.balance);
				res.status(400).send("Not enough funds...");
				return;
			}
		}	
		user.balance -= cost;
		user.save();
		basket.orders = [];
		basket.save(function(err){
			if (err) {
				res.status(400).send("oops");
				return;
			};
			res.status(200).send("ok!");
		});
	});

}


module.exports = {
	getUsers,
	getSpecificUser,
	getUserOrders,
	getFoodTypes,
	getOrders,
	createUser,
	createFoodType,
	createOrder,
	deleteOrder,
	makePurchase
}