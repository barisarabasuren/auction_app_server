/// check artworks on db (scope: auction_starts: future)
/// create schedullar to start auction

/// check artworks on db (scope: winner: null)
/// define schedular to end auction
var cron = require('node-cron')
const Artwork = require('../modals/artworks/artworks.mongo')
const {dateToCron} = require('./libs')

const currentDate = new Date()
const cronDate = dateToCron(currentDate)
const previousDayDate = new Date(currentDate.getTime() - (1000 * 60 * 60 * 24))
const systemRestartDate = new Date(currentDate.getTime() + (1000 * 60 * 5))
const fairAuctionDate = new Date(currentDate.getTime() + (1000 * 60 * 60 * 2))

const auctionStartScheduler = async (artwork_id, cronDate) => {
    cron.schedule(cronDate, async() => {
        try{
            await Artwork.updateOne({
                artwork_id: artwork_id
            }, {
                isAuctionOn: true
            })
        } catch(err) {
            console.log(err)
        }
    })
}

const createAuctionStartSchedulers = async() => {
    const artworksToStart = await Artwork.find({
        auction_starts: {$gte: currentDate}
    }, {
        _id: 0,
        artwork_id: 1
    })

    for(const artwork of artworksToStart) {
        await auctionStartScheduler(artwork.artwork_id, cronDate)
    }
}

const findWinner = async(artwork_id) => {
    const bidsOfArtwork = await Artwork.findOne({
        artwork_id: artwork_id
    }, {
        _id: 0, bids: 1
    })

    const bids = bidsOfArtwork.bids
    const winner = bids[bids.length - 1]
    return winner
}

const auctionEndScheduler = async(artwork_id, cronDate) => {
    cron.schedule(cronDate, async() => {
        try{
            const winner = await findWinner(artwork_id)
            
            await Artwork.updateOne({
                artwork_id: artwork_id
            }, {
                isAuctionOn: false,
                winner: winner
            })
        } catch(err) {
            console.log(err)
        }
    })
}

const createAuctionEndSchedulers = async() => {
    const artworksToEnd = await Artwork.find({
        auction_ends: {$gte: currentDate}
    }, {
        _id: 0,
        artwork_id: 1
    })

    for(const artwork of artworksToEnd) {
        await auctionEndScheduler(artwork.artwork_id, cronDate)
    }
}

const startFailedAuctions = async () => {
    const artworksToStart = await Artwork.find(
        {
            auction_starts: {
                $gte: previousDayDate,
                $lt: systemRestartDate
            },
            isAuctionOn: false
        }, {
            _id: 0,
            artwork_id: 1,
            auction_ends: 1
        }
    )

    for(const artwork of artworksToStart) {
        if(artwork.auction_ends <= fairAuctionDate) {
            try{
                await Artwork.updateOne({
                    artwork_id: artwork.artwork_id
                }, {
                    winner: {
                        bid_id: 'fail',
                        user_id: 'fail',
                        price: 0
                    }
                })
            } catch(err) {
                console.log(err)
            }
        } else {
            console.log(artwork)
            try{
                await Artwork.updateOne({
                    artwork_id: artwork.artwork_id
                }, {
                    isAuctionOn: true
                })
            } catch(err) {
                console.log(err)
            }
        }
    }
}

const endFailedAuctions = async () => {
    const artworksToEnd = await Artwork.find(
        {
            auction_ends: {
                $gte: previousDayDate,
                $lt: systemRestartDate
            }
        }, {
            _id: 0,
            artwork_id: 1,
            auction_ends: 1,
        }
    )

    for(const artwork of artworksToEnd) {
        if(artwork.auction_ends <= systemRestartDate) {
            const winner = await findWinner(artwork.artwork_id)
                
            await Artwork.updateOne({
                artwork_id: artwork.artwork_id
            }, {
                isAuctionOn: false,
                winner: winner
            })
        }
    }
}

module.exports = {
    createAuctionStartSchedulers,
    createAuctionEndSchedulers,
    auctionStartScheduler,
    auctionEndScheduler,
    startFailedAuctions,
    endFailedAuctions
}