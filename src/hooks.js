import { validate } from '$lib/utils/tokenizer'

export const handle = async ({ request, resolve }) => {
  console.log('handling request to: ' + request.path)
  console.log('full request: ')
  console.log(request)
  const authToken = request.headers.authorization || ''

  if (authToken) {
    console.log('validating auth token')

    try {
      request.locals.authRes = {
        user: await validate(authToken),
        ok: true
      }
    } catch (error) {
      request.locals.authRes = {
        ok: false,
        error
      }
    }
  }

  const res = await resolve(request)
  console.log('response: ')
  console.log(res)
  return res
}