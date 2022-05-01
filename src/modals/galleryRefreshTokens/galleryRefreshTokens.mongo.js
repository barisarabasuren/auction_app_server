const mongoose = require('mongoose');

const galleryRefreshToken = new mongoose.Schema({
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


const GalleryRefreshToken = mongoose.model('GalleryRefreshToken', galleryRefreshToken)

module.exports = GalleryRefreshToken
