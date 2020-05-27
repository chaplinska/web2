const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = mongoose.Schema({
    name: {
        type: String,
    },
    address: {
        type: String
    },
    storage: [{
        type: Schema.Types.ObjectId , ref: 'storage'
    }]
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

const Shops = mongoose.model('shops', shopSchema);

module.exports = { Shops };
