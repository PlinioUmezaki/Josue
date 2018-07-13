var mongoose = require("mongoose");
var crypto = require('crypto');
mongoose.connect('mongodb://localhost:27017/debtDB');
var schema = mongoose.Schema;

var debtSchema = {
    "descricao": {type: String, "default": "Não há descrição"}, 
    "valor": {type: Number, "default":0},
    "credorId": {type: String},
    "devedorId": {type: String}
};

module.exports = mongoose.model('debts', debtSchema);