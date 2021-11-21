import cookie from 'cookie'
import { responses } from '$lib/utils/responses'
import * as tokenizer from '$lib/utils/tokenizer'

export const get = async req => {
  let newAuthToken,
    newRefToken,
    user

  const cookies = req.headers.cookie
  const { ref: refToken } = cookies ? cookie.parse(cookies) : ''

  if (!refToken)
    return responses.forbidden('Token missing')

  // validate token
  try {
    user = await tokenizer.consume(refToken, 'refresh')
  } catch (error) {
    console.error(error)
    return responses.forbidden('Could not validate token', setCookieHeader())
  }

  // issue new tokens and save to user record
  try {
    newAuthToken = await tokenizer.issue(user, 'authenticate')
    newRefToken = await tokenizer.issue(user, 'refresh')
  } catch (error) {
    console.error(error)
    return responses.forbidden('Error creating token', setCookieHeader())
  }

  const { email, name } = user
  const resBody = {
    token: newAuthToken,
    user: { email, name }
  }

  return responses.success(resBody, setCookieHeader(newRefToken))
}

function setCookieHeader(refToken = '') {
  return {
    'Set-Cookie': cookie.serialize('ref', refToken, {
      httpOnly: true,
      maxAge: refToken ? (60 * 60 * 24 * 7) : 0,
      path: '/',
      sameSite: true
    })
  }
}