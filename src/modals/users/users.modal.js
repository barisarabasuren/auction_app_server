const { v1: uuidv1 } = require('uuid');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { findMissingCredentials } = require('../../libs/libs');

const User = require('./users.mongo');
const { addRefreshToken, doesRefreshTokenExist } = require('../userRefreshTokens/userRefreshTokens.modal');

const config = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
}

const signUp = async(body) => {
    const requiredFields = [
        'name',
        'surname',
        'email',
        'password'
    ]
    
    const missingCredentials = findMissingCredentials(body, requiredFields)
    
    if(missingCredentials.length) {
        return ([400, {missingCredentials: missingCredentials}])
    }

    const doesUserExist = await doesUserExistByEmail(body.email)

    if(doesUserExist) {
        return ([400, 'This email is already registered'])
    }

    const hashedPassword = (
        body.password?
        await bcrypt.hash(body.password, 10):
        null
    );
        
    const user_id = uuidv1();

    const newUser = new User ({
        user_id: user_id,
        name: body.name,
        surname: body.surname,
        email: body.email,
        password: hashedPassword
    })

    try {
        await newUser.save()
        return ([201, 'Created'])
    } catch(err) {
        const errorFields = Object.keys(err.errors)
        return ([400, {typeError: errorFields}])
    }

}

const getToken = async(body) => {
    const requiredFields = [
        'email',
        'password'
    ]
    
    const missingCredentials = findMissingCredentials(body, requiredFields)
    
    if(missingCredentials.length) {
        return ([400, {missingCredentials: missingCredentials}])
    }

    const user = await User.findOne(
        {email: body.email},
        {user_id: 1, password: 1, _id: 0}
    )

    if(!user) {
        return ([400, 'Email has not registered'])
    }

    const doesPasswordMatch = await bcrypt.compare(body.password, user.password)

    if(!doesPasswordMatch) {
        return ([400, 'Wrong password'])
    }

    try {
        const jwtUser = {
            user_id: user.user_id
        }

        const accessToken = generateAccessToken(jwtUser)

        const refreshToken = jwt.sign(
            jwtUser,
            config.REFRESH_TOKEN_SECRET
        )

        addRefreshToken(refreshToken)

        return ([200, {accessToken: accessToken, refreshToken: refreshToken}])

    } catch(err) {
        return ([500, 'Something went wrong'])
    }
}

const getAccessToken = async(body) => {
    const requiredFields = [
        'refreshToken'
    ]
    
    const missingCredentials = findMissingCredentials(body, requiredFields)
    
    if(missingCredentials.length) {
        return ([400, {missingCredentials: missingCredentials}])
    }
    const refreshToken = body.refreshToken;

    if(!( await doesRefreshTokenExist(refreshToken))){
        return ([403, 'Refresh token does not exist on the database']);
    } 

    const response = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, jwtUser) => {
        if(err) {
            return ([500, 'Something went wrong'])
        }
        const accessToken = generateAccessToken({user_id: jwtUser.user_id})
        return ([200, {accessToken: accessToken}])
    })

    return response
}

const authenticateUserToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, jwtUser) =>{
        if(err) {
            return res.sendStatus(403);
        }

        req.jwtUser = jwtUser;
        next();
    })
}

const generateAccessToken = (jwtUser) => {
    return jwt.sign(
        jwtUser, 
        config.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m'
        }
    )
}

const doesUserExistByEmail = async(email) => {
    const response = await User.exists({email: email})
    return Boolean(response)
}

const getUser = async(user_id) => {
    const response = await User.findOne({
        user_id: user_id
    }, {
        _id: 0, name: 1, surname: 1, email: 1
    })
    return ([200, response])
}

module.exports ={
    signUp,
    getToken,
    getAccessToken,
    authenticateUserToken,
    getUser
}