const { 
    addCollection,
    getCollectionsByGalleryId,
    getCollectionById
} = require("../../modals/collections/collections.modal")

const httpAddCollection = async (req, res) => {
    const body = req.body;
    const jwtGallery = req.jwtGallery;

    const response = await addCollection(body, jwtGallery);
    return res.status(response[0]).json(response[1])
}

const httpGetCollectionsGalleryById = async (req, res) => {
    const gallery_id = req.params.gallery_id
    const response = await getCollectionsByGalleryId(gallery_id);
    return res.status(response[0]).json(response[1])
}

const httpGetCollectionById = async (req, res) => {
    const collection_id = req.params.collection_id
    const response = await getCollectionById(collection_id);
    return res.status(response[0]).json(response[1])
}

module.exports = {
    httpAddCollection,
    httpGetCollectionsGalleryById,
    httpGetCollectionById
}