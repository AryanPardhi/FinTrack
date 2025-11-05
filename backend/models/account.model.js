const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId : {type : mongoose.Types.ObjectId , ref : 'User' , required : true},
    name : String,
    type : String,
    accountNumber: { type: Number, required: true, unique: true },
    balanceCents : {type : Number , default : 0},
    currency : {type : String , default : 'INR'},
    cratedAt : {type : Date , default : Date.now}
});
module.exports = mongoose.model("Account",accountSchema);  