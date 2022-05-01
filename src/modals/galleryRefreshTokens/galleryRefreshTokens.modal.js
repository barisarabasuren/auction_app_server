const GalleryRefreshToken = require('./galleryRefreshTokens.mongo')

const addRefreshToken = async (refreshToken) => {
    const newRefreshToken = new GalleryRefreshToken({
        refreshToken: refreshToken
    })
    try {
        await newRefreshToken.save()
        return('Success')
    }
    catch {
        return('Something went wrong')
    }
}

const doesRefreshTokenExist = async (refreshToken) => {
    const response = GalleryRefreshToken.exists({refreshToken: refreshToken})
    return Boolean(await response)
}

module.exports = {
    addRefreshToken,
    doesRefreshTokenExist
}