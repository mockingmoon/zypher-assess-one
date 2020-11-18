const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: {
        type: String,
        default: "BookWithoutName"
    }
}, {
    timestamps: true
});

const Books = mongoose.model('digiBook', bookSchema);

module.exports = Books;