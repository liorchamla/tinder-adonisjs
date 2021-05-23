import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public email: string

  @column()
  public username: string

  @column()
  public password: string

  @manyToMany(() => User, {
    pivotTable: 'likes',
    pivotForeignKey: 'origin_id',
    pivotRelatedForeignKey: 'target_id',
    pivotTimestamps: true,
  })
  public hasLiked: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'likes',
    pivotForeignKey: 'target_id',
    pivotRelatedForeignKey: 'origin_id',
    pivotTimestamps: true,
  })
  public wasLikedBy: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'matches',
    pivotForeignKey: 'matcher_id',
    pivotRelatedForeignKey: 'matched_id',
    pivotTimestamps: true,
  })
  public hasMatched: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'matches',
    pivotForeignKey: 'matched_id',
    pivotRelatedForeignKey: 'matcher_id',
    pivotTimestamps: true,
  })
  public wasMatchedBy: ManyToMany<typeof User>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public async isLikedBy(target: User) {
    const results = await Database.query()
      .from('likes')
      .where('origin_id', target.id)
      .andWhere('target_id', this.id)
      .first()

    return results !== null
  }
}
