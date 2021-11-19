import mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  tid: { type: String, required: true }
})