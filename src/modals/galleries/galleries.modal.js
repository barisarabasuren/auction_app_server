const { v1: uuidv1, v4: uuidv4, } = require('uuid');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { findMissingCredentials } = require('../../libs/libs');

const Gallery = require('./galleries.mongo');
const { addRefreshToken, doesRefreshTokenExist } = require('../galleryRefreshTokens/galleryRefreshTokens.modal');

const config = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
}

const getAllGalleries = async () => {
    try {
        const galleries = await Gallery.find({}, {
            gallery_id: 1, gallery_name: 1, logo: 1, _id: 0
        })
        return([200, galleries]) 
    }
    catch {
        return ([500, 'Something went wrong'])
    }
}

const getGalleryById = async(gallery_id) => {
    try {
        const gallery = await Gallery.findOne({
            gallery_id: gallery_id
        }, {
            gallery_name: 1, description: 1, _id: 0
        })
        if(!gallery) {
            return ([400, 'Gallery id does not exist'])
        }
        return([200, gallery]) 
    }
    catch {
        return ([500, 'Something went wrong'])
    } 
}

const gallerySignUp = async(body) => {
    const requiredFields = [
        'gallery_name',
        'logo',
        'email',
        'password'
    ]
    
    const missingCredentials = findMissingCredentials(body, requiredFields)
    
    if(missingCredentials.length) {
        return ([400, {missingCredentials: missingCredentials}])
    }
    const doesGalleryExist = await doesGalleyExistByEmail(body.email)

    if(doesGalleryExist) {
        return ([400, 'This email is already registered'])
    }

    const hashedPassword = (body.password?
        await bcrypt.hash(body.password, 10):
        null
    );

    const gallery_id = uuidv1();

    const newGallery = new Gallery({
        gallery_id: gallery_id,
        gallery_name: body.gallery_name,
        logo: body.logo,
        email: body.email,
        password: hashedPassword
    })

    try {
        await newGallery.save()
        return ([201, 'Created'])
    } catch(err) {
        const errorFields = Object.keys(err.errors)
        return ([400, {typeError: errorFields}])
    }
}

const generateAccessToken = (jwtGallery) => {
    return jwt.sign(
        jwtGallery, 
        config.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m'
        }
    )
}

const galleryGetToken = async(body) => {
    const requiredFields = [
        'email',
        'password'
    ]
    
    const missingCredentials = findMissingCredentials(body, requiredFields)
    
    if(missingCredentials.length) {
        return ([400, {missingCredentials: missingCredentials}])
    }

    const gallery = await Gallery.findOne(
        {email: body.email}, 
        {gallery_id: 1, password: 1, _id:0
    })

    if(!gallery) {
        return ([400, 'Email has not registered'])
    } 

    const doesPasswordMatch = await bcrypt.compare(body.password, gallery.password)

    if(!doesPasswordMatch) {
        return ([400, 'Wrong password'])
    }

    try {
        const jwtGallery = {
            gallery_id: gallery.gallery_id
        }

        const accessToken = generateAccessToken(jwtGallery)

        const refreshToken = jwt.sign(
            jwtGallery,
            config.REFRESH_TOKEN_SECRET
        )

        addRefreshToken(refreshToken)

        return ([200, {accessToken: accessToken, refreshToken: refreshToken}])
    } catch(err) {
        return ([500, 'Something went wrong'])
    }
}

const galleryGetAccessToken = async (body) => {
    const requiredFields = [
        'refreshToken'
    ]
    
    const missingCredentials = findMissingCredentials(body, requiredFields)
    
    if(missingCredentials.length) {
        return ([400, {missingCredentials: missingCredentials}])
    }

    const refreshToken = body.refreshToken;

    if(!( await doesRefreshTokenExist(refreshToken))) {
        return ([403, 'Refresh token does not exist on the database']);
    } 

    const response = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, jwtGallery) => {
        if(err) {
            return ([500, 'Something went wrong'])
        }
        const accessToken = generateAccessToken({gallery_id: jwtGallery.gallery_id})
        return ([200, {accessToken: accessToken}])
    })

    return response
}

const authenticateGalleryToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, jwtGallery) =>{
        if(err) return res.sendStatus(403);
        req.jwtGallery = jwtGallery;
        next();
    })
}

const doesGalleyExistByEmail = async (email) => {
    const response = await Gallery.exists({email: email})
    return Boolean(response)
}

module.exports ={
    getAllGalleries,
    getGalleryById,
    gallerySignUp,
    galleryGetToken,
    authenticateGalleryToken,
    galleryGetAccessToken
}