import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Like from 'App/Models/Like'

import User from 'App/Models/User'

export default class LikesController {
  public async store({ auth, request, response }: HttpContextContract) {
    // 1. Choper l'utilisateur actuellement authentifié
    const origin = auth.user!

    // 2. Choper l'identifiant de l'utilisateur cible dans la request
    const target_id = request.input('target_id')
    // 3. Choper l'utilisateur correspond
    const target = await User.findOrFail(target_id)

    try {
      await Like.createFromUsers(origin, target)

      const amILiked = await origin?.isLikedBy(target)

      if (amILiked) {
        // MATCH !
        await origin!.related('hasMatched').attach([target.id])
      }
    } catch (e) {
      console.log(e)
      return response.conflict({
        message: 'Vous avez déjà liké ce profil',
      })
    }

    // 3. Renvoyer une réponse au navigateur / client
    return response.created({
      message: 'Le like a bien été enregistré !',
    })
  }
}
