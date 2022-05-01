const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL
const MONGO_URL_TEST = process.env.MONGO_URL_TEST

mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready!')
});

mongoose.connection.on('error', (err) => {
    console.error(err)
});

const mongoConnect = async (env) => {
    await mongoose.connect(MONGO_URL);
}

const mongoDisconnect = async () => {
    await mongoose.disconnect()
}

const setupTestDB = async() => {
    await beforeAll(async () => {
      await mongoose.connect(MONGO_URL_TEST)
    })
    return
}

const mongoDisconnectTest = async() => {
    await dropAllCollections()
    await mongoose.connection.close()
}

const dropAllCollections = async() => {
    const collections = Object.keys(mongoose.connection.collections)

    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        try {
        await collection.drop()
        } catch (error) {
            if (error.message === 'ns not found') return
            if (error.message.includes('a background operation is currently running')) return
                console.log(error.message)
        }
    }
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
    setupTestDB,
    mongoDisconnectTest
}