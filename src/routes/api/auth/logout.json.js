import cookie from 'cookie'
import dbConnect from '$lib/database/dbConnect'
import { responses } from '$lib/utils/responses'
import { deauthorize } from '$lib/utils/tokenizer'

export const post = async req => {
  let db, user

  const { email } = JSON.parse(req.body)

  if (!email) return responses.badRequest({})

  try {
    db = await dbConnect()
    user = await db.models.User.findOne({ email })
  } catch (error) {
    console.error(error)
    return responses.serverError({})
  }

  if (!user) return responses.notFound('User not found')

  const { deletedCount } = await deauthorize(user.tid)

  if (!deletedCount) console.warn('No tokens deleted!')

  return responses.success({ deletedCount }, {
    'Set-Cookie': cookie.serialize('ref', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true
    })
  })
}