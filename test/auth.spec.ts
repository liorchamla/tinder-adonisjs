import test from 'japa'
import supertest from 'supertest'

import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

// describe
test.group('Auth process', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('An origin user can like a target user', async (assert) => {
    // Given there is a user with those data :
    await UserFactory.create((user) => {
      ;(user.email = 'user@mail.com'), (user.password = 'password')
    })

    // When we call /login with this data
    supertest(BASE_URL)
      .post('/login')
      .send({
        email: 'user@mail.com',
        password: 'password',
      })
      .expect(200)
  })
})
