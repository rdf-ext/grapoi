import toTerm from './toTerm.js'

function toTermArray (values, { factory }) {
  try {
    values = [toTerm(values, { factory })]
  } catch (err) {}

  if (values[Symbol.iterator]) {
    values = [...values]
  }

  values = values.map(value => toTerm(value, { factory }))

  return values
}

export default toTermArray
