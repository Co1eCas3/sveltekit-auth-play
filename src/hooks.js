import cookie from 'cookie'
import { validate } from '$lib/utils/tokenizer'

export const handle = async ({ request, resolve }) => {
  console.log('handling request to: ' + request.path)
  console.log('full request: ')
  console.log(request)
  const authToken = request.headers.authorization || ''
  const cookies = request.headers.cookie ? cookie.parse(request.headers.cookie) : {}
  const { ref: refToken } = cookies

  if (authToken) {
    console.log('validating auth token')

    try {
      // need _id in order to process authenticated request in endpoint
      // need name and email for session
      const { name, email, _id } = await tokenizer.validate(authToken)
      request.locals.user = { name, email, _id }
    } catch (error) {
      request.locals.authError = { error, message: 'Could not authenticate' }
    }
  } else if (request.path !== '/api/auth/refresh.json' && refToken) {
    console.log('no auth token found, but did find ref token')
    console.log('adding refreshReady to locals')
    request.locals.refreshReady = true
  }

  const res = await resolve(request)
  console.log('response: ')
  console.log(res)
  return res
}

// export const handleError = async ({ error, request }) => {

// }

export const getSession = req => {
  const sess = {}
  sess.refreshReady =
    (req.locals.hasOwnProperty('refreshReady') && req.locals.refreshReady)
  sess.authError = (req.locals.hasOwnProperty('authError') && req.locals.authError)
  sess.user = req.locals.hasOwnProperty('user')
    ? { email: req.locals.user.email, name: req.locals.user.name }
    : null

  return sess
}