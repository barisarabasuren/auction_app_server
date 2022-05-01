const { 
    signUp, 
    getToken,
    getAccessToken,
    getUser
} = require('../../modals/users/users.modal');
const { 
    gallerySignUp, 
    galleryGetToken,
    galleryGetAccessToken
 } = require('../../modals/galleries/galleries.modal')

const httpSignUp = async (req,res) => {
    const response = await signUp(req.body)
    return res.status(response[0]).json(response[1])
}

const httpGetToken = async (req,res) => {
    const response = await getToken(req.body)
    return res.status(response[0]).json(response[1])
}
const httpGetAccessToken = async (req, res) => {
    const response = await getAccessToken(req.body)
    return res.status(response[0]).json(response[1])
}

const httpGallerySignUp = async (req, res) => {
    const response = await gallerySignUp(req.body)
    return res.status(response[0]).json(response[1])
}

const httpGalleryGetToken = async (req, res) => {
    const response = await galleryGetToken(req.body)
    return res.status(response[0]).json(response[1])
}

const httpGalleryGetAccessToken = async (req, res) => {
    const response = await galleryGetAccessToken(req.body)
    return res.status(response[0]).json(response[1])
}

const httpGetUser = async(req, res) => {
    const user_id = req.jwtUser.user_id
    const response = await getUser(user_id)
    return res.status(response[0]).json(response[1])
}

module.exports = {
    httpSignUp,
    httpGetToken,
    httpGetAccessToken,
    httpGallerySignUp,
    httpGalleryGetToken,
    httpGalleryGetAccessToken,
    httpGetUser
}