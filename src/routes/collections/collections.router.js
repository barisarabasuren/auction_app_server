const express = require('express');
const { 
    httpAddCollection ,
    httpGetCollectionsGalleryById,
    httpGetCollectionById
} = require('./collections.controller');
const { authenticateGalleryToken } = require('../../modals/galleries/galleries.modal')

const collectionRouter = express.Router();

collectionRouter.post('/collections', authenticateGalleryToken, httpAddCollection);
collectionRouter.get('/collections/:gallery_id', httpGetCollectionsGalleryById);
collectionRouter.get('/collections/collection/:collection_id', httpGetCollectionById)

module.exports = collectionRouter;