import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from 'Database/factories'

export default class AccountSeeder extends BaseSeeder {
  public async run() {
    await UserFactory.createMany(15)
  }
}
