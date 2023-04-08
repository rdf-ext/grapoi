import toPath from './toPath.js'
import toTermArray from './toTermArray.js'

function toPathArray (values, { dataset, factory, graph }) {
  try {
    values = [toPath(values, { dataset, factory, graph })]
  } catch (err) {}

  if (values[Symbol.iterator]) {
    values = [...values]
  }

  return values.flatMap(value => {
    return toTermArray(graph, { factory }).flatMap(graph => {
      return toPath(value, { dataset, factory, graph })
    })
  })
}

export default toPathArray
