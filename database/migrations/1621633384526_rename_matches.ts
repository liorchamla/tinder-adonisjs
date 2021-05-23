import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RenameMatches extends BaseSchema {
  // protected tableName = 'rename_matches'

  public async up() {
    this.schema.renameTable('create_matches', 'matches')
  }

  public async down() {
    this.schema.renameTable('matches', 'create_matches')
  }
}
