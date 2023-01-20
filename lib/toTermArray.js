import toTerm from './toTerm.js'

function toTermArray (values, { factory }) {
  try {
    values = [toTerm(values, { factory })]
  } catch (err) {}

  if (values[Symbol.iterator]) {
    values = [...values]
  }

  /* if (filter) {
    ptrs = ptrs.filter(Boolean)

    if (ptrs.length === 0) {
      return null
    }
  } */

  values = values.map(value => toTerm(value, { factory }))

  return values
}

export default toTermArray
