var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    balance: Number,
    basket : {type : mongoose.Schema.Types.ObjectId, ref : 'Basket'},
    created: { 
        type: Date,
        default: Date.now
    }
});

var basketSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    orders : [{type : mongoose.Schema.Types.ObjectId, ref : 'Order'}],
    created: { 
        type: Date,
        default: Date.now
    }
});


 
var User = mongoose.model('User', userSchema);
var Basket = mongoose.model('Basket', basketSchema);
 
module.exports = {
	User,
	Basket
}