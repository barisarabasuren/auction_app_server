const express = require('express');
const { authenticateUserToken } = require('../../modals/users/users.modal');
const { httpBidOnArtwork, httpGetBidHistory } = require('./bid.controller');

const bidRouter = express.Router();

bidRouter.post('/bid/:artwork_id', authenticateUserToken, httpBidOnArtwork)
bidRouter.get('/bid/history', authenticateUserToken, httpGetBidHistory)

module.exports = bidRouter;