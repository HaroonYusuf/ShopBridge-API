const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    name: String,
    description: String,
    price: String,
    category: String,
    userId: String
});
module.exports = mongoose.model('inventories', inventorySchema);