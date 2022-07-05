const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const wishSchema = new Schema(
    {
        myName:{
            type: String,
        },
        friendName: String,
        friendMail: String
    }
);

const wishes = mongoose.model('wishes', wishSchema);
module.exports = wishes;