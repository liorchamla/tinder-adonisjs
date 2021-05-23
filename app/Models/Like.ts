import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public origin_id: number

  @column()
  public target_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'origin_id',
  })
  public originUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'target_id',
  })
  public targetUser: BelongsTo<typeof User>

  static createFromUsers(origin: User, target: User) {
    const like = new Like()

    like.origin_id = origin.id
    like.target_id = target.id

    return like.save()
  }
}
