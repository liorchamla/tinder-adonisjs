import test from 'japa'
import supertest from 'supertest'

import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

// describe
test.group('Registration process', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
  test('Registers a new user if data are valid', async (assert) => {
    // Given we have registration data
    const registrationData = {
      username: 'Romain',
      password: 'p4ssword',
      email: 'romain@mail.com',
    }

    // When we send a POST request to /register
    await supertest(BASE_URL).post('/register').send(registrationData).expect(201)

    const user = await User.firstOrFail()

    assert.exists(user)
    assert.equal(user.username, registrationData.username)
    assert.equal(user.email, registrationData.email)
    assert.notEqual(user.password, registrationData.password)
  })
})
