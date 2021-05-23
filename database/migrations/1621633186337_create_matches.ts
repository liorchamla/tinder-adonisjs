import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateMatches extends BaseSchema {
  protected tableName = 'create_matches'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('matcher_id').references('users.id')
      table.integer('matched_id').references('users.id')
      table.primary(['matcher_id', 'matched_id'])
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
