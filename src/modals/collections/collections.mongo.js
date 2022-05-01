const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    gallery_id: {
        type: String,
        required: true
    },
    collection_id: {
        type: String,
        required: true
    },
    collection_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

const Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection