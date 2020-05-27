const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storageSchema = mongoose.Schema({
    number: {
        type: Number,
    },
    capacity: {
        type: Number
    },
    goods: [{
        code: {
            type: Number,
        },
        name: String,
        country: ''
    }]
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

const Storages = mongoose.model('storages', storageSchema);

module.exports = { Storages };
