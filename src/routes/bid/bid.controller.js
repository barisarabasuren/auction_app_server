const { bidOnArtwork, getBidHistory } = require("../../modals/artworks/artworks.modal")

const httpBidOnArtwork = async(req,res) => {
    const body = req.body
    const artwork_id = req.params.artwork_id
    const user_id = req.jwtUser.user_id
    const response = await bidOnArtwork(body, user_id, artwork_id)
    return res.status(response[0]).json(response[1])
}

const httpGetBidHistory = async(req, res) => {
    const user_id = req.jwtUser.user_id
    const response = await getBidHistory(user_id)
    return res.status(response[0]).json(response[1])
}

module.exports = {
    httpBidOnArtwork,
    httpGetBidHistory
}