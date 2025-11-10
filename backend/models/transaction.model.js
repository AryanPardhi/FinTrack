const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId : {type : mongoose.Types.ObjectId , ref : 'User'},
    accountId : {type : mongoose.Types.ObjectId , ref : 'Account'},
    amountCents : Number,
    type : {type : String , enum: ['expense', 'income'], require: true},
    categoryId : {type : mongoose.Types.ObjectId , ref : 'Category'},
    date : {type : Date , default : Date.now},
    note : String,
    createdAt : {type : Date , default : Date.now}
});

module.exports = mongoose.model('Transaction' , transactionSchema);