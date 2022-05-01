const mongoose = require('mongoose');

const userRefreshToken = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        expires: '1440m', 
        default: Date.now 
    }
},)


const UserRefreshToken = mongoose.model('UserRefreshToken', userRefreshToken)

module.exports = UserRefreshToken
