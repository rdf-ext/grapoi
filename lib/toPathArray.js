import toPath from './toPath.js'

function toPathArray (values, { dataset, factory, graph }) {
  try {
    values = [toPath(values, { dataset, factory, graph })]
  } catch (err) {}

  if (values[Symbol.iterator]) {
    values = [...values]
  }

  values = values.map(value => toPath(value, { dataset, factory, graph }))

  return values
}

export default toPathArray
