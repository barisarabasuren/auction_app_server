const request = require('supertest');
const app = require('../../app');

const authUserTests = () => {
    return (
        describe ('AUTH/USER', () => {
            describe('Test POST /auth/user/signup', () => {
                beforeAll((done) => {
                    request(app)
                    .post('/auth/user/signup')
                    .send({
                        name: "test",
                        surname: "test",
                        email: "test@gmail.com",
                        password: "password"
                    })
                    .end(() => {
                        done()
                    })                    
                })

                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/user/signup')
                        .send({
                            surname: "test",
                            email: "test@gmail.com",
                            password: "password"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["name"]})
                })
        
                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/user/signup')
                        .send({
                            email: "test@gmail.com",
                            password: "password"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["name", "surname"]})
                })
        
                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/user/signup')
                        .send({
                            password: "password"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["name", "surname", "email"]})
                })
        
                test('Missing credentials, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/user/signup')
                        .send({
                
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["name", "surname", "email", "password"]})
                })
        
                test('It should respond with 201', async () => {
                    const response = await request(app)
                        .post('/auth/user/signup')
                        .send({
                            name: "demo",
                            surname: "demo",
                            email: "demo@gmail.com",
                            password: "password"
                        })
                        .expect(201)
                        expect(response.body).toStrictEqual('Created')
                })
        
                test('It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/user/signup')
                        .send({
                            name: "test",
                            surname: "test",
                            email: "test@gmail.com",
                            password: "password"
                        })
                        .expect(400)
                        expect(response.body).toStrictEqual('This email is already registered')
                })
            })
        
            describe('Test POST /auth/user/token', () => {
                test('It should respond with 200', async () => {
                    const response = await request(app)
                        .post('/auth/user/token')
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
                        .post('/auth/user/token')
                        .send({
                            email: "wrong email",
                            password: "password"
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual('Email has not registered')
                })
        
                test('Wrong password, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/user/token')
                        .send({
                            email: "test@gmail.com",
                            password: "wrongpassword"
                        })
                        .expect(400)
                        expect(response.body).toStrictEqual('Wrong password')
                })
        
                test('Missing credential, It should respond with 400', async () => {
                    const response = await request(app)
                        .post('/auth/user/token')
                        .send({
                            email: "test@gmail.com",
                        })
                        .expect(400)
                    expect(response.body).toStrictEqual({missingCredentials: ["password"]})
        
                })
            })
        
            describe('Test POST /auth/user/refresh', () => {
                let refreshToken = null

                beforeAll((done) => {
                    request(app)
                    .post('/auth/user/token')
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
                        .post('/auth/user/refresh')
                        .send({
                            refreshToken: refreshToken
                        })
                        .expect(200)
                    expect(response.body).toHaveProperty('accessToken')
                })
        
                test('Wrong refresh token, It should respond with 403', async () => {
                    const response = await request(app)
                        .post('/auth/user/refresh')
                        .send({
                            refreshToken: 'some random refresh token'
                        })
                        .expect(403)
                    expect(response.body).toStrictEqual('Refresh token does not exist on the database')
                })
        
                test('Missing refresh token, It should respond with 401', async () => {
                    const response = await request(app)
                        .post('/auth/user/refresh')
                        .send({
                            
                        })
                        .expect(400)
                        expect(response.body).toStrictEqual({missingCredentials: ["refreshToken"]})
                })
            })
        })
    )
}
module.exports = authUserTests
