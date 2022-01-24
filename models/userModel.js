const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    anonMessages: {
        type: Array
    },
    topic: { type: String },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isReceivingMessages: {
        type: Boolean,
        default: true
    }
},
{ timestamps: true }
)
const User = mongoose.model('user', userSchema)
module.exports = User;