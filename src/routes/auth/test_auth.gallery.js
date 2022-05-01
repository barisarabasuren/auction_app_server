const request = require('supertest');
const app = require('../../app');

const authGalleryTests = () => {
    return(
        describe ('AUTH/GALLERY', () => {
            beforeAll((done) => {
                request(app)
                .post('/auth/gallery/signup')
                .send({
                    gallery_name: "test",
                    email: "test@gmail.com",
                    password: "password"
                })
                .end(() => {
                    done()
                })                    
            })

            describe('Test POST /auth/gallery/signup', () => {
                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/signup')
                        .send({
                            email: "test@gmail.com",
                            password: "password"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["gallery_name", "logo"]})
                })
        
                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/signup')
                        .send({
                            password: "password"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["gallery_name", "logo", "email"]})
                })
        
                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/signup')
                        .send({
                            
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["gallery_name", "logo", "email", "password"]})
                })
        
                test('It should respond with 201', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/signup')
                        .send({
                            gallery_name: "demo",
                            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ZDF_logo%21_Logo_2021.svg/640px-ZDF_logo%21_Logo_2021.svg.png',
                            email: "test@gmail.com",
                            password: "password"
                        })
                        .expect(201)
                    expect(response.body).toStrictEqual('Created')
                })
        
                test('It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/signup')
                        .send({
                            gallery_name: "test",
                            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ZDF_logo%21_Logo_2021.svg/640px-ZDF_logo%21_Logo_2021.svg.png',
                            email: "test@gmail.com",
                            password: "password"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual("This email is already registered")
                })
            })
        
            describe('Test POST /auth/gallery/token', () => {
                test('It should respond with 200', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/token')
                        .send({
                            email: "test@gmail.com",
                            password: "password"
                        })
                        .expect(200)
                    expect(response.body).toHaveProperty('accessToken')
                    expect(response.body).toHaveProperty('refreshToken')
                })
        
                test('Wrong email, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/token')
                        .send({
                            email: "wrong email",
                            password: "password"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual('Email has not registered')
                })
        
                test('Wrong password, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/token')
                        .send({
                            email: "test@gmail.com",
                            password: "wrongpassword"
                        })
                        .expect(400)
                        expect(response.body).toStrictEqual('Wrong password')
                })
        
                test('Missing credential, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/token')
                        .send({
                            email: "test@gmail.com",
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["password"]})
        
                })
            })
        
            describe('Test POST /auth/gallery/refresh', () => {
                let refreshToken = null

                beforeAll((done) => {
                    request(app)
                    .post('/auth/gallery/token')
                    .send({
                        email: "test@gmail.com",
                        password: "password"
                    })
                    .end((err, res) => {
                        refreshToken = res.body.refreshToken;
                        done()
                    })                    
                })

                test('It should respond with 200', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/refresh')
                        .send({
                            refreshToken: refreshToken
                        })
                        .expect(200)
                    expect(response.body).toHaveProperty('accessToken')
                })
        
                test('Wrong refresh token, It should respond with 403', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/refresh')
                        .send({
                            refreshToken: 'some random refresh token'
                        })
                        .expect(403)
                    expect(response.body).toStrictEqual('Refresh token does not exist on the database')
                })
        
                test('Missing refresh token, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/gallery/refresh')
                        .send({
                            
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["refreshToken"]})
                })
            })
        })
    )
}

module.exports = authGalleryTests

