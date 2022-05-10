const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    password: String,
    contact : String
}); 
module.exports = mongoose.model('user', userSchema);