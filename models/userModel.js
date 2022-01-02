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
    email: {
        type: String
    }
},
{ timestamps: true }
)
const User = mongoose.model('user', userSchema)
module.exports = User;