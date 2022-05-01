const express = require('express');
const { authenticateUserToken } = require('../../modals/users/users.modal');
const { 
    httpSignUp, 
    httpGetToken,
    httpGetAccessToken,
    httpGallerySignUp, 
    httpGalleryGetToken,
    httpGalleryGetAccessToken,
    httpGetUser
} = require('./auth.controller')

const authRouter = express.Router();

authRouter.post('/auth/user/signup', httpSignUp)
authRouter.post('/auth/user/token', httpGetToken)
authRouter.post('/auth/user/refresh', httpGetAccessToken)
authRouter.get('/auth/user', authenticateUserToken, httpGetUser)

authRouter.post('/auth/gallery/signup', httpGallerySignUp)
authRouter.post('/auth/gallery/token', httpGalleryGetToken)
authRouter.post('/auth/gallery/refresh', httpGalleryGetAccessToken)

module.exports = authRouter;