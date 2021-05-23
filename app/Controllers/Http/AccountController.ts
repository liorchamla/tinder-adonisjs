import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class AccountController {
  async store({ request, response }: HttpContextContract) {
    // Validation de la request
    const registrationData = await request.validate(CreateUserValidator)

    const user = await User.create(registrationData)

    return response.created(user)
  }
}
