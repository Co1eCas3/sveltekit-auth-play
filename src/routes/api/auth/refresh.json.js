import cookie from 'cookie'
import { responses } from '$lib/utils/responses'

export const get = async req => {
  let newAuthToken,
    newRefToken,
    user

  const cookies = req.headers.cookie
  const { ref: refToken } = cookies ? cookie.parse(cookies) : ''

  if (!refToken)
    return responses.forbidden({ message: 'Token missing' })

  // validate token
  try {
    user = await tokenizer.consume(refToken, 'refresh')
  } catch (error) {
    return responses.forbidden({ error, message: 'Could not validate token' })
  }

  // issue new tokens and save to user record
  try {
    newAuthToken = await tokenizer.issue(user, 'authenticate')
    newRefToken = await tokenizer.issue(user, 'refresh')
  } catch (error) {
    return responses.forbidden({ error, message: 'Error creating token' })
  }

  return responses.success(
    { token: newAuthToken },
    {
      'set-cookie': cookie.serialize('ref', newRefToken, {
        httpOnly: true,
        maxAge: (60 * 60 * 24 * 7),
        domain: process.env.BASE_URI,
        path: '/',
        sameSite: true
      })
    }
  )
}