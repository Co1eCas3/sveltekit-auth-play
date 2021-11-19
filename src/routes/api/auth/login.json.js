import isEmail from 'validator/lib/isEmail'
import cookie from 'cookie'
import { v4 as uuid } from 'uuid'
import { responses } from '$lib/utils/responses'
import dbConnect from '$lib/database/dbConnect'
import * as tokenizer from '$lib/utils/tokenizer'

export const post = async req => {
  let db, user
  const { email } = JSON.parse(req.body)

  if (!isEmail(email))
    return responses.badRequest('Invalid email')

  // connect to db
  // try to find user
  // if(!user) create user
  try {
    db = await dbConnect()
    user = await db.models.User.findOne({ email })
    if (!user)
      user = await db.models.User.create({ email, tid: uuid() })
  } catch (error) {
    return responses.serverError({ error, message: 'There was an error in the database' })
  }

  const token = await tokenizer.issue(user, 'login')
  const loginLink = `${process.env.BASE_URI}/login?token=${token}`

  // implement email token (just logging link in console for the purposes of this demo)
  // return response.success()
  return responses.success({ loginLink })
}

export const get = async req => {
  let authToken,
    refToken,
    user

  const loginToken = req.query.get('token') || ''

  if (!loginToken)
    return responses.badRequest({ message: 'Missing Token' })

  try {
    user = await tokenizer.consume(loginToken, 'login')
  } catch (error) {
    return responses.forbidden({ error, message: 'Could not validate token' })
  }

  // issue new auth and ref tokens
  // set new tokens on user record
  try {
    authToken = await tokenizer.issue(user, 'authenticate')
    refToken = await tokenizer.issue(user, 'refresh')
  } catch (error) {
    return responses.serverError({ error, message: 'Encoutered an error while creating token' })
  }

  const { name, email } = user
  return responses.success(
    { token: authToken, user: { name, email } },
    {
      'Set-Cookie': cookie.serialize('ref', refToken, {
        httpOnly: true,
        maxAge: (60 * 60 * 24 * 7), // one week
        domain: process.env.BASE_URI,
        path: '/'
      })
    }
  )
}