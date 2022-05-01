const { v1: uuidv1 } = require('uuid');

const Artwork = require('./artworks.mongo');
const { doesCollectionExistByIds, doesCollectionExistById } = require('../collections/collections.modal');
const { dateToCron, findMissingCredentials } = require('../../libs/libs');
const {auctionStartScheduler, auctionEndScheduler} = require('../../libs/schedulers')

const doesArtworkExistByIdAndName = async(collection_id, artwork_name) => {
    const response = await Artwork.exists({collection_id: collection_id, artwork_name: artwork_name})
    return Boolean(response)
}

const addArtwork = async (body, jwtGallery) => {
    const requiredFields = [
        'collection_id',
        'artwork_name',
        'description',
        'beginning_price',
        'auction_starts',
        'auction_ends',
        'image'
    ]
    
    const missingCredentials = findMissingCredentials(body, requiredFields)

    if(missingCredentials.length) {
        return ([400, {missingCredentials: missingCredentials}])
    }

    if(body.beginning_price <= 0) {
        return([400, 'Price must be greater than 0'])
    }

    if(new Date(body.auction_starts) < new Date()) {
        return([400, 'Auction cannot start on a previous time'])
    }

    const auctionDuration = new Date(body.auction_ends) - new Date(body.auction_starts)

    if(auctionDuration < 1000 * 60 * 60 * 2) {
        return([400, 'Auction has to last at least for 2 hours'])
    }

    const doesCollectionExist = await doesCollectionExistByIds(jwtGallery.gallery_id, body.collection_id);
    const doesArtworkExist = await doesArtworkExistByIdAndName(body.collection_id, body.artwork_name);

    if(!doesCollectionExist) {
        return([400, 'There is no collection with this id'])
    }
    if(doesArtworkExist) {
        return([400, 'Artwork already exists'])
    }
    const artwork_id = uuidv1();

    const newArtwork = new Artwork({
        gallery_id: jwtGallery.gallery_id,
        collection_id: body.collection_id,
        artwork_id: artwork_id,
        artwork_name: body.artwork_name,
        image: body.image,
        description: body.description,
        beginning_price: body.beginning_price,
        auction_starts: body.auction_starts,
        auction_ends: body.auction_ends
    })

    try {
        const startDate = dateToCron(newArtwork.auction_starts)
        const endDate = dateToCron(newArtwork.auction_ends)

        await auctionStartScheduler(newArtwork.artwork_id, startDate);
        await auctionEndScheduler(newArtwork.artwork_id, endDate )

        await newArtwork.save()
        return ([200, 'Created'])
    } catch(err) {
        const errorFields = Object.keys(err.errors)
        return ([400, {typeError: errorFields}])
    }
}

const getArtworksByCollectionId = async(collection_id) => {
    try {
        const artworks = await Artwork.find({
            collection_id: collection_id
        }, {
            artwork_id: 1, artwork_name: 1, image: 1, _id:0
        })

        if(!artworks.length) {
            const doesCollectionExist = await doesCollectionExistById(collection_id)
            if(!doesCollectionExist) {
                return ([400, 'There is no collection with this id'])
            }
        }
        
        return ([200, artworks])
    }
    catch {
        return ([400, 'Something went wrong'])
    }
}

const getArtworkById = async(artwork_id) => {
    try {
        const artwork = await Artwork.findOne({
            artwork_id: artwork_id
        }, {
            _id:0
        })

        if(!artwork) {
            return ([400, 'There is no artwork with this id'])
        }
        
        return ([200, artwork])
    }
    catch {
        return ([400, 'Something went wrong'])
    }
}

const bidOnArtwork = async(body, user_id, artwork_id) => {
    const requiredFields = [
        'price'
    ]

    const missingCredentials = findMissingCredentials(body, requiredFields)

    if(missingCredentials.length) {
        return ([400, {missingCredentials: missingCredentials}])
    }    
    
    const artworkArray = await getArtworkById(artwork_id)
    
    if(artworkArray[0] === 400) {
        return ([400, 'Artwork does not exist'])
    }

    const artwork = artworkArray[1]

    if(!artwork.isAuctionOn) {
        return ([400, 'Auction is off']) 
    }
    
    if(body.price <= 0) {
        return ([400, 'Bid price must be greater than 0']) 
    }

    if(body.price <= artwork.beginning_price) {
        return ([400, 'New bid have to be higher than beginning price']) 
    }

    const highestBid = findHighestBid(artwork);

    if(body.price <= highestBid) {
        return ([400, 'New bid have to be higher than the highest bid']) 
    }

    const bid_id = uuidv1();
    
    const bid = {
        bid_id: bid_id,
        user_id: user_id,
        price: body.price
    }

    try {
        await Artwork.updateOne({
            artwork_id: artwork_id
        }, {
            $push: { bids: bid }
        })  

        return ([200, 'Bid is successful'])
    }
    catch {
        return ([400, 'Something went wrong'])
    }
}


const findHighestBid = (artwork) => {
    const bidPrices = artwork.bids.map(bid => {
        return bid.price
    })

    const maxBid = Math.max(...bidPrices)

    return maxBid
}

const getBidHistory = async(user_id) => {
    const biddedArtworks = await Artwork.find({
        "bids.user_id": user_id
    }, {
         _id: 0, artwork_id: 1, artwork_name: 1, image: 1, bids: 1
    })

    for(const biddedArtwork of biddedArtworks) {
        const bids = biddedArtwork.bids
        for(var i = 0; i < bids.length; i++) {
            if(bids[i].user_id !== user_id) {
                bids.splice(i, 1)
            }
        }
    }

    return ([200, biddedArtworks])
}

module.exports = {
    addArtwork,
    getArtworksByCollectionId,
    getArtworkById,
    bidOnArtwork,
    getBidHistory
}