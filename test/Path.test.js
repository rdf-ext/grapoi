import { deepStrictEqual, notStrictEqual, strictEqual, throws } from 'assert'
import { describe, it } from 'mocha'
import { datasetEqual } from 'rdf-test/assert.js'
import Path from '../Path.js'
import datasets from './support/datasets.single.js'
import factory from './support/factory.js'
import * as ns from './support/namespaces.js'
import { grapoiEqual } from './support/toJSON.js'

describe('Path', () => {
  it('should be a constructor', () => {
    strictEqual(typeof Path, 'function')
  })

  it('should assign the given dataset to .dataset', () => {
    const { dataset } = datasets.default()
    const path = new Path({ dataset, term: null })

    strictEqual(path.dataset, dataset)
  })

  it('should throw an error if dataset is not given', () => {
    throws(() => {
      const ptr = new Path({})

      strictEqual(ptr, ptr)
    })
  })

  it('should use an empty array as default value for .edges', () => {
    const { dataset } = datasets.default()
    const path = new Path({ dataset, term: null })

    deepStrictEqual(path.edges, [])
  })

  it('should assign the given edges to .edges', () => {
    const { dataset, edges } = datasets.constructorEdges()
    const path = new Path({ dataset, edges })

    strictEqual(path.edges, edges)
  })

  it('should throw an error if edges and term are not given', () => {
    const { dataset } = datasets.default()

    throws(() => {
      const ptr = new Path({ dataset })

      strictEqual(ptr, ptr)
    })
  })

  it('should throw an error if edges and term are given', () => {
    const { dataset, edges, term } = datasets.constructorEdgesTerm()

    throws(() => {
      const ptr = new Path({ dataset, edges, term })

      strictEqual(ptr, ptr)
    })
  })

  it('should assign the given factory to .factory', () => {
    const { dataset, term } = datasets.default()
    const path = new Path({ dataset, factory, term })

    strictEqual(path.factory, factory)
  })

  it('should assign the given term to ._term', () => {
    const { dataset, term } = datasets.default()
    const path = new Path({ dataset, term })

    strictEqual(path._term, term)
  })

  it('should assign the given graph to ._graph', () => {
    const { dataset, graph, term } = datasets.defaultGraph()
    const path = new Path({ dataset, graph, term })

    strictEqual(path._graph, graph)
  })

  describe('.graph', () => {
    it('should be a term property', () => {
      const { ptr } = datasets.defaultGraph()

      strictEqual(typeof ptr.graph, 'object')
      strictEqual(typeof ptr.graph.termType, 'string')
    })

    it('should be the graph given in the constructor', () => {
      const { graph, ptr } = datasets.defaultGraph()

      strictEqual(ptr.graph.equals(graph), true)
    })

    it('should be the graph of the last edge if no graph was given in the constructor', () => {
      const { edges, ptr } = datasets.graphEdges()

      strictEqual(ptr.graph.equals(edges[edges.length - 1].graph), true)
    })

    it('should be null if null was given in the constructor, even if there are edges', () => {
      const { ptr } = datasets.graphEdgesNull()

      strictEqual(ptr.graph, null)
    })

    it('should be undefined if no graph is given', () => {
      const { ptr } = datasets.default()

      strictEqual(ptr.graph, undefined)
    })
  })

  describe('.length', () => {
    it('should be a number property', () => {
      const { ptr } = datasets.length()

      strictEqual(typeof ptr.length, 'number')
    })

    it('should return the number of nodes', () => {
      const { ptr } = datasets.length()

      strictEqual(ptr.length, 3)
    })

    it('should return one if the path has no edges', () => {
      const { ptr } = datasets.default()

      strictEqual(ptr.length, 1)
    })
  })

  describe('.startTerm', () => {
    it('should be the term argument if there are no edges', () => {
      const { dataset } = datasets.default()
      const term = ns.ex.subject
      const path = new Path({ dataset, term })

      strictEqual(path.startTerm, term)
    })

    it('should be .startTerm of the first edge', () => {
      const { dataset, expectedPtrs } = datasets.startTerm()
      const edges = [expectedPtrs[0].edges[0], expectedPtrs[1].edges[0]]
      const path = new Path({ dataset, edges })

      strictEqual(path.startTerm.equals(ns.ex.start), true)
    })
  })

  describe('.value', () => {
    it('should return undefined if it is an any ptr', () => {
      const { ptr } = datasets.any()

      strictEqual(ptr.value, undefined)
    })

    it('should return the value of the term', () => {
      const { ptr } = datasets.value()

      strictEqual(ptr.value, ns.ex.start.value)
    })
  })

  describe('.addIn', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.addIn, 'function')
    })

    it('should return itself', () => {
      const { predicates, ptr, subjects } = datasets.addIn()

      const result = ptr.addIn(predicates, subjects)

      strictEqual(result, ptr)
    })

    it('should add quads for the given predicates and subjects', () => {
      const { predicates, ptr, quads, subjects } = datasets.addIn()

      ptr.addIn(predicates, subjects)

      datasetEqual(ptr.dataset, quads)
    })

    it('should add quads for the given predicates, subjects, and graph', () => {
      const { predicates, ptr, quads, subjects } = datasets.addInGraph()

      ptr.addIn(predicates, subjects)

      datasetEqual(ptr.dataset, quads)
    })

    it('should call the callback function with a path object for the new path', () => {
      const { predicates, ptr, expectedPtrs, subjects } = datasets.addIn()
      const result = []

      ptr.addIn(predicates, subjects, path => result.push(path))

      grapoiEqual(result, expectedPtrs)
    })
  })

  describe('.addList', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.addList, 'function')
    })

    it('should return itself', () => {
      const { items, predicates, ptr } = datasets.addList()

      const result = ptr.addList(predicates, items)

      strictEqual(result, ptr)
    })

    it('should create an empty list if an empty item list is given', () => {
      const { dataset, items, predicates, ptr } = datasets.addListEmpty()

      ptr.addList(predicates, items)

      datasetEqual(ptr.dataset, dataset)
    })

    it('should add the given items to the list', () => {
      const { dataset, items, predicates, ptr } = datasets.addList()

      ptr.addList(predicates, items)

      datasetEqual(ptr.dataset, dataset)
    })

    it('should add the given items to the list for the given graph', () => {
      const { dataset, items, predicates, ptr } = datasets.addListGraph()

      ptr.addList(predicates, items)

      datasetEqual(ptr.dataset, dataset)
    })

    it('should throw an error if the ptr is an any ptr', () => {
      const { items, predicates, ptr } = datasets.addListAny()

      throws(() => {
        ptr.addList(predicates, items)
      })
    })
  })

  describe('.addOut', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.addOut, 'function')
    })

    it('should return itself', () => {
      const { objects, predicates, ptr } = datasets.addOut()

      const result = ptr.addOut(predicates, objects)

      strictEqual(result, ptr)
    })

    it('should add quads for the given predicates and objects', () => {
      const { objects, predicates, ptr, quads } = datasets.addOut()

      ptr.addOut(predicates, objects)

      datasetEqual(ptr.dataset, quads)
    })

    it('should add quads for the given predicates, objects and graph', () => {
      const { objects, predicates, ptr, quads } = datasets.addOutGraph()

      ptr.addOut(predicates, objects)

      datasetEqual(ptr.dataset, quads)
    })

    it('should call the callback function with a path object for the new path', () => {
      const { objects, predicates, ptr, expectedPtrs } = datasets.addOut()
      const result = []

      ptr.addOut(predicates, objects, path => result.push(path))

      grapoiEqual(result, expectedPtrs)
    })
  })

  describe('.deleteIn', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.deleteIn, 'function')
    })

    it('should return itself', () => {
      const { predicates, ptr, subjects } = datasets.deleteIn()

      const result = ptr.deleteIn(predicates, subjects)

      strictEqual(result, ptr)
    })

    it('should delete the quads matching the O->PS pattern', () => {
      const { expectedQuads, predicates, ptr, subjects } = datasets.deleteIn()

      ptr.deleteIn(predicates, subjects)

      datasetEqual(ptr.dataset, expectedQuads)
    })
  })

  describe('.deleteList', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.deleteList, 'function')
    })

    it('should return itself', () => {
      const { predicates, ptr } = datasets.deleteList()

      const result = ptr.deleteList(predicates)

      strictEqual(result, ptr)
    })

    it('should delete all quads related to the list', () => {
      const { expectedQuads, predicates, ptr } = datasets.deleteList()

      ptr.deleteList(predicates)

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should delete empty lists', () => {
      const { expectedQuads, predicates, ptr } = datasets.deleteListEmpty()

      ptr.deleteList(predicates)

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should handle lists with rdf:first count zero', () => {
      const { expectedQuads, predicates, ptr } = datasets.deleteListFirst0()

      ptr.deleteList(predicates)

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should handle lists with rdf:first count greater one', () => {
      const { expectedQuads, predicates, ptr } = datasets.deleteListFirst2()

      ptr.deleteList(predicates)

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should handle lists with rdf:rest count zero', () => {
      const { expectedQuads, predicates, ptr } = datasets.deleteListRest0()

      ptr.deleteList(predicates)

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should handle lists with rdf:rest count greater one', () => {
      const { expectedQuads, predicates, ptr } = datasets.deleteListRest2()

      ptr.deleteList(predicates)

      datasetEqual(ptr.dataset, expectedQuads)
    })
  })

  describe('.deleteOut', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.deleteOut, 'function')
    })

    it('should return itself', () => {
      const { objects, predicates, ptr } = datasets.deleteIn()

      const result = ptr.deleteOut(predicates, objects)

      strictEqual(result, ptr)
    })

    it('should delete the quads matching the S->PO pattern', () => {
      const { expectedQuads, objects, predicates, ptr } = datasets.deleteOut()

      ptr.deleteOut(predicates, objects)

      datasetEqual(ptr.dataset, expectedQuads)
    })
  })

  describe('.execute', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.execute, 'function')
    })

    it('should use the ptr as argument', () => {
      const { objects, predicates, ptr, expectedPtrs } = datasets.default()

      const result = ptr.execute({
        predicates,
        objects,
        callback: (edge, ptr) => ptr.extend(edge)
      })

      grapoiEqual(result, expectedPtrs)
    })

    it('should forward the given operation argument', () => {
      const { dataset, graph, items, predicates, ptr } = datasets.executeAddList()

      ptr.execute({
        operation: 'addList',
        predicates,
        items,
        graphs: [graph]
      })

      datasetEqual(ptr.dataset, dataset)
    })

    it('should forward the given quantifier argument', () => {
      const { expectedQuads, predicates, ptr } = datasets.executeQuantifier()

      const result = ptr.execute({
        quantifier: 'oneOrMore',
        predicates,
        callback: (edge, ptr) => ptr.extend(edge)
      })

      grapoiEqual(result, expectedQuads)
    })

    it('should forward the given start and end argument', () => {
      const { predicates, ptr, expectedPtrs, subjects } = datasets.executeStartEnd()

      const result = ptr.execute({
        start: 'object',
        end: 'subject',
        subjects,
        predicates,
        callback: (edge, ptr) => ptr.extend(edge)
      })

      grapoiEqual(result, expectedPtrs)
    })

    it('should forward the given subjects argument', () => {
      const { predicates, ptr, expectedPtrs, subjects } = datasets.executeSubject()

      const result = ptr.execute({
        start: 'object',
        end: 'subject',
        subjects,
        predicates,
        callback: (edge, ptr) => ptr.extend(edge)
      })

      grapoiEqual(result, expectedPtrs)
    })

    it('should forward the given predicates argument', () => {
      const { objects, predicates, ptr, expectedPtrs } = datasets.executePredicates()

      const result = ptr.execute({
        predicates,
        objects
      })

      grapoiEqual(result, expectedPtrs)
    })

    it('should forward the given objects argument', () => {
      const { objects, predicates, ptr, expectedPtrs } = datasets.executeObjects()

      const result = ptr.execute({
        predicates,
        objects
      })

      grapoiEqual(result, expectedPtrs)
    })

    it('should forward the given items argument', () => {
      const { dataset, graph, items, predicates, ptr } = datasets.executeAddList()

      ptr.execute({
        operation: 'addList',
        predicates,
        items,
        graphs: [graph]
      })

      datasetEqual(ptr.dataset, dataset)
    })

    it('should forward the given callback argument', () => {
      const { edges, graph, objects, predicates, ptr } = datasets.executeAddOut()
      const result = []

      ptr.execute({
        operation: 'add',
        start: 'subject',
        end: 'object',
        predicates,
        objects,
        graphs: [graph],
        callback: edge => result.push(edge)
      })

      grapoiEqual(result, edges)
    })
  })

  describe('.extend', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.extend, 'function')
    })

    it('should return a new path object', () => {
      const { ptr, quads } = datasets.extend()

      const result = ptr.extend({
        quad: quads[0],
        start: 'subject',
        end: 'object'
      })

      strictEqual(result instanceof Path, true)
      notStrictEqual(result, ptr)
    })

    it('should copy the dataset', () => {
      const { ptr, quads } = datasets.extend()

      const result = ptr.extend({
        quad: quads[0],
        start: 'subject',
        end: 'object'
      })

      strictEqual(result.dataset, ptr.dataset)
    })

    it('should copy the factory', () => {
      const { ptr, quads } = datasets.extend()

      const result = ptr.extend({
        quad: quads[0],
        start: 'subject',
        end: 'object'
      })

      strictEqual(result.factory, ptr.factory)
    })

    it('should copy the graph', () => {
      const { graph, ptr, quads } = datasets.extendGraph()

      const result = ptr.extend({
        quad: quads[0],
        start: 'subject',
        end: 'object'
      })

      strictEqual(result._graph, graph)
    })

    it('should copy a null graph', () => {
      const { graph, ptr, quads } = datasets.extendGraphNull()

      const result = ptr.extend({
        quad: quads[0],
        start: 'subject',
        end: 'object'
      })

      strictEqual(result._graph, graph)
    })

    it('should copy a undefined graph', () => {
      const { graph, ptr, quads } = datasets.extend()

      const result = ptr.extend({
        quad: quads[0],
        start: 'subject',
        end: 'object'
      })

      strictEqual(result._graph, graph)
    })

    it('should return a path object with the given edge appended', () => {
      const { edges, expectedQuads, ptr } = datasets.extend()

      const result = ptr.extend(edges[1])

      grapoiEqual(result, expectedQuads)
    })
  })

  describe('.hasIn', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.hasIn, 'function')
    })

    it('should return all expectedPtrs matching O->S for all given properties', () => {
      const { predicates, expectedPtrs, ptr } = datasets.hasIn()

      const result = ptr.hasIn(predicates)

      grapoiEqual(result, expectedPtrs)
    })

    it('should return all expectedPtrs matching O->S for all given properties in the defined graph', () => {
      const { predicates, expectedPtrs, ptr } = datasets.hasInGraph()

      const result = ptr.hasIn(predicates)

      grapoiEqual(result, expectedPtrs)
    })

    it('should return all expectedPtrs matching O->S for all given properties and subjects', () => {
      const { predicates, expectedPtrs, ptr, subjects } = datasets.hasInSubjects()

      const result = ptr.hasIn(predicates, subjects)

      grapoiEqual(result, expectedPtrs)
    })
  })

  describe('.hasOut', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.hasOut, 'function')
    })

    it('should return all expectedPtrs matching S->O for all given properties', () => {
      const { predicates, expectedPtrs, ptr } = datasets.hasOut()

      const result = ptr.hasOut(predicates)

      grapoiEqual(result, expectedPtrs)
    })

    it('should return all expectedPtrs matching S->O for all given properties in the defined graph', () => {
      const { predicates, expectedPtrs, ptr } = datasets.hasOutGraph()

      const result = ptr.hasOut(predicates)

      grapoiEqual(result, expectedPtrs)
    })

    it('should return all expectedPtrs matching S->O for all given properties and subjects', () => {
      const { objects, predicates, expectedPtrs, ptr } = datasets.hasOutObjects()

      const result = ptr.hasOut(predicates, objects)

      grapoiEqual(result, expectedPtrs)
    })
  })

  describe('.in', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.in, 'function')
    })

    it('should return all expectedPtrs traversing O->S for all given properties', () => {
      const { predicates, expectedPtrs, ptr } = datasets.in()

      const result = ptr.in(predicates)

      grapoiEqual(result, expectedPtrs)
    })

    it('should return all expectedPtrs traversing O->S for all given properties in the defined graph', () => {
      const { predicates, expectedPtrs, ptr } = datasets.inGraph()

      const result = ptr.in(predicates)

      grapoiEqual(result, expectedPtrs)
    })

    it('should return all expectedPtrs traversing O->S for all given properties and subjects', () => {
      const { predicates, expectedPtrs, ptr, subjects } = datasets.inSubjects()

      const result = ptr.in(predicates, subjects)

      grapoiEqual(result, expectedPtrs)
    })
  })

  describe('.isAny', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.isAny, 'function')
    })

    it('should return true if the term is null', () => {
      const { ptr } = datasets.any()

      strictEqual(ptr.isAny(), true)
    })

    it('should return false if the term is not null', () => {
      const { ptr } = datasets.default()

      strictEqual(ptr.isAny(), false)
    })
  })

  describe('.isList', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.isList, 'function')
    })

    it('should return false if the ptr is an any ptr', () => {
      const { ptr } = datasets.any()

      strictEqual(ptr.isList(), false)
    })

    it('should return true if the ptr is a list', () => {
      const { ptr } = datasets.isList()

      strictEqual(ptr.isList(), true)
    })

    it('should return true if the ptr is an empty list', () => {
      const { ptr } = datasets.isListEmpty()

      strictEqual(ptr.isList(), true)
    })
  })

  describe('.list', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.list, 'function')
    })

    it('should return an iterator that loops over all items of the list', () => {
      const { ptr } = datasets.list()

      const result = ptr.list()

      strictEqual(typeof result[Symbol.iterator], 'function')

      const items = [...result]

      strictEqual(items.length, 2)
      strictEqual(items[0] instanceof Path, true)
      strictEqual(items[0].term.equals(ns.ex.end1), true)
      strictEqual(items[1] instanceof Path, true)
      strictEqual(items[1].term.equals(ns.ex.end2), true)
    })

    it('should return undefined if the node is not a list', () => {
      const { ptr } = datasets.default()

      strictEqual(ptr.list(), undefined)
    })

    it('should throw an error if rdf:first count is zero', () => {
      const { ptr } = datasets.listFirst0()

      throws(() => {
        Array.from(ptr.list())
      })
    })

    it('should throw an error if rdf:first count is greater one', () => {
      const { ptr } = datasets.listFirst2()

      throws(() => {
        Array.from(ptr.list())
      })
    })

    it('should throw an error if rdf:rest count is zero', () => {
      const { ptr } = datasets.listRest0()

      throws(() => {
        Array.from(ptr.list())
      })
    })

    it('should throw an error if rdf:rest count is greater one', () => {
      const { ptr } = datasets.listRest2()

      throws(() => {
        Array.from(ptr.list())
      })
    })
  })

  describe('.nodes', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.nodes, 'function')
    })

    it('should return an iterator', () => {
      const { ptr } = datasets.default()

      const result = ptr.nodes()

      strictEqual(typeof result[Symbol.iterator], 'function')
    })

    it('should loop over all nodes', () => {
      const { ptr } = datasets.nodes()

      const result = [...ptr.nodes()]

      strictEqual(result.length, ptr.length)

      for (let index = 0; index < ptr.edges.length; index++) {
        strictEqual(result[index].dataset, ptr.edges[index].dataset)
        strictEqual(result[index].term.equals(ptr.edges[index].startTerm), true)
      }

      strictEqual(result[ptr.edges.length].dataset, ptr.edges[ptr.edges.length - 1].dataset)
      strictEqual(result[ptr.edges.length].term.equals(ptr.edges[ptr.edges.length - 1].term), true)
    })

    it('should loop over the term of the ptr if there are no edges', () => {
      const { dataset, ptr } = datasets.default()

      const result = [...ptr.nodes()]

      strictEqual(result.length, 1)
      strictEqual(result[0].dataset, dataset)
      strictEqual(result[0].term.equals(ptr.term), true)
    })
  })

  describe('.out', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.out, 'function')
    })

    it('should return all expectedPtrs traversing S->O for all given properties', () => {
      const { predicates, ptr, expectedPtrs } = datasets.out()

      const result = ptr.out(predicates)

      grapoiEqual(result, expectedPtrs)
    })

    it('should return all expectedPtrs traversing S->O for all given properties in the defined graph', () => {
      const { predicates, ptr, expectedPtrs } = datasets.outGraph()

      const result = ptr.out(predicates)

      grapoiEqual(result, expectedPtrs)
    })

    it('should return all expectedPtrs traversing S->O for all given properties and subjects', () => {
      const { objects, predicates, expectedPtrs, ptr } = datasets.outObjects()

      const result = ptr.out(predicates, objects)

      grapoiEqual(result, expectedPtrs)
    })
  })

  describe('.quads', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.quads, 'function')
    })

    it('should return an iterator', () => {
      const { ptr } = datasets.default()

      const result = ptr.quads()

      strictEqual(typeof result[Symbol.iterator], 'function')
    })

    it('should loop over all quads', () => {
      const { dataset, ptr } = datasets.quadsEdges()

      const quads = ptr.quads()

      datasetEqual(quads, dataset)
    })

    it('should return an empty iterator if there are no edges', () => {
      const { ptr } = datasets.default()

      const result = [...ptr.quads()]

      strictEqual(result.length, 0)
    })
  })

  describe('.trim', () => {
    it('should be a method', () => {
      const { ptr } = datasets.default()

      strictEqual(typeof ptr.trim, 'function')
    })

    it('should trim the edges from the path and keep only the term', () => {
      const { expectedPtr, ptr } = datasets.trim()

      const result = ptr.trim()

      grapoiEqual(result, expectedPtr)
    })
  })
})
