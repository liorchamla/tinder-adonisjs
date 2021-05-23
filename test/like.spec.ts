import test from 'japa'
import supertest from 'supertest'

import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

// describe
test.group('Like process', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('A user cant like if it is not authenticated', async (assert) => {
    // Given we have 2 accounts
    await UserFactory.createMany(2)

    // When we send a POST request to /register
    await supertest(BASE_URL).post('/like').send({}).expect(401)
  })

  test('An authenticated user can like an other user', async (assert) => {
    // Given we have 2 accounts
    const [origin, target] = await UserFactory.createMany(2)

    const request = supertest.agent(BASE_URL)

    // And origin is authenticated
    await request
      .post('/login')
      .send({
        email: origin.email,
        password: 'password',
      })
      .withCredentials()

    // When we send a POST request to /register
    await request
      .post('/like')
      .send({
        target_id: target.id,
      })
      .expect(201)

    const count = await Database.from('likes')
      .andWhere('target_id', target.id)
      .andWhere('origin_id', origin.id)
      .count('id as total')

    assert.equal(count[0].total, 1)
  })

  test('A match is created when 2 users like each other', async (assert) => {
    // Given we have 2 accounts
    const [origin, target] = await UserFactory.createMany(2)

    const request = supertest.agent(BASE_URL)

    // And origin is authenticated
    await request
      .post('/login')
      .send({
        email: origin.email,
        password: 'password',
      })
      .withCredentials()

    // When we send a POST request to /register
    await request
      .post('/like')
      .send({
        target_id: target.id,
      })
      .expect(201)

    // And target is authenticated
    await request
      .post('/login')
      .send({
        email: target.email,
        password: 'password',
      })
      .withCredentials()

    // When we send a POST request to /register
    await request
      .post('/like')
      .send({
        target_id: origin.id,
      })
      .expect(201)

    // We should find one match in the database
    const count = await Database.from('matches')
      .andWhere('matcher_id', target.id)
      .andWhere('matched_id', origin.id)
      .count('* as total')

    assert.equal(count[0].total, 1)
  })

  test('No match is created if only one user likes an other', async (assert) => {
    // Given we have 2 accounts
    const [origin, target] = await UserFactory.createMany(2)

    const request = supertest.agent(BASE_URL)

    // And origin is authenticated
    await request
      .post('/login')
      .send({
        email: origin.email,
        password: 'password',
      })
      .withCredentials()

    // When we send a POST request to /register
    await request
      .post('/like')
      .send({
        target_id: target.id,
      })
      .expect(201)

    // We should find one match in the database
    const count = await Database.from('matches')
      .andWhere('matcher_id', target.id)
      .andWhere('matched_id', origin.id)
      .count('* as total')

    assert.equal(count[0].total, 0)
  })
})
