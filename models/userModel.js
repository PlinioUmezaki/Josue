var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/debtDB');
var schema = mongoose.schema;

var userSchema = {
    "usuario": {type: String, required: true},
    "senha": {type: String, required: true}
}