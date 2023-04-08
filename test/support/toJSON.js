import { deepStrictEqual } from 'assert'
import Edge from '../../Edge.js'
import Path from '../../Path.js'
import PathList from '../../PathList.js'

function arrayToJSON (array, { blankNodeIds }) {
  if (!Array.isArray(array)) {
    return null
  }

  return array.map(obj => toJSON(obj, { blankNodeIds }))
}

function edgeToJSON (step, { blankNodeIds }) {
  if (!(step instanceof Edge)) {
    return null
  }

  return {
    quad: quadToJSON(step.quad, { blankNodeIds }),
    start: step.start,
    end: step.end
  }
}

function listToJSON (list, { blankNodeIds }) {
  if (!(list instanceof PathList)) {
    return null
  }

  return {
    ptrs: list.ptrs.map(ptr => toJSON(ptr, { blankNodeIds }))
  }
}

function pathToJSON (path, { blankNodeIds }) {
  if (!(path instanceof Path)) {
    return null
  }

  const json = {
    edges: path.edges.map(step => edgeToJSON(step, { blankNodeIds }))
  }

  if (path._graph) {
    json.graph = path._graph.value
  }

  if (path._term) {
    json.startTerm = termToJSON(path._term, { blankNodeIds })
  }

  return json
}

function quadToJSON (quad, { blankNodeIds }) {
  if (quad.termType !== 'Quad') {
    return null
  }

  return {
    subject: termToJSON(quad.subject, { blankNodeIds }),
    predicate: termToJSON(quad.predicate, { blankNodeIds }),
    object: termToJSON(quad.object, { blankNodeIds }),
    graph: termToJSON(quad.graph, { blankNodeIds })
  }
}

function termToJSON (term, { blankNodeIds }) {
  if (!term.termType) {
    return null
  }

  const json = {
    termType: term.termType,
    value: term.value
  }

  if (term.termType === 'BlankNode') {
    if (!blankNodeIds.has(term.value)) {
      blankNodeIds.set(term.value, `b${blankNodeIds.size + 1}`)
    }

    json.value = blankNodeIds.get(term.value)
  }

  if (term.datatype) {
    json.datatype = termToJSON(term.datatype, { blankNodeIds })
  }

  if (term.language) {
    json.language = term.language
  }

  return json
}

function toJSON (obj, { blankNodeIds = new Map() } = {}) {
  return arrayToJSON(obj, { blankNodeIds }) ||
    edgeToJSON(obj, { blankNodeIds }) ||
    listToJSON(obj, { blankNodeIds }) ||
    pathToJSON(obj, { blankNodeIds })
}

function grapoiEqual (actual, expected) {
  deepStrictEqual(toJSON(actual), toJSON(expected))
}

export default toJSON
export {
  grapoiEqual
}
