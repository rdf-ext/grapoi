import TermMap from '@rdfjs/term-map'
import Edge from '../../Edge.js'
import Grapoi from '../../Grapoi.js'
import Path from '../../Path.js'
import PathList from '../../PathList.js'
import factory from './factory.js'
import * as ns from './namespaces.js'

function createPathDataset (data, {
  start = 'subject',
  end = 'object',
  term = ns.ex.start,
  graph,
  predicates = [ns.ex.propertyA, ns.ex.propertyB],
  add = true,
  expect,
  ...args
} = {}) {
  const quads = data.map(parts => factory.quad(...[...parts, graph]))
  const dataset = factory.dataset(add ? quads : [])
  const edges = quads.map(quad => new Edge({ dataset, end, quad, start }))
  const ptr = new Path({ dataset, factory, graph, term })
  const ptrs = edges.map(edge => new Path({ dataset, edges: [edge], factory, graph }))

  expect = expect || Object.keys(quads)

  const expectedPtrs = expect.map(index => ptrs[index])
  const expectedQuads = expect ? expect.map(index => quads[index]) : quads

  return {
    term,
    graph,
    quads,
    dataset,
    edges,
    ptr,
    expectedPtrs,
    expectedQuads,
    predicates,
    ...args
  }
}

function createPathListDataset (data, {
  start = 'subject',
  end = 'object',
  terms = [ns.ex.start1, ns.ex.start2],
  graphs = [null],
  predicates = [ns.ex.propertyA, ns.ex.propertyB],
  add = true,
  expect,
  ...args
} = {}) {
  const quads = []

  for (const graph of graphs) {
    const blankNodes = new TermMap()

    for (let parts of data) {
      parts = parts.map(part => {
        if (part.termType !== 'BlankNode') {
          return part
        }

        if (!blankNodes.has(part)) {
          blankNodes.set(part, factory.blankNode())
        }

        return blankNodes.get(part)
      })

      quads.push(factory.quad(...[...parts, graph || factory.defaultGraph()]))
    }
  }

  const dataset = factory.dataset(add ? quads : [])
  const edges = quads.map(quad => new Edge({ dataset, end, quad, start }))
  const ptrList = new PathList({ dataset, factory, graphs, terms })
  const grapoi = new Grapoi({ dataset, factory, graphs, terms })
  const ptrs = edges.map(edge => new Path({ dataset, edges: [edge], factory }))

  expect = expect || Object.keys(quads)

  const expectedPtrs = expect.map(index => ptrs[index])
  const expectedPtrList = new PathList({ factory, ptrs: expectedPtrs })
  const expectedQuads = expect ? expect.map(index => quads[index]) : quads

  return {
    terms,
    graphs,
    quads,
    dataset,
    edges,
    grapoi,
    ptrs,
    ptrList,
    expectedPtrs,
    expectedPtrList,
    expectedQuads,
    predicates,
    ...args
  }
}

export {
  createPathDataset,
  createPathListDataset
}
