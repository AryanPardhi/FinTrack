const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId : {type : mongoose.Types.ObjectId , ref : "User"},
    name : String,
    type : {type : String , enum:['expense','income'] , default : 'expense'}
});

module.exports = mongoose.model('Category',categorySchema);