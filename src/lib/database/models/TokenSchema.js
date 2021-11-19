import mongoose from 'mongoose'

export const TokenSchema = new mongoose.Schema({
  token: { type: String, index: true },
  tid: { type: String, ref: 'User' }
})