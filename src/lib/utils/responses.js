/*
 * USAGE _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
 * 
 * if you only want to set the status, don't pass any arguments
 *   --  responses.success()
 *   --  // { status: 200 }
 * 
 * if you would like to use a generic message relative to the
 * status code in th body, pass an empty object ({})
 *   --  responses.success({})
 *   -- // { status: 200, body: { message: 'Success!!' } }
 * 
 * if you have data to pass, pass it in as the first argument
 * in an object
 *   -- responses.success({ message: 'My message was a success!' })
 *   -- // { status: 200, body: { message: 'My message was a success!' } }
 * 
 * if you have custom headers to send, pass them as the second
 * argument in the form of an object
 *  - Example w/out body:
 *   -- responses.success(null, { 'My-header': 'custom-header', 'Content-type': 'application/json' })
 *   -- // { status: 200, headers: { 'My-header': 'custom-header', 'Content-type': 'application/json' } }
 *  - Example w/ body
 *   -- responses.success({ data: 'my data' }, { 'Content-type': 'application/json' })
 *   -- // { status: 200, body: { data: 'my data' }, headers: { 'Content-type': 'application/json' } }
 *  - Example w/ body w/ generic message
 *   -- responses.success({}, { 'Content-type': 'application/json' })
 *   -- // { status: 200, body: { message: 'Success!!' }, headers: { 'Content-type': 'application/json' } }
 */

const genericErrorMessages = status => {
  switch (status) {
    case 200:
    case 201:
    case 202:
    case 203:
    case 204: return "Success!!"
    case 301:
    case 302:
    case 304: return "Redirecting..."
    case 400: return "Oops! Something didn't come through right. Please try again"
    case 401: return "Sorry, looks like you don't have permission to access this content"
    case 403: return "Sorry, looks like you are not authorized to access this content"
    case 404: return "Sorry, looks like this content is missing"
    case 409: return "Something didn't match up correctly"
    case 500: return "Oops! Something went wrong on the server, please try again"
    case 501: return "Sorry, still working on this bit..."
  }
}

const fn = (status) => (body = null, headers = null) => {
  const res = { status }
  if (body) {
    if (!Object.entries(body).length)
      res.body = { message: genericErrorMessages(status) }
    else
      res.body = body
  }
  if (headers && Object.entries(headers).length) res.headers = headers

  return res
}

export const responses = {
  custom: (status, body = {}, headers = {}) => ({ status, body, headers }),

  success: fn(200),
  created: fn(201),
  accepted: fn(202),
  nonAuthorizedContent: fn(203),
  noContent: fn(204),

  movedPermanently: fn(301),
  found: fn(302),
  notModified: fn(304),

  badRequest: fn(400),
  unauthorized: fn(401),
  forbidden: fn(403),
  notFound: fn(404),
  conflict: fn(409),

  serverError: fn(500),
  notImplemented: fn(501)
}