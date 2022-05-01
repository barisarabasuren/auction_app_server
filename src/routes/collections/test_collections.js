const request = require('supertest');
const app = require('../../app');
const Collection = require('../../modals/collections/collections.mongo');

const collectionsTests = () => {
    return (
        describe ('/collections', () => {
            let accessToken = null
            describe('Test POST /collections', () => {
                beforeAll((done) => {
                    request(app)
                    .post('/auth/gallery/token')
                    .send({
                        email: "test@gmail.com",
                        password: "password"
                    })
                    .end((err, res) => {
                        accessToken = res.body.accessToken;
                        done()
                    })                    
                })

                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/collections')
                        .auth(accessToken, { type: 'bearer' })
                        .send({
                            collection_name: "test collection",
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["description", "image"]})
                    })

                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/collections')
                        .auth(accessToken, { type: 'bearer' })
                        .send({

                        })
                        .expect(400)
                        expect(response.body).toStrictEqual({missingCredentials: ["collection_name", "description", "image"]})
                })

                test('It should respond with 201', async () => {
                    const response = await request(app)
                        .post('/collections')
                        .auth(accessToken, { type: 'bearer' })
                        .send({
                            collection_name: "test collection",
                            description: "test",
                            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ZDF_logo%21_Logo_2021.svg/640px-ZDF_logo%21_Logo_2021.svg.png"
                        })
                        .expect(201)
                })

                test('Existing collection, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/collections')
                        .auth(accessToken, { type: 'bearer' })
                        .send({
                            collection_name: "test collection",
                            description: "test",
                            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ZDF_logo%21_Logo_2021.svg/640px-ZDF_logo%21_Logo_2021.svg.png"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual('Collection already exists')
                })

                test('Type Error, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/collections')
                        .auth(accessToken, { type: 'bearer' })
                        .send({
                            collection_name: "new collection",
                            description: [1, 2, 3],
                            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ZDF_logo%21_Logo_2021.svg/640px-ZDF_logo%21_Logo_2021.svg.png"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({"typeError": ["description"]})
                })
            })

            describe('Test GET /collections/:gallery_id', () => {
                let gallery_id = null
                beforeAll((done) => {
                    request(app)
                        .get('/galleries') 
                        .end((err, res) => {
                            gallery_id = res.body[0].gallery_id
                            done()
                        })
                })

                test('Non-existing gallery_id, It should respond with 200', async () => {
                    const response = await request(app)
                        .get('/collections/SomeRandomGalleryId')
                        .expect(400)
                    expect(response.body).toStrictEqual('Gallery id does not exist')
                })

                test('It should respond with 200', async () => {
                    const response = await request(app)
                        .get(`/collections/${gallery_id}`)
                        .expect(200)
                    expect(response.body).toBeInstanceOf(Array)
                })
            })
        
            describe('Test GET /collections/collection/:collection_id', () => {
                test('It should respond with 200', async () => {
                    const collection = await Collection.find({}, {})
                    const collection_id = collection[0].collection_id
                    const response = await request(app)
                        .get(`/collections/collection/${collection_id}`)
                        .expect(200)
                    expect(response.body).toHaveProperty('gallery_id')
                    expect(response.body).toHaveProperty('collection_id')
                    expect(response.body).toHaveProperty('collection_name')
                    expect(response.body).toHaveProperty('description')
                })

                test('Non-existing collection_id, It should respond with 400', async () => {
                    const collection = await Collection.find({}, {})
                    const collection_id = collection[0].collection_id
                    const response = await request(app)
                        .get('/collections/collection/SomeRandomCollectionId')
                        .expect(400)
                    expect(response.body).toStrictEqual('There is no collection with this id')
                })
            })
        })
    )
}

module.exports = collectionsTests

