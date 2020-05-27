const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodSchema = mongoose.Schema({
    code: {
        type: Number,
    },
    name: String,
    country: ''
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

const Good = mongoose.model('goods', goodSchema);

module.exports = { Good };
