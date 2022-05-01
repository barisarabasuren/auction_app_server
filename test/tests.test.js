const { setupTestDB, mongoDisconnectTest } = require('../src/services/mongo');

const authGalleryTests = require('../src/routes/auth/test_auth.gallery')
const authUserTests = require('../src/routes/auth/test_auth.user');
const galleriesTests = require('../src/routes/galleries/test_galleries');
const collectionsTests = require('../src/routes/collections/test_collections');
const artworkTests = require('../src/routes/artworks/test_artworks');
const bidTests = require('../src/routes/bid/test_bid');

module.exports = describe ('ALL TESTS', () => {
    setupTestDB();

    afterAll(async() => {
        await mongoDisconnectTest();
    });

    authGalleryTests();
    authUserTests();
    galleriesTests();
    collectionsTests();
    artworkTests();
    bidTests();
})