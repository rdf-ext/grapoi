function toTerm (value, { factory }) {
  if (value === null) {
    return null
  }

  if (value === undefined) {
    return undefined
  }

  if (typeof value === 'string') {
    return factory.literal(value)
  }

  if (value.constructor.name === 'URL') {
    return factory.namedNode(value.toString())
  }

  if (value.termType) {
    return value
  }

  const term = value.term

  if (term !== undefined) {
    return term
  }

  throw new Error(`can't convert ${value.toString()} to a Term object`)
}

export default toTerm
