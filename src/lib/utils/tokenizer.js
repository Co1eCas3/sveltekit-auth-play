import jwt from 'jsonwebtoken'
import dbConnect from '../database/dbConnect'

let db = null;

export const issue = async ({ _id, tid }, source) => {
  if (!_id || !tid)
    throw new Error('Missing token data')

  db = db || await dbConnect()
  const token = jwt.sign({ data: { userId: _id } }, process.env.JWT_SECRET, {
    expiresIn: expiresIn(source),
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    subject: source
  })

  await db.models.Token.create({ token, tid })

  return token
}

export const validate = async (token, source) => {
  db = db || await dbConnect()
  let decoded
  const foundToken = await db.models.Token.findOne({ token })
  if (!foundToken)
    throw new Error('Invalid token')

  try {
    decoded = decode(token, source)
  } catch (error) {
    await db.models.Token.deleteOne({ token })
    throw error
  }

  const user = await db.models.User.findById(decoded.data.userId)
  if (!user || foundToken.tid !== user.tid)
    throw new Error('Token data invalid')

  return user
}

export const consume = async (token, source) => {
  db = db || await dbConnect()
  const user = await validate(token, source)

  await deauthorize(user.tid)

  return user
}

export const deauthorize = async tid => {
  db = db || await dbConnect()
  return await db.models.Token.deleteMany({ tid })
}

function expiresIn(source) {
  switch (source) {
    case 'login': return 600 // ten mins
    case 'authenticate': return 300 // five mins
    case 'refresh': return (60 * 60 * 24 * 7) // one week
    default: throw new Error('Invalid token source')
  }
}

function decode(token, source) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
    subject: source
  })
}

function sourceKey(source) {
  switch (source) {
    case 'login': return 'lastLoginToken'
    case 'refresh': return 'lastRefreshToken'
    case 'authenticate': return 'lastAuthToken'
    default: throw new Error('Invalid token source')
  }
}