var mongoose = require('mongoose');

var foodSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    cost: Number
});
 
var Food = mongoose.model('FoodType', foodSchema);
 
module.exports = Food;