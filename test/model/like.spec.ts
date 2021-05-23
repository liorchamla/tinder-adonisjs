import Database from '@ioc:Adonis/Lucid/Database'
import Like from 'App/Models/Like'
import { UserFactory } from 'Database/factories'
import test from 'japa'

test.group('Auth process', (group) => {
  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })

  test('It can read likes with ORM Model', async (assert) => {
    const [origin, target] = await UserFactory.createMany(2)

    await Database.insertQuery().table('likes').insert({
      origin_id: origin.id,
      target_id: target.id,
    })

    const likes = await Like.all()

    assert.equal(1, likes.length)
  })

  test('It can create a like between 2 users', async (assert) => {
    const [origin, target] = await UserFactory.createMany(2)

    const like = await Like.createFromUsers(origin, target)

    assert.equal(1, (await Like.all()).length)

    await like.load('originUser')
    await like.load('targetUser')

    assert.equal(like.originUser.id, origin.id)
    assert.equal(like.targetUser.id, target.id)
  })
})
