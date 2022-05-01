const { 
    addArtwork,
    getArtworksByCollectionId,
    getArtworkById
} = require("../../modals/artworks/artworks.modal")


const httpAddArtwork = async (req, res) => {
    const body = req.body;
    const jwtGallery = req.jwtGallery
    const response = await addArtwork(body, jwtGallery);
    return res.status(response[0]).json(response[1])
}

const httpGetArtworksByCollectionId = async(req, res) => {
    const collection_id = req.params.collection_id
    const response = await getArtworksByCollectionId(collection_id);
    return res.status(response[0]).json(response[1])
}

const httpGetArtworkById = async(req,res) => {
    const artwork_id = req.params.artwork_id;
    const response = await getArtworkById(artwork_id);
    return res.status(response[0]).json(response[1])
}

module.exports = {
    httpAddArtwork,
    httpGetArtworksByCollectionId,
    httpGetArtworkById
}