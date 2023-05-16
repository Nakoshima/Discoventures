const app = require('../app')
const request = require('supertest')
const userModel = require('../models/users.js')
const routeModel = require('../models/routes.js')

let LAMBDA_JWT = null

beforeAll(async () => {
  const jws = require('jws')
  const { TOKENSECRET } = process.env
  const bcrypt = require('bcrypt')
  await require('../models/database.js').sync({ force: true })
  // Initialise la base avec quelques données
  const passwordHashed = await bcrypt.hash('!A1o2e3r4', 2)
  const lambdaUser = await userModel.create({
    username: 'Lambda',
    email: 'lambda@email.com',
    password: passwordHashed,
    isadmin: false
  })
  LAMBDA_JWT = jws.sign({
    header: { alg: 'HS256' },
    payload: { id: lambdaUser.id, isadmin: false },
    secret: TOKENSECRET
  })
  await routeModel.create({
    title: 'Walk in the hoods',
    coordinates: {
      data: {
        latitude: [20.123456, 1.2156, 4.2156],
        longitude: [11.12345, 6.1267, 617.172]
      }
    },
    estimatedDistance: 10000,
    estimatedTime: 1800,
    activityType: 'run',
    userId: 1
  })
})

describe('POST /newRouteUserVote/:id', () => {
  test('Test we can note a route', async () => {
    const data = {
      note: 5
    }
    const responsePost = await request(app)
      .post('/routesUsersVote/1')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('x-access-token', LAMBDA_JWT)
      .send({ data: data })
    expect(responsePost.statusCode).toBe(201)
    expect(responsePost.body.message).toBe('Nouveau vote ajouté')
  })
  test('Test we cannot give a negative note to a route', async () => {
    const data = {
      note: -1.8
    }
    const responsePost = await request(app)
      .post('/routesUsersVote/1')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('x-access-token', LAMBDA_JWT)
      .send({ data: data })
    expect(responsePost.statusCode).toBe(400)
    expect(responsePost.body.message).toBe('Validation error: Note must be a value between 0 and 5')
  })
  test('Test we cannot give a note > 5 to a route', async () => {
    const data = {
      note: 6
    }
    const responsePost = await request(app)
      .post('/routesUsersVote/1')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('x-access-token', LAMBDA_JWT)
      .send({ data: data })
    expect(responsePost.statusCode).toBe(400)
    expect(responsePost.body.message).toBe('Validation error: Note must be a value between 0 and 5')
  })
  test('Test that we cannot create a new route without given the data', async () => {
    const responsePost = await request(app)
      .post('/routesUsersVote/1')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('x-access-token', LAMBDA_JWT)
    expect(responsePost.statusCode).toBe(400)
    expect(responsePost.body.message).toBe('Attribut \'data\' manquant')
  })
  test('Test that we cannot create a new route without given the note', async () => {
    const responsePost = await request(app)
      .post('/routesUsersVote/1')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .set('x-access-token', LAMBDA_JWT)
      .send({ data: { test: 'ko' } })
    expect(responsePost.statusCode).toBe(400)
    expect(responsePost.body.message).toBe('Attribut \'note\' dans data manquant')
  })
})
