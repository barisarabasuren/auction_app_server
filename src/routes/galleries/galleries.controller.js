const { getAllGalleries, getGalleryById } = require('../../modals/galleries/galleries.modal');

const httpGetAllGalleries = async(req, res) => {
    const response = await getAllGalleries()
    return res.status(response[0]).json(response[1])
}

const httpGetGalleryById = async(req,res) => {
    const gallery_id = req.params.gallery_id
    const response = await getGalleryById(gallery_id)
    return res.status(response[0]).json(response[1])
}

module.exports = {
    httpGetAllGalleries,
    httpGetGalleryById
}