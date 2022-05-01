const express = require('express');
const { 
    httpAddArtwork,
    httpGetArtworksByCollectionId,
    httpGetArtworkById
} = require('./artworks.controller');
const { authenticateGalleryToken } = require('../../modals/galleries/galleries.modal')

const artworksRouter = express.Router();

artworksRouter.post('/artworks', authenticateGalleryToken, httpAddArtwork);
artworksRouter.get('/artworks/:collection_id', httpGetArtworksByCollectionId);
artworksRouter.get('/artworks/artwork/:artwork_id', httpGetArtworkById);


module.exports = artworksRouter;