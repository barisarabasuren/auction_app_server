const request = require('supertest');
const app = require('../../app');
const Artwork = require('../../modals/artworks/artworks.mongo');
const Collection = require('../../modals/collections/collections.mongo');

const bidTests = () => {
    return (
        describe ('/bid', () => {
            describe('Test POST /bids', () => {
                let accessToken = null
                let artwork_id = null
                beforeAll(async () => {
                    const collection = await Collection.findOne()

                    const date = new Date()
                    const startDate = new Date(date.getTime() - (1000 * 60 * 60 * 24))
                    const endDate = new Date(date.getTime() + (1000 * 60 * 60 * 24))

                    const newArtwork = new Artwork({
                        gallery_id: collection.gallery_id,
                        collection_id: collection.collection_id,
                        artwork_id: 'test_id',
                        artwork_name: 'test',
                        description: 'test',
                        beginning_price: 1,
                        isAuctionOn: true,
                        auction_starts: startDate,
                        auction_ends: endDate,
                        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ZDF_logo%21_Logo_2021.svg/640px-ZDF_logo%21_Logo_2021.svg.png"
                    })

                    await newArtwork.save()
                    artwork_id = newArtwork.artwork_id

                    const response = await request(app)
                        .post('/auth/user/token')
                        .send({
                            email: "test@gmail.com",
                            password: "password"
                        })
                    accessToken = response.body.accessToken;                
                })

                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post(`/bid/${artwork_id}`)
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({
                            
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["price"]})
                })

                test('Non-existing artwork, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/bid/nonExistingArtwork')
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({
                            price: 20,
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual('Artwork does not exist')
                })

                test('Price is 0, It should respond with 400', async () => {
                    const response = await request(app)
                        .post(`/bid/${artwork_id}`)
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({
                            price: 0,
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual('Bid price must be greater than 0')
                })

                test('Price is beginning_price, It should respond with 400', async () => {
                    const response = await request(app)
                        .post(`/bid/${artwork_id}`)
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({
                            price: 1,
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual('New bid have to be higher than beginning price')
                })

                test('It should respond with 200', async () => {
                    const response = await request(app)
                        .post(`/bid/${artwork_id}`)
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({
                            price: 2,
                        })
                        .expect(200)
                    expect(response.body).toStrictEqual('Bid is successful')
                })

                test('Equal to the highest, It should respond with 400', async () => {
                    const response = await request(app)
                        .post(`/bid/${artwork_id}`)
                        .set('Authorization', 'bearer ' + accessToken)
                        .send({
                            price: 2,
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual('New bid have to be higher than the highest bid')
                })
            })
        })
    )
}

module.exports = bidTests

