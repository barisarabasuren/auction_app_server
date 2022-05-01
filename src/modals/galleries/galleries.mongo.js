const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    gallery_id: {
        type: String,
        required: true
    },
    gallery_name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


const Gallery = mongoose.model('Gallery', gallerySchema)

module.exports = Gallery
