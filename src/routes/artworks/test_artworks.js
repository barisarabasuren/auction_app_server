const request = require('supertest');
const app = require('../../app');
const Artwork = require('../../modals/artworks/artworks.mongo');
const Collection = require('../../modals/collections/collections.mongo');

const artworkTests = () => {
    return(
        describe ('/artworks', () => {
            let collection_id = null
            let accessToken = null
            beforeAll(async () => {
                const collections = await Collection.find()
                collection_id = collections[0].collection_id 

                const response = await request(app)
                    .post('/auth/gallery/token')
                    .send({
                        email: "test@gmail.com",
                        password: "password"
                    })
                accessToken = response.body.accessToken;                
            })

            describe('Test POST /artworks', () => {
                let startDate = null
                let endDate = null
                let wrongStartDate = null

                beforeAll(() => {
                    const date = new Date()
                    startDate = new Date(date.getTime() + (1000 * 60 * 60 * 24))
                    endDate = new Date(date.getTime() + (1000 * 60 * 60 * 24 * 2))
                    wrongEndDate = new Date(date.getTime() + (1000 * 60 * 60 * 24) + (1000 * 60 * 60))
                    wrongStartDate = new Date(date.getTime() - (1000 * 60 * 60 * 24 * 1))
                })
            
                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/artworks')
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({   
                            artwork_name: "test",
                            description: "test",
                            beginning_price: 1,
                            auction_starts: startDate,
                            auction_ends: endDate
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["collection_id", "image"]})
                })
                
                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/artworks')
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({   
                            artwork_name: "test",
                            description: "test",
                            auction_starts: startDate,
                            auction_ends: endDate
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["collection_id", "beginning_price", "image"]})
                })

                test('Wrong auction_starts, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/artworks')
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({   
                            collection_id: collection_id, 
                            artwork_name: "test",
                            description: "test",
                            beginning_price: 1,
                            auction_starts: wrongStartDate,
                            auction_ends: endDate,
                            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ZDF_logo%21_Logo_2021.svg/640px-ZDF_logo%21_Logo_2021.svg.png"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual('Auction cannot start on a previous time')
                })

                test('Wrong auction_ends, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/artworks')
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({   
                            collection_id: collection_id, 
                            artwork_name: "test",
                            description: "test",
                            beginning_price: 1,
                            auction_starts: startDate,
                            auction_ends: wrongEndDate,
                            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ZDF_logo%21_Logo_2021.svg/640px-ZDF_logo%21_Logo_2021.svg.png"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual('Auction has to last at least for 2 hours')
                })

                test('Wrong price, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/artworks')
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({   
                            collection_id: collection_id, 
                            artwork_name: "test",
                            description: "test",
                            beginning_price: -150,
                            auction_starts: startDate,
                            auction_ends: endDate,
                            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ZDF_logo%21_Logo_2021.svg/640px-ZDF_logo%21_Logo_2021.svg.png"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual('Price must be greater than 0')
                })

                test('It should respond with 200', async () => {
                    const response = await request(app)
                        .post('/artworks')
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({   
                            collection_id: collection_id, 
                            artwork_name: "test",
                            description: "test",
                            beginning_price: 1,
                            auction_starts: startDate,
                            auction_ends: endDate,
                            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ZDF_logo%21_Logo_2021.svg/640px-ZDF_logo%21_Logo_2021.svg.png"
                        })
                        .expect(200)
                    })
            })
    
            describe('Test GET /artworks:collection_id', () => {
                test('Wrong collection_id, It should respond with 400', async () => {
                    const response = await request(app)
                        .get('/artworks/SomeRandomCollectionId')
                        .expect(400)
                    expect(response.body).toStrictEqual('There is no collection with this id')
                })

                test('It should respond with 200', async () => {
                    const response = await request(app)
                        .get(`/artworks/${collection_id}`)
                        .expect(200)
                    expect(response.body).toBeInstanceOf(Array)
                })
            })

            describe('Test GET /artworks/artwork/:artwork_id', () => {
                let artwork_id = null

                beforeAll(async () => {
                    const artworks = await Artwork.find()
                    artwork_id = artworks[0].artwork_id
                })

                test('Wrong artwork_id, It should respond with 400', async () => {
                    const response = await request(app)
                        .get('/artworks/artwork/SomeRandomArtworkId')
                        .expect(400)
                    expect(response.body).toStrictEqual('There is no artwork with this id')
                })

                test('It should respond with 400', async () => {
                    const response = await request(app)
                        .get(`/artworks/artwork/${artwork_id}`)
                        .expect(200)
                    expect(response.body).toHaveProperty('artwork_id')
                    expect(response.body).toHaveProperty('artwork_name')
                    expect(response.body).toHaveProperty('description')
                })
            })
        })
    )
}

module.exports = artworkTests