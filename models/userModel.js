const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : {
        type : String,
        required : true,
        minlength : 3
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    },
    admin : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
});

const Users = mongoose.model('User', UserSchema);

module.exports = Users;