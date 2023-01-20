/* import { deepStrictEqual, strictEqual } from 'assert'
import { describe, it } from 'mocha'
import toCanonical from 'rdf-dataset-ext/toCanonical.js'
import Path from '../Path.js'
import PathList from '../PathList.js'
import datasets from './support/datasets.multi.js'
import factory from './support/factory.js'
import * as ns from './support/namespaces.js'
import toJSON from './support/toJSON.js'

describe('Grapoi', () => {
  it('should be a constructor', () => {
    strictEqual(typeof PathList, 'function')
  })

  it('should assign the given factory', () => {
    const dataset = factory.dataset()

    const nodeList = new PathList({ dataset, factory })

    strictEqual(nodeList.factory, factory)
  })

  it('should use an any Path ptr if no ptrs are given', () => {
    const dataset = factory.dataset()

    const nodeList = new PathList({ dataset })

    strictEqual(nodeList.ptrs.length, 1)
    strictEqual(nodeList.ptrs[0] instanceof Path, true)
    strictEqual(nodeList.ptrs[0].term, null)
  })

  it('should use the given ptrs', () => {
    const dataset = factory.dataset()
    const ptr0 = new Path({ dataset, term: ns.ex.start1 })
    const ptr1 = new Path({ dataset, term: ns.ex.start2 })
    const ptrs = new Set([ptr0, ptr1])

    const nodeList = new PathList({ ptrs })

    strictEqual(nodeList.ptrs.length, 2)
    strictEqual(nodeList.ptrs[0], ptr0)
    strictEqual(nodeList.ptrs[1], ptr1)
  })

  it('should create a Path ptr for each of the given terms', () => {
    const dataset = factory.dataset()
    const terms = new Set([ns.ex.start1, ns.ex.start2])

    const nodeList = new PathList({ dataset, terms })

    strictEqual(nodeList.ptrs.length, 2)
    strictEqual(nodeList.ptrs[0] instanceof Path, true)
    strictEqual(ns.ex.start1.equals(nodeList.ptrs[0].term), true)
    strictEqual(nodeList.ptrs[1] instanceof Path, true)
    strictEqual(ns.ex.start2.equals(nodeList.ptrs[1].term), true)
  })

  it('should create a Path ptr for each of the given terms with the given factory', () => {
    const dataset = factory.dataset()
    const terms = new Set([ns.ex.start1, ns.ex.start2])

    const nodeList = new PathList({ dataset, factory, terms })

    strictEqual(nodeList.ptrs.length, 2)
    strictEqual(nodeList.ptrs[0].factory, factory)
    strictEqual(nodeList.ptrs[1].factory, factory)
  })

  describe('.addIn', () => {
    it('should be a method', () => {
      const { nodeListStart } = datasets.addIn()

      strictEqual(typeof nodeListStart.addIn, 'function')
    })

    it('should return itself', () => {
      const { nodeListStart } = datasets.addIn()

      const result = nodeListStart.addIn(new Set([ns.ex.property]), new Set([ns.ex.end]))

      strictEqual(result, nodeListStart)
    })

    it('should add quads for the given predicates and subjects', () => {
      const { nodeListStart, quads } = datasets.addIn()

      nodeListStart.addIn(new Set([ns.ex.propertyA, ns.ex.propertyB]), new Set([ns.ex.end1, ns.ex.end2]))

      const result = [...nodeListStart.dataset]

      strictEqual(toCanonical(result), toCanonical(quads))
    })

    it('should call the callback function with a node list argument', () => {
      const { nodeList, nodeListStart } = datasets.addIn()
      const result = []

      nodeListStart.addIn(
        new Set([ns.ex.propertyA, ns.ex.propertyB]),
        new Set([ns.ex.end1, ns.ex.end2]),
        nodeList => result.push(nodeList)
      )

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })
  })

  describe('.addOut', () => {
    it('should be a method', () => {
      const { nodeListStart } = datasets.addOut()

      strictEqual(typeof nodeListStart.addOut, 'function')
    })

    it('should return itself', () => {
      const { nodeListStart } = datasets.addOut()

      const result = nodeListStart.addOut(new Set([ns.ex.property]), new Set([ns.ex.end]))

      strictEqual(result, nodeListStart)
    })

    it('should add quads for the given predicates and objects', () => {
      const { nodeListStart, quads } = datasets.addOut()

      nodeListStart.addOut(new Set([ns.ex.propertyA, ns.ex.propertyB]), new Set([ns.ex.end1, ns.ex.end2]))

      const result = [...nodeListStart.dataset]

      strictEqual(toCanonical(result), toCanonical(quads))
    })

    it('should call the callback function with a node object for the new node', () => {
      const { nodeList, nodeListStart } = datasets.addOut()
      const result = []

      nodeListStart.addOut(
        new Set([ns.ex.propertyA, ns.ex.propertyB]),
        new Set([ns.ex.end1, ns.ex.end2]),
        nodeList => result.push(nodeList)
      )

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })
  })

  describe('.execute', () => {
    it('should support quantifier one', () => {
      const { nodeList, nodeListStart } = datasets.traverseOne()

      const result = nodeListStart.execute({ predicates: new Set([ns.ex.propertyA, ns.ex.propertyB]) })

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })

    it('should support quantifier oneOrMore', () => {
      const { nodeList, nodeListStart } = datasets.traverseOneOrMore()

      const result = nodeListStart.execute({
        quantifier: 'oneOrMore',
        predicates: new Set([ns.ex.propertyA, ns.ex.propertyB])
      })

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })

    it('should support quantifier zeroOrMore', () => {
      const { nodeList, nodeListStart } = datasets.traverseZeroOrMore()

      const result = nodeListStart.execute({
        quantifier: 'zeroOrMore',
        predicates: new Set([ns.ex.propertyA, ns.ex.propertyB])
      })

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })

    it('should support quantifier zeroOrOne', () => {
      const { nodeList, nodeListStart } = datasets.traverseZeroOrOne()

      const result = nodeListStart.execute({
        quantifier: 'zeroOrOne',
        predicates: new Set([ns.ex.propertyA, ns.ex.propertyB])
      })

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })
  })

  describe('.executeAll', () => {
    it('should execture all given instructions', () => {
      const { instructions, nodeList, nodeListStart } = datasets.executeAll()

      const result = nodeListStart.executeAll(instructions)

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })
  })

  describe('.extend', () => {
    it('should be a method', () => {
      const { nodeListStart } = datasets.extend()

      strictEqual(typeof nodeListStart.extend, 'function')
    })

    it('should copy the factory', () => {
      const { nodeList, nodeListStart } = datasets.extend()

      const result = nodeListStart.extend(nodeList.ptrs[0], nodeList.ptrs[1])

      strictEqual(result.factory, nodeListStart.factory)
    })

    it('should return a PathList extended by the given ptr', () => {
      const { nodeList, nodeListStart } = datasets.extend()

      const result = nodeListStart.extend(nodeList.ptrs[0], nodeList.ptrs[1])

      strictEqual(result.ptrs[0], nodeList.ptrs[1])
    })
  })

  describe('.filter', () => {
    it('should call the callback function with a PathList, index, and an array of all PathList objects for each ptr', () => {
      const args = []
      const { nodeListStart } = datasets.out()

      nodeListStart.filter((nodeList, index, array) => args.push({ nodeList, index, array }))

      strictEqual(args.length, 2)
      strictEqual(args[0].nodeList.term.equals(ns.ex.start1), true)
      strictEqual(args[0].index, 0)
      strictEqual(Array.isArray(args[0].array), true)
      strictEqual(args[0].array[0] instanceof PathList, true)
      strictEqual(args[0].array[0].term.equals(ns.ex.start1), true)
      strictEqual(args[0].array[1] instanceof PathList, true)
      strictEqual(args[0].array[1].term.equals(ns.ex.start2), true)
      strictEqual(args[1].nodeList.term.equals(ns.ex.start2), true)
      strictEqual(args[1].index, 1)
      strictEqual(Array.isArray(args[1].array), true)
      strictEqual(args[1].array[0] instanceof PathList, true)
      strictEqual(args[1].array[0].term.equals(ns.ex.start1), true)
      strictEqual(args[1].array[1] instanceof PathList, true)
      strictEqual(args[1].array[1].term.equals(ns.ex.start2), true)
    })

    it('should return a new PathList object', () => {
      const { nodeListStart } = datasets.out()

      const result = nodeListStart.filter(nodeList => nodeList.term.equals(ns.ex.start2))

      strictEqual(result instanceof PathList, true)
    })

    it('should return a PathList object with ptrs where callback returned true', () => {
      const { nodeListStart } = datasets.out()

      const result = nodeListStart.filter(nodeList => nodeList.term.equals(ns.ex.start2))

      deepStrictEqual(toJSON(result.ptrs[0]), toJSON(nodeListStart.ptrs[1]))
    })
  })

  describe('.hasIn', () => {
    it('should return all nodes matching O->S for all given properties', () => {
      const { nodeList, nodeListStart } = datasets.hasIn()

      const result = nodeListStart.hasIn(new Set([ns.ex.propertyA, ns.ex.propertyB]))

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })

    it('should return all nodes matching O->S for all given properties and subjects', () => {
      const { nodeList, nodeListStart } = datasets.hasIn2()

      const result = nodeListStart.hasIn(new Set([ns.ex.propertyA, ns.ex.propertyB]), new Set([ns.ex.end2, ns.ex.end3]))

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })
  })

  describe('.hasOut', () => {
    it('should return all nodes matching S->O for all given properties', () => {
      const { nodeList, nodeListStart } = datasets.hasOut()

      const result = nodeListStart.hasOut(new Set([ns.ex.propertyA, ns.ex.propertyB]))

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })

    it('should return all nodes matching S->O for all given properties and subjects', () => {
      const { nodeList, nodeListStart } = datasets.hasOut2()

      const result = nodeListStart.hasOut(new Set([ns.ex.propertyA, ns.ex.propertyB]), new Set([ns.ex.end2, ns.ex.end3]))

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })
  })

  describe('.in', () => {
    it('should return all nodes traversing O->S for all given properties', () => {
      const { nodeList, nodeListStart } = datasets.in()

      const result = nodeListStart.in(new Set([ns.ex.propertyA, ns.ex.propertyB]))

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })

    it('should return all nodes traversing O->S for all given properties and subjects', () => {
      const { nodeList, nodeListStart } = datasets.in2()

      const result = nodeListStart.in(new Set([ns.ex.propertyA, ns.ex.propertyB]), new Set([ns.ex.end2, ns.ex.end3]))

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })
  })

  describe('.isList', () => {
    it('should return true if the ptr is a list', () => {
      const { nodeListStart } = datasets.list()

      strictEqual(nodeListStart.isList(), true)
    })
  })

  describe('.list', () => {
    it('should return an iterator that loops over all items of the list', () => {
      const { nodeListStart } = datasets.list()

      const result = nodeListStart.list()

      strictEqual(typeof result[Symbol.iterator], 'function')

      const items = [...result]

      strictEqual(items.length, 2)
      strictEqual(items[0] instanceof PathList, true)
      strictEqual(items[0].term.equals(ns.ex.end1), true)
      strictEqual(items[1] instanceof PathList, true)
      strictEqual(items[1].term.equals(ns.ex.end2), true)
    })
  })

  describe('.map', () => {
    it('should call the callback function with a PathList, index, and an array of all PathList objects for each ptr', () => {
      const args = []
      const { nodeListStart } = datasets.out()

      nodeListStart.map((nodeList, index, array) => args.push({ nodeList, index, array }))

      strictEqual(args.length, 2)
      strictEqual(args[0].nodeList.term.equals(ns.ex.start1), true)
      strictEqual(args[0].index, 0)
      strictEqual(Array.isArray(args[0].array), true)
      strictEqual(args[0].array[0] instanceof PathList, true)
      strictEqual(args[0].array[0].term.equals(ns.ex.start1), true)
      strictEqual(args[0].array[1] instanceof PathList, true)
      strictEqual(args[0].array[1].term.equals(ns.ex.start2), true)
      strictEqual(args[1].nodeList.term.equals(ns.ex.start2), true)
      strictEqual(args[1].index, 1)
      strictEqual(Array.isArray(args[1].array), true)
      strictEqual(args[1].array[0] instanceof PathList, true)
      strictEqual(args[1].array[0].term.equals(ns.ex.start1), true)
      strictEqual(args[1].array[1] instanceof PathList, true)
      strictEqual(args[1].array[1].term.equals(ns.ex.start2), true)
    })

    it('should return an array', () => {
      const { nodeListStart } = datasets.out()

      const result = nodeListStart.map(nodeList => nodeList.term)

      strictEqual(Array.isArray(result), true)
    })

    it('should return an array of return values of the callback function', () => {
      const { nodeListStart } = datasets.out()

      const result = nodeListStart.map(nodeList => nodeList.term)

      strictEqual(result.length, 2)
      strictEqual(result[0].equals(ns.ex.start1), true)
      strictEqual(result[1].equals(ns.ex.start2), true)
    })
  })

  describe('.node', () => {
    it('should be a method', () => {
      const { nodeListStart } = datasets.out()

      strictEqual(typeof nodeListStart.node, 'function')
    })

    it('should create a PathList object with the given terms wrapped in Path objects', () => {
      const { nodeListStart } = datasets.out()
      const term0 = factory.blankPath()
      const term1 = factory.literal('test')
      const term2 = ns.ex.start
      const terms = new Set([term0, term1, term2])

      const result = nodeListStart.node(terms)

      strictEqual(result instanceof PathList, true)
      strictEqual(result.ptrs.length, 3)
      strictEqual(result.ptrs[0] instanceof Path, true)
      strictEqual(result.ptrs[0].term, term0)
      strictEqual(result.ptrs[1] instanceof Path, true)
      strictEqual(result.ptrs[1].term, term1)
      strictEqual(result.ptrs[2] instanceof Path, true)
      strictEqual(result.ptrs[2].term, term2)
    })

    it('should create the Path objects with the factory of the PathList object', () => {
      const { nodeListStart } = datasets.out()
      const terms = new Set([factory.blankPath(), factory.literal('test'), ns.ex.start])

      const result = nodeListStart.node(terms)

      strictEqual(result.ptrs[0].factory, nodeListStart.factory)
      strictEqual(result.ptrs[1].factory, nodeListStart.factory)
      strictEqual(result.ptrs[2].factory, nodeListStart.factory)
    })
  })

  describe('.out', () => {
    it('should return all nodes traversing S->O for all given properties', () => {
      const { nodeList, nodeListStart } = datasets.out()

      const result = nodeListStart.out(new Set([ns.ex.propertyA, ns.ex.propertyB]))

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })

    it('should return all nodes traversing S->O for all given properties and subjects', () => {
      const { nodeList, nodeListStart } = datasets.out2()

      const result = nodeListStart.out(new Set([ns.ex.propertyA, ns.ex.propertyB]), new Set([ns.ex.end2, ns.ex.end3]))

      deepStrictEqual(toJSON(result), toJSON(nodeList))
    })
  })

  describe('[Symbol.iterator]', () => {
    it('should return an iterator that loops over all ptrs wrapped into a PathList object', () => {
      const { nodeListStart } = datasets.out()

      const result = [...nodeListStart]

      strictEqual(result.length, 2)
      strictEqual(result[0] instanceof PathList, true)
      deepStrictEqual(toJSON(result[0].ptrs[0]), toJSON(nodeListStart.ptrs[0]))
      strictEqual(result[1] instanceof PathList, true)
      deepStrictEqual(toJSON(result[1].ptrs[0]), toJSON(nodeListStart.ptrs[1]))
    })
  })
})
*/
