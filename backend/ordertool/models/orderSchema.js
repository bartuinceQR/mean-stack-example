var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    foodType: String,
    hasSalad: Boolean,
    hasDrink: Boolean,
    qty: Number,
    cost: Number,
    created: { 
        type: Date,
        default: Date.now
    }
});
 
var Order = mongoose.model('Order', orderSchema);
 
module.exports = Order;