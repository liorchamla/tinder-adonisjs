import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class LikesUniques extends BaseSchema {
  protected tableName = 'likes'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['origin_id', 'target_id'])
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['origin_id', 'target_id'])
    })
  }
}
