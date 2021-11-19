import { UserSchema } from "./models/UserSchema"
import { TokenSchema } from "./models/TokenSchema"

const schemas = {
  User: UserSchema,
  Token: TokenSchema
}

export const attachModels = async conn => {
  if (!Object.entries(conn.models).length) {
    return Promise.all(Object.entries(schemas).map(
      ([schemaName, schema]) => {
        const model = conn.model(schemaName, schema)
        return model.syncIndexes()
      }
    )).catch(err => { throw err })
  }
}