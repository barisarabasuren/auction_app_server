const request = require('supertest');
const app = require('../../app');

const galleriesTests = () => {
    return(
        describe ('/galleries', () => {
            describe('Test GET /galleries', () => {
                test('It should respond with 200', async () => {
                    const response = await request(app)
                        .get('/galleries')
                        .expect(200)
                    expect(response.body).toBeInstanceOf(Array)
                })
            })
        
            describe('Test GET /galleries:gallery_id', () => { 
                test('It should respond with 200', async () => {
                    const galleriesResponse = await request(app)
                        .get('/galleries')

                    const gallery_name = await galleriesResponse.body[0].gallery_name
                    const gallery_id = await galleriesResponse.body[0].gallery_id
                    
                    const response = await request(app)
                        .get(`/galleries/${gallery_id}`)
                        .expect(200)

                    expect(response.body.gallery_name).toStrictEqual(gallery_name)
                    expect(response.body).toHaveProperty('gallery_name')
                })

                test('Wrong gallery id, It should respond with 400', async () => {
                    const response = await request(app)
                        .get('/galleries/someRandomGalleryId')
                        .expect(400)

                    expect(response.body).toStrictEqual('Gallery id does not exist')
                })
            })
        })
    )
}

module.exports = galleriesTests

