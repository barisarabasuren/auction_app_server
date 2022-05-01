const express = require('express');
const { httpGetAllGalleries, httpGetGalleryById } = require('./galleries.controller')

const galleriesRouter = express.Router();

galleriesRouter.get('/galleries', httpGetAllGalleries);
galleriesRouter.get('/galleries/:gallery_id', httpGetGalleryById)

module.exports = galleriesRouter;