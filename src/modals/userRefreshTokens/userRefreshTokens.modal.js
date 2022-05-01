const UserRefreshToken = require('./userRefreshTokens.mongo')

const addRefreshToken = async (refreshToken) => {
    const newRefreshToken = new UserRefreshToken({
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
    const response = UserRefreshToken.exists({refreshToken: refreshToken})
    return Boolean(await response)
}

module.exports = {
    addRefreshToken,
    doesRefreshTokenExist
}