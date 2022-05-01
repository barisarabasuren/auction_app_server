const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    bid_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const artworkSchema = new mongoose.Schema({
    gallery_id: {
        type: String,
        required: true
    },
    collection_id: {
        type: String,
        required: true
    },
    artwork_id: {
        type: String,
        required: true
    },
    artwork_name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    beginning_price: {
        type: Number,
        required: true
    },
    auction_starts: {
        type: Date,
        required: true
    },
    auction_ends: {
        type: Date,
        required: true
    },
    isAuctionOn: {
        type: Boolean,
        default: false
    },
    winner: {
        type: bidSchema,
        required: false
    },
    bids: {
        type: Array,
        ref: 'bidSchema'
    }
})

const Artwork = mongoose.model('Artwork', artworkSchema)

module.exports = Artwork