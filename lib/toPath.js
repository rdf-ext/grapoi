import Path from '../Path.js'
import toTerm from './toTerm.js'

function isPtr (value) {
  return typeof value.term === 'object' && typeof value.dataset === 'object'
}

function isPath (value) {
  return value instanceof Path
}

function toPath (value, { dataset, factory, graph }) {
  if (value === null) {
    return null
  }

  if (value === undefined) {
    return undefined
  }

  if (isPath(value)) {
    return value
  }

  if (isPtr(value)) {
    return new Path({
      dataset: value.dataset,
      graph: value.graph,
      term: value.term,
      factory: value.factory || factory
    })
  }

  return new Path({
    dataset,
    graph,
    term: toTerm(value, { factory }),
    factory
  })
}

export default toPath
