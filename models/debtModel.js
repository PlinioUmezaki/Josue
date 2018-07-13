var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/debtDB');
var schema = mongoose.Schema;
var debtSchema = {
    "descricao": {type: String, "default": "Não há descrição"}, 
    "valor": {type: Number, "default":0},
    "devedorId": {type: String, required: true},
    "credorId": {type: String, required: true}
};
module.exports = mongoose.model('debts', debtSchema);