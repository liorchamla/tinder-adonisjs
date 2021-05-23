// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async logout({ auth, response }) {
    await auth.use('web').logout()
    return response.ok({
      message: 'Déconnexion réussie',
    })
  }

  public async login({ auth, request, response }) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      await auth.use('web').attempt(email, password)
      return response.ok({
        message: 'Authentifié avec succès',
      })
    } catch (e) {
      console.log(e)
      return response.badRequest({
        message: 'Invalid credentials',
      })
    }
  }
}
