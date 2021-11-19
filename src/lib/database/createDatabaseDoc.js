export const createDatabaseDoc = (keys, vals) => {
  if (keys.length !== vals.length) console.warn('Malformed database document')

  return keys.reduce((doc, key, i) => {
    doc[key] = vals[i] || null
    return doc
  }, {})
}