import request from 'supertest'
import { app } from '../app'
import getConnection from '../database'

describe('Surveys', () => {
  beforeAll(async () => {
    const connection = await getConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    const connection = await getConnection()
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able to create a new user", async () => {
    const res = await request(app)
      .post('/users')
      .send({
        email: 'user@example.com',
        name: 'User Example'
      })

    expect(res.status).toBe(201)
  })

  it("Should not be able to create a user with exists email", async () => {
    const res = await request(app)
      .post('/users')
      .send({
        email: 'user@example.com',
        name: 'User Example'
      })

    expect(res.status).toBe(400)
  })
})