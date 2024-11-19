import { strictEqual, throws } from 'assert'
import { describe, it } from 'mocha'
import { datasetEqual } from 'rdf-test/assert.js'
import Edge from '../Edge.js'
import Processor from '../Processor.js'
import datasets from './support/datasets.single.js'
import * as ns from './support/namespaces.js'
import { grapoiEqual } from './support/toJSON.js'

describe('Processor', () => {
  describe('.add', () => {
    it('should be a static method', () => {
      strictEqual(typeof Processor.add, 'function')
    })

    it('should throw an error if a ptr without factory is given', () => {
      const { ptr } = datasets.addOutNoFactory()

      throws(() => {
        Processor.add({ ptr })
      })
    })

    it('should return the ptr', () => {
      const { graph, objects, predicates, ptr } = datasets.addOut()

      const result = Processor.add({
        ptr,
        start: 'subject',
        end: 'object',
        predicates,
        objects,
        graphs: [graph]
      })

      strictEqual(result, ptr)
    })

    it('should add quads for the given predicates and objects', () => {
      const { graph, objects, predicates, ptr, quads } = datasets.addOut()

      Processor.add({
        ptr,
        start: 'subject',
        end: 'object',
        predicates,
        objects,
        graphs: [graph]
      })

      datasetEqual(ptr.dataset, quads)
    })

    it('should call the callback function with an edge argument', () => {
      const { edges, graph, objects, predicates, ptr } = datasets.addOut()
      const result = []

      Processor.add({
        ptr,
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

  describe('.addList', () => {
    it('should be a static method', () => {
      strictEqual(typeof Processor.addList, 'function')
    })

    it('should return the ptr', () => {
      const { graph, items, predicates, ptr } = datasets.addListEmpty()

      const result = Processor.addList({
        ptr,
        predicates,
        items,
        graphs: [graph]
      })

      strictEqual(result, ptr)
    })

    it('should add an empty list of items is empty', () => {
      const { graph, items, predicates, ptr, quads } = datasets.addListEmpty()

      Processor.addList({
        ptr,
        predicates,
        items,
        graphs: [graph]
      })

      datasetEqual(ptr.dataset, quads)
    })

    it('should add the given items to the list', () => {
      const { graph, items, predicates, ptr, quads } = datasets.addList()

      Processor.addList({
        ptr,
        predicates,
        items,
        graphs: [graph]
      })

      datasetEqual(ptr.dataset, quads)
    })

    it('should throw an error if the ptr is an any ptr', () => {
      const { graph, items, predicates, ptr } = datasets.addListAny()

      throws(() => {
        Processor.addList({
          ptr,
          predicates,
          items,
          graphs: [graph]
        })
      })
    })
  })

  describe('.delete', () => {
    it('should be a static method', () => {
      strictEqual(typeof Processor.delete, 'function')
    })

    it('should return the ptr', () => {
      const { ptr } = datasets.deleteOut()

      const result = Processor.delete({
        ptr,
        start: 'object',
        subjects: [null],
        predicates: [null],
        objects: [null]
      })

      strictEqual(result, ptr)
    })

    it('should loop over all subjects', () => {
      const { expectedQuads, ptr, subjects } = datasets.deleteObjectSubject()

      Processor.delete({
        ptr,
        start: 'object',
        subjects,
        predicates: [null],
        objects: [null]
      })

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should loop over all predicates', () => {
      const { expectedQuads, predicates, ptr } = datasets.deleteSubjectPredicate()

      Processor.delete({
        ptr,
        start: 'subject',
        subjects: [null],
        predicates,
        objects: [null]
      })

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should loop over all objects', () => {
      const { expectedQuads, objects, ptr } = datasets.deleteSubjectObject()

      Processor.delete({
        ptr,
        start: 'subject',
        subjects: [null],
        predicates: [null],
        objects
      })

      datasetEqual(ptr.dataset, expectedQuads)
    })
  })

  describe('deleteList', () => {
    it('should be a static method', () => {
      strictEqual(typeof Processor.deleteList, 'function')
    })

    it('should return the ptr', () => {
      const { predicates, ptr } = datasets.deleteList()

      const result = Processor.deleteList({ ptr, predicates })

      strictEqual(result, ptr)
    })

    it('should delete all quads related to the list', () => {
      const { expectedQuads, predicates, ptr } = datasets.deleteList()

      const result = Processor.deleteList({ ptr, predicates })

      datasetEqual(result.dataset, expectedQuads)
    })
  })

  describe('.execute', () => {
    it('should be a static method', () => {
      strictEqual(typeof Processor.execute, 'function')
    })

    it('should throw an error if an unknown operation is given', () => {
      const { ptr } = datasets.default()

      throws(() => {
        Processor.execute({ ptr, operation: 'test' })
      })
    })

    it('should support the add operation', () => {
      const { expectedQuads, graph, objects, predicates, ptr } = datasets.executeAddOut()

      Processor.execute({
        ptr,
        operation: 'add',
        start: 'subject',
        end: 'object',
        predicates,
        objects,
        graphs: [graph]
      })

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should support the addList operation', () => {
      const { expectedQuads, graph, items, predicates, ptr } = datasets.executeAddList()

      Processor.execute({
        ptr,
        operation: 'addList',
        predicates,
        items,
        graphs: [graph]
      })

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should support the delete operation', () => {
      const { expectedQuads, ptr, subjects } = datasets.deleteObjectSubject()

      Processor.execute({
        ptr,
        operation: 'delete',
        start: 'object',
        subjects,
        predicates: [null],
        objects: [null]
      })

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should support the deleteList operation', () => {
      const { expectedQuads, predicates, ptr } = datasets.deleteList()

      Processor.execute({
        ptr,
        operation: 'deleteList',
        predicates
      })

      datasetEqual(ptr.dataset, expectedQuads)
    })

    it('should support the isList operation', () => {
      const { ptr } = datasets.isList()

      const result = Processor.execute({
        ptr,
        operation: 'isList'
      })

      strictEqual(result, true)
    })

    it('should support the list operation', () => {
      const { ptr } = datasets.list()

      const result = Processor.execute({
        ptr,
        operation: 'list'
      })

      strictEqual(typeof result[Symbol.iterator], 'function')

      const items = [...result]

      strictEqual(items.length, 2)
      strictEqual(items[0].term.equals(ns.ex.end1), true)
      strictEqual(items[1].term.equals(ns.ex.end2), true)
    })

    it('should support the traverse operation', () => {
      const { predicates, ptr, expectedPtrs } = datasets.traverseOne()

      const result = Processor.execute({
        ptr,
        operation: 'traverse',
        quantifier: 'one',
        predicates
      })

      grapoiEqual(result, expectedPtrs)
    })
  })

  describe('.isList', () => {
    it('should be a static method', () => {
      strictEqual(typeof Processor.isList, 'function')
    })

    it('should return false if the given ptr is an any ptr', () => {
      const { ptr } = datasets.any()

      const result = Processor.isList({ ptr })

      strictEqual(result, false)
    })

    it('should return false if the given ptr is not a list', () => {
      const { ptr } = datasets.default()

      const result = Processor.isList({ ptr })

      strictEqual(result, false)
    })

    it('should return true if the given ptr is a list', () => {
      const { ptr } = datasets.isList()

      const result = Processor.isList({ ptr })

      strictEqual(result, true)
    })

    it('should return true if the given ptr is an empty list', () => {
      const { ptr } = datasets.isListEmpty()

      const result = Processor.isList({ ptr })

      strictEqual(result, true)
    })
  })

  describe('.list', () => {
    it('should return an iterator that loops over all items of the list', () => {
      const { ptr } = datasets.list()

      const result = Processor.list({ ptr })

      strictEqual(typeof result[Symbol.iterator], 'function')

      const items = [...result]

      strictEqual(items.length, 2)
      strictEqual(items[0].term.equals(ns.ex.end1), true)
      strictEqual(items[1].term.equals(ns.ex.end2), true)
    })

    it('should return undefined if the node is not a list', () => {
      const { ptr } = datasets.default()

      const result = Processor.list({ ptr })

      strictEqual(result, undefined)
    })

    it('should throw an error if rdf:first count is zero', () => {
      const { ptr } = datasets.listFirst0()

      throws(() => {
        Array.from(Processor.list({ ptr }))
      })
    })

    it('should throw an error if rdf:first count is two', () => {
      const { ptr } = datasets.listFirst2()

      throws(() => {
        Array.from(Processor.list({ ptr }))
      })
    })

    it('should throw an error if rdf:rest count is zero', () => {
      const { ptr } = datasets.listRest0()

      throws(() => {
        Array.from(Processor.list({ ptr }))
      })
    })

    it('should throw an error if rdf:rest count is two', () => {
      const { ptr } = datasets.listRest2()

      throws(() => {
        Array.from(Processor.list({ ptr }))
      })
    })
  })

  describe('.traverse', () => {
    it('should support quantifier one', () => {
      const { predicates, ptr, expectedPtrs } = datasets.traverseOne()

      const result = Processor.traverse({
        ptr,
        quantifier: 'one',
        predicates
      })

      grapoiEqual(result, expectedPtrs)
    })

    it('should support quantifier oneOrMore', () => {
      const { expectedQuads, predicates, ptr } = datasets.traverseOneOrMore()

      const result = Processor.traverse({
        ptr,
        quantifier: 'oneOrMore',
        predicates
      })

      grapoiEqual(result, expectedQuads)
    })

    it('should support quantifier zeroOrMore', () => {
      const { expectedQuads, predicates, ptr } = datasets.traverseZeroOrMore()

      const result = Processor.traverse({
        ptr,
        quantifier: 'zeroOrMore',
        predicates
      })

      grapoiEqual(result, expectedQuads)
    })

    it('should support quantifier zeroOrOne', () => {
      const { expectedQuads, predicates, ptr } = datasets.traverseZeroOrOne()

      const result = Processor.traverse({
        ptr,
        quantifier: 'zeroOrOne',
        predicates
      })

      grapoiEqual(result, expectedQuads)
    })

    it('should throw an error if an unknown quantifier is given', () => {
      const { predicates, ptr } = datasets.traverseOne()

      throws(() => {
        Processor.traverse({
          ptr,
          quantifier: 'test',
          predicates
        })
      })
    })
  })

  describe('.traverseMore', () => {
    it('should be a static method', () => {
      strictEqual(typeof Processor.traverseMore, 'function')
    })

    it('should return all expectedPtrs matching the current ptr or nested results', () => {
      const { expectedQuads, predicates, ptr } = datasets.traverseZeroOrMore()

      const result = Processor.traverseMore({
        ptrs: [ptr],
        end: 'object',
        start: 'subject',
        subjects: [null],
        predicates,
        objects: [null],
        graphs: [null]
      })

      grapoiEqual(result, expectedQuads)
    })

    it('should stop traversing if the start and end of an edge are the same', () => {
      const { expectedQuads, predicates, ptr } = datasets.traverseZeroOrMoreSelfRef()

      const result = Processor.traverseMore({
        ptrs: [ptr],
        end: 'object',
        start: 'subject',
        subjects: [null],
        predicates,
        objects: [null],
        graphs: [null]
      })

      grapoiEqual(result, expectedQuads)
    })

    it('should stop traversing if the end of an edge has been previously seen', () => {
      const { expectedQuads, predicates, ptr } = datasets.traverseZeroOrMoreSelfRef2()

      const result = Processor.traverseMore({
        ptrs: [ptr],
        end: 'object',
        start: 'subject',
        subjects: [null],
        predicates,
        objects: [null],
        graphs: [null]
      })

      grapoiEqual(result, expectedQuads)
    })
  })

  describe('.traverseOne', () => {
    it('should be a static method', () => {
      strictEqual(typeof Processor.traverseOne, 'function')
    })

    it('should loop over all subjects', () => {
      const result = []
      const { expectedQuads, ptr, subjects } = datasets.traverseOneSubject()

      Processor.traverseOne({
        ptr,
        end: 'subject',
        start: 'object',
        subjects,
        predicates: [null],
        objects: [null],
        graphs: [null],
        callback: ({ quad }) => result.push(quad)
      })

      datasetEqual(result, expectedQuads)
    })

    it('should loop over all predicates', () => {
      const result = []
      const { expectedQuads, predicates, ptr } = datasets.traverseOnePredicate()

      Processor.traverseOne({
        ptr,
        end: 'subject',
        start: 'object',
        subjects: [null],
        predicates,
        objects: [null],
        graphs: [null],
        callback: ({ quad }) => result.push(quad)
      })

      datasetEqual(result, expectedQuads)
    })

    it('should loop over all objects', () => {
      const result = []
      const { expectedQuads, objects, ptr } = datasets.traverseOneObject()

      Processor.traverseOne({
        ptr,
        end: 'object',
        start: 'subject',
        subjects: [null],
        predicates: [null],
        objects,
        graphs: [null],
        callback: ({ quad }) => result.push(quad)
      })

      datasetEqual(result, expectedQuads)
    })

    it('should use the ptr.term to match on position start', () => {
      const result = []
      const { expectedQuads, ptr } = datasets.traverseOnePtrTerm()

      Processor.traverseOne({
        ptr,
        end: 'object',
        start: 'subject',
        subjects: [null],
        predicates: [null],
        objects: [null],
        graphs: [null],
        callback: ({ quad }) => result.push(quad)
      })

      datasetEqual(result, expectedQuads)
    })

    it('should call the extend method with an edge argument', () => {
      const { dataset } = datasets.traverseOneSubject()
      const ptr = {
        dataset,
        extend: edge => strictEqual(edge instanceof Edge, true),
        term: null
      }

      Processor.traverseOne({
        ptr,
        end: 'object',
        start: 'subject',
        subjects: [null],
        predicates: [null],
        objects: [null],
        graphs: [null]
      })
    })
  })
})
