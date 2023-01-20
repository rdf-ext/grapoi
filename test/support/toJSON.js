import { deepStrictEqual } from 'assert'
import Edge from '../../Edge.js'
import Path from '../../Path.js'
import PathList from '../../PathList.js'

function arrayToJSON (array) {
  if (!Array.isArray(array)) {
    return null
  }

  return array.map(obj => toJSON(obj))
}

function edgeToJSON (step) {
  if (!(step instanceof Edge)) {
    return null
  }

  return {
    quad: quadToJSON(step.quad),
    start: step.start,
    end: step.end
  }
}

function listToJSON (list) {
  if (!(list instanceof PathList)) {
    return null
  }

  return {
    ptrs: list.ptrs.map(ptr => toJSON(ptr))
  }
}

function pathToJSON (path) {
  if (!(path instanceof Path)) {
    return null
  }

  const json = {
    edges: path.edges.map(step => edgeToJSON(step))
  }

  if (path._term) {
    json.startTerm = termToJSON(path._term)
  }

  return json
}

function quadToJSON (quad) {
  if (quad.termType !== 'Quad') {
    return null
  }

  return {
    subject: termToJSON(quad.subject),
    predicate: termToJSON(quad.predicate),
    object: termToJSON(quad.object),
    graph: termToJSON(quad.graph)
  }
}

function termToJSON (term) {
  if (!term.termType) {
    return null
  }

  const json = {
    termType: term.termType,
    value: term.value
  }

  if (term.datatype) {
    json.datatype = termToJSON(term.datatype)
  }

  if (term.language) {
    json.language = term.language
  }

  return json
}

function toJSON (obj) {
  return arrayToJSON(obj) ||
    edgeToJSON(obj) ||
    listToJSON(obj) ||
    pathToJSON(obj)
}

function grapoiEqual (actual, expected) {
  deepStrictEqual(toJSON(actual), toJSON(expected))
}

export default toJSON
export {
  grapoiEqual
}
