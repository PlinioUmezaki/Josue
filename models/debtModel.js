var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/debtDB');
var schema = mongoose.Schema;
var debtSchema = {
    "descricao": String,
    "valor": String,
    "devedorId": String,
    "credorId": String
};
module.exports = mongoose.model('debts', debtSchema);