import { notStrictEqual, strictEqual, throws } from 'assert'
import { describe, it } from 'mocha'
import { datasetEqual } from 'rdf-test/assert.js'
import Path from '../Path.js'
import PathList from '../PathList.js'
import datasets from './support/datasets.multi.js'
import factory from './support/factory.js'
import * as ns from './support/namespaces.js'
import { grapoiEqual } from './support/toJSON.js'

describe('PathList', () => {
  it('should be a constructor', () => {
    strictEqual(typeof PathList, 'function')
  })

  it('should assign the given factory', () => {
    const { dataset } = datasets.default()

    const ptrList = new PathList({ dataset, factory })

    strictEqual(ptrList.factory, factory)
  })

  it('should use an any Path ptr if no ptrs are given', () => {
    const { dataset } = datasets.default()

    const ptrList = new PathList({ dataset })

    strictEqual(ptrList.ptrs.length, 1)
    strictEqual(ptrList.ptrs[0] instanceof Path, true)
    strictEqual(ptrList.ptrs[0].term, null)
  })

  it('should use the given ptrs', () => {
    const { ptrs } = datasets.constructorPtrs()

    const ptrList = new PathList({ ptrs })

    strictEqual(ptrList.ptrs.length, ptrs.length)

    for (let index = 0; index < ptrs.length; index++) {
      strictEqual(ptrList.ptrs[index], ptrs[index])
    }
  })

  it('should create a Path ptr for each of the given terms', () => {
    const { dataset, terms } = datasets.default()

    const ptrList = new PathList({ dataset, terms })

    strictEqual(ptrList.ptrs.length, terms.length)

    for (let index = 0; index < terms.length; index++) {
      strictEqual(ptrList.ptrs[index] instanceof Path, true)
      strictEqual(ptrList.ptrs[index].term.equals(terms[index]), true)
    }
  })

  it('should create a Path ptr for each of the given terms and graphs', () => {
    const { dataset, graphs, terms } = datasets.constructorGraphs()

    const ptrList = new PathList({ dataset, graphs, terms })

    strictEqual(ptrList.ptrs.length, terms.length * graphs.length)

    for (let index = 0; index < terms.length * graphs.length; index++) {
      strictEqual(ptrList.ptrs[index].term.equals(terms[Math.floor(index / 2)]), true)
      strictEqual(ptrList.ptrs[index].graph.equals(graphs[index % 2]), true)
    }
  })

  it('should create a Path ptr for each of the given terms with the given factory', () => {
    const { dataset, terms } = datasets.default()

    const ptrList = new PathList({ dataset, factory, terms })

    strictEqual(ptrList.ptrs.length, terms.length)

    for (let index = 0; index < terms.length; index++) {
      strictEqual(ptrList.ptrs[index].factory, factory)
    }
  })

  it('should prioritize ptrs over terms', () => {
    const { dataset, ptrList, terms } = datasets.constructorPtrsVsTerms()

    const result = new PathList({ dataset, factory, ptrs: ptrList.ptrs, terms })

    grapoiEqual(result, ptrList)
  })

  describe('.dataset', () => {
    it('should be the dataset of the ptr', () => {
      const dataset = factory.dataset()
      const ptrList = new PathList({ factory, ptrs: [{ dataset }] })

      const result = ptrList.dataset

      strictEqual(result, dataset)
    })

    it('should be null if there are multiple datasets', () => {
      const ptrs = [{ dataset: factory.dataset() }, { dataset: factory.dataset() }]
      const ptrList = new PathList({ factory, ptrs })

      strictEqual(ptrList.dataset, null)
    })

    it('should be the dataset of the ptrs if all datasets are equal', () => {
      const dataset = factory.dataset()
      const ptrList = new PathList({ factory, ptrs: [{ dataset }, { dataset }] })

      strictEqual(ptrList.dataset, dataset)
    })
  })

  describe('.datasets', () => {
    it('should be an array property', () => {
      const ptrList = new PathList({ dataset: factory.dataset(), factory })

      strictEqual(Array.isArray(ptrList.datasets), true)
    })

    it('should contain all datasets of the ptrs', () => {
      const ptrs = [{ dataset: factory.dataset() }, { dataset: factory.dataset() }]
      const ptrList = new PathList({ factory, ptrs })

      const result = ptrList.datasets

      strictEqual(result.length, ptrs.length)

      for (let index = 0; index < ptrs.length; index++) {
        strictEqual(result[index], ptrs[index].dataset)
      }
    })

    it('should keep duplicates', () => {
      const dataset = factory.dataset()
      const ptrList = new PathList({ factory, ptrs: [{ dataset }, { dataset }] })

      const result = ptrList.datasets

      strictEqual(result.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(result[index], dataset)
      }
    })
  })

  describe('.term', () => {
    it('should be the term of the ptr', () => {
      const term = ns.ex.start1
      const ptrList = new PathList({ factory, ptrs: [{ term }] })

      strictEqual(ptrList.term.equals(term), true)
    })

    it('should be null if the ptr term is null', () => {
      const ptrList = new PathList({ factory, ptrs: [{ term: null }] })

      strictEqual(ptrList.term, null)
    })

    it('should be null if the term of all ptrs is null', () => {
      const ptrList = new PathList({ factory, ptrs: [{ term: null }, { term: null }] })

      strictEqual(ptrList.term, null)
    })

    it('should be undefined if there are multiple terms', () => {
      const ptrList = new PathList({ factory, ptrs: [{ term: ns.ex.start1 }, { term: ns.ex.start2 }] })

      strictEqual(ptrList.term, undefined)
    })

    it('should be undefined if there is a ptr with the term null and a ptr with a term not null', () => {
      const ptrList = new PathList({ factory, ptrs: [{ term: ns.ex.start1 }, { term: null }] })

      strictEqual(ptrList.dataset, undefined)
    })

    it('should be the term of the ptrs if all terms are equal', () => {
      const term = ns.ex.start1
      const ptrList = new PathList({ factory, ptrs: [{ term }, { term }] })

      strictEqual(ptrList.term.equals(term), true)
    })
  })

  describe('.terms', () => {
    it('should be an array property', () => {
      const ptrList = new PathList({ dataset: factory.dataset(), factory })

      strictEqual(Array.isArray(ptrList.terms), true)
    })

    it('should contain all terms of the ptrs', () => {
      const ptrList = new PathList({ factory, ptrs: [{ term: ns.ex.start1 }, { term: ns.ex.start2 }] })

      const result = ptrList.terms

      strictEqual(result.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(result[index].equals(ptrList.ptrs[index].term), true)
      }
    })

    it('should keep term duplicates', () => {
      const term = ns.ex.start1
      const ptrList = new PathList({ factory, ptrs: [{ term }, { term }] })

      const result = ptrList.terms

      strictEqual(result.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(result[index].equals(term), true)
      }
    })

    it('should keep null terms', () => {
      const ptrList = new PathList({ factory, ptrs: [{ term: null }, { term: null }] })

      const result = ptrList.terms

      strictEqual(result.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(result[index], null)
      }
    })
  })

  describe('.value', () => {
    it('should be the term value of the ptr', () => {
      const term = ns.ex.start1
      const ptrList = new PathList({ factory, ptrs: [{ term }] })

      strictEqual(ptrList.value, term.value)
    })

    it('should be undefined if the ptr term is null', () => {
      const ptrList = new PathList({ factory, ptrs: [{ term: null }] })

      strictEqual(ptrList.value, undefined)
    })

    it('should be undefined if the term of all ptrs is null', () => {
      const ptrList = new PathList({ factory, ptrs: [{ term: null }, { term: null }] })

      strictEqual(ptrList.value, undefined)
    })

    it('should be undefined if there are multiple terms', () => {
      const ptrList = new PathList({ factory, ptrs: [{ term: ns.ex.start1 }, { term: ns.ex.start2 }] })

      strictEqual(ptrList.value, undefined)
    })

    it('should be undefined if there is a ptr with the term null and a ptr with a term not null', () => {
      const ptrList = new PathList({ factory, ptrs: [{ term: ns.ex.start1 }, { term: null }] })

      strictEqual(ptrList.dataset, undefined)
    })

    it('should be the term value of the ptrs if all terms are equal', () => {
      const term = ns.ex.start1
      const ptrList = new PathList({ factory, ptrs: [{ term }, { term }] })

      strictEqual(ptrList.value, term.value)
    })
  })

  describe('.values', () => {
    it('should be an array property', () => {
      const ptrList = new PathList({ dataset: factory.dataset(), factory })

      strictEqual(Array.isArray(ptrList.values), true)
    })

    it('should contain all term values of the ptrs', () => {
      const ptrs = [{ value: ns.ex.start1.value }, { value: ns.ex.start2.value }]
      const ptrList = new PathList({ factory, ptrs })

      const result = ptrList.values

      strictEqual(result.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(result[index], ptrList.ptrs[index].value)
      }
    })

    it('should keep value duplicates', () => {
      const value = ns.ex.start1.value
      const ptrList = new PathList({ factory, ptrs: [{ value }, { value }] })

      const result = ptrList.values

      strictEqual(result.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(result[index], value)
      }
    })

    it('should keep undefined values', () => {
      const ptrList = new PathList({ factory, ptrs: [{}, {}] })

      const result = ptrList.values

      strictEqual(result.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(result[index], undefined)
      }
    })
  })

  describe('.addIn', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.addIn, 'function')
    })

    it('should return itself', () => {
      const { objects, ptrList, predicates } = datasets.addIn()

      const result = ptrList.addIn(predicates, objects)

      strictEqual(result, ptrList)
    })

    it('should add quads for the given predicates and subjects', () => {
      const { expectedQuads, ptrList, predicates, subjects } = datasets.addIn()

      ptrList.addIn(predicates, subjects)

      datasetEqual(ptrList.dataset, expectedQuads)
    })

    it('should add quads for the given predicates, subjects, and graphs', () => {
      const { expectedQuads, ptrList, predicates, subjects } = datasets.addInGraphs()

      ptrList.addIn(predicates, subjects)

      datasetEqual(ptrList.dataset, expectedQuads)
    })

    it('should call the callback function with a path object for the new path', () => {
      const result = []
      const { expectedPtrLists, ptrList, predicates, subjects } = datasets.addInPath()

      ptrList.addIn(predicates, subjects, ptrList => result.push(ptrList))

      grapoiEqual(result, expectedPtrLists)
    })
  })

  describe('.addList', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.addList, 'function')
    })

    it('should return itself', () => {
      const { ptrList, predicates, items } = datasets.addList()

      const result = ptrList.addList(predicates, items)

      strictEqual(result, ptrList)
    })

    it('should create an empty list if an empty item list is given', () => {
      const { expectedQuads, ptrList, predicates, items } = datasets.addListEmpty()

      ptrList.addList(predicates, items)

      datasetEqual(ptrList.dataset, expectedQuads)
    })

    it('should add the given items to the list', () => {
      const { expectedQuads, items, ptrList, predicates } = datasets.addList()

      ptrList.addList(predicates, items)

      datasetEqual(ptrList.dataset, expectedQuads)
    })

    it('should add the given items in the defined graphs to the list', () => {
      const { expectedQuads, items, ptrList, predicates } = datasets.addListGraphs()

      ptrList.addList(predicates, items)

      datasetEqual(ptrList.dataset, expectedQuads)
    })

    it('should throw an error if the ptr is an any ptr', () => {
      const { items, ptrList, predicates } = datasets.any()

      throws(() => {
        ptrList.addList(predicates, items)
      })
    })
  })

  describe('.addOut', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.addOut, 'function')
    })

    it('should return itself', () => {
      const { objects, ptrList, predicates } = datasets.addOut()

      const result = ptrList.addOut(predicates, objects)

      strictEqual(result, ptrList)
    })

    it('should add quads for the given predicates and objects', () => {
      const { expectedQuads, objects, ptrList, predicates } = datasets.addOut()

      ptrList.addOut(predicates, objects)

      datasetEqual(ptrList.dataset, expectedQuads)
    })

    it('should add quads for the given predicates, objects, and graphs', () => {
      const { expectedQuads, objects, ptrList, predicates } = datasets.addOutGraphs()

      ptrList.addOut(predicates, objects)

      datasetEqual(ptrList.dataset, expectedQuads)
    })

    it('should call the callback function with a path object for the new path', () => {
      const result = []
      const { expectedPtrLists, objects, ptrList, predicates } = datasets.addOutPath()

      ptrList.addOut(predicates, objects, ptrList => result.push(ptrList))

      grapoiEqual(result, expectedPtrLists)
    })
  })

  describe('.clone', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.clone, 'function')
    })

    it('should return a new PathList instance', () => {
      const { ptrList } = datasets.default()

      const result = ptrList.clone()

      strictEqual(result instanceof PathList, true)
      notStrictEqual(result, ptrList)
    })

    it('should copy the factory', () => {
      const { ptrList } = datasets.default()

      const result = ptrList.clone()

      strictEqual(result.factory, ptrList.factory)
    })

    it('should copy the ptrs', () => {
      const { ptrList } = datasets.clone()

      const result = ptrList.clone()

      strictEqual(result.ptrs.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(result.ptrs[index], ptrList.ptrs[index])
      }
    })

    it('should use the ptrs given as argument', () => {
      const { expectedPtrList, ptrList, ptrs } = datasets.clonePtrs()

      const result = ptrList.clone({ ptrs })

      grapoiEqual(result, expectedPtrList)
    })
  })

  describe('.deleteIn', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.deleteIn, 'function')
    })

    it('should return itself', () => {
      const { ptrList, predicates } = datasets.deleteIn()

      const result = ptrList.deleteIn(predicates)

      strictEqual(result, ptrList)
    })

    it('should delete the quads matching O->S for all given predicates', () => {
      const { dataset, expectedQuads, ptrList, predicates } = datasets.deleteIn()

      ptrList.deleteIn(predicates)

      datasetEqual(dataset, expectedQuads)
    })

    it('should delete the quads matching O->S for all given predicates and subjects', () => {
      const { dataset, expectedQuads, ptrList, predicates, subjects } = datasets.deleteInSubjects()

      ptrList.deleteIn(predicates, subjects)

      datasetEqual(dataset, expectedQuads)
    })
  })

  describe('.deleteList', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.deleteList, 'function')
    })

    it('should return itself', () => {
      const { ptrList } = datasets.deleteList()

      const result = ptrList.deleteList([null])

      strictEqual(result, ptrList)
    })

    it('should delete all quads related to the list', () => {
      const { dataset, expectedQuads, ptrList, predicates } = datasets.deleteList()

      ptrList.deleteList(predicates)

      datasetEqual(dataset, expectedQuads)
    })
  })

  describe('.deleteOut', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.deleteOut, 'function')
    })

    it('should return itself', () => {
      const { ptrList, predicates } = datasets.deleteOut()

      const result = ptrList.deleteOut(predicates)

      strictEqual(result, ptrList)
    })

    it('should delete the quads matching S->O for all given predicates', () => {
      const { dataset, expectedQuads, ptrList, predicates } = datasets.deleteOut()

      ptrList.deleteOut(predicates)

      datasetEqual(dataset, expectedQuads)
    })

    it('should delete the quads matching S->O for all given predicates and objects', () => {
      const { dataset, expectedQuads, objects, ptrList, predicates } = datasets.deleteOutObjects()

      ptrList.deleteOut(predicates, objects)

      datasetEqual(dataset, expectedQuads)
    })
  })

  describe('.execute', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.execute, 'function')
    })

    it('should return a new PathList instance', () => {
      const { ptrList } = datasets.default()

      const result = ptrList.execute({})

      strictEqual(result instanceof PathList, true)
      notStrictEqual(result, ptrList)
    })

    it('should combine the result of all ptrs', () => {
      const { expectedPtrList, ptrList, predicates } = datasets.execute()

      const result = ptrList.execute({
        quantifier: 'oneOrMore',
        predicates
      })

      grapoiEqual(result, expectedPtrList)
    })
  })

  describe('.executeAll', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.executeAll, 'function')
    })

    it('should execture all given instructions', () => {
      const { instructions, expectedPtrList, ptrList } = datasets.executeAll()

      const result = ptrList.executeAll(instructions)

      grapoiEqual(result, expectedPtrList)
    })
  })

  describe('.filter', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.filter, 'function')
    })

    it('should call the callback function with a PathList, index, and an array of all PathList objects for each ptr', () => {
      const args = []
      const { ptrList } = datasets.filter()

      ptrList.filter((ptrList, index, all) => args.push({ ptrList, index, all }))

      strictEqual(args.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(args[index].ptrList instanceof PathList, true)
        strictEqual(args[index].ptrList.term.equals(ptrList.ptrs[index].term), true)
        strictEqual(args[index].index, index)
        strictEqual(Array.isArray(args[index].all), true)
        strictEqual(args[index].all.length, ptrList.ptrs.length)
      }
    })

    it('should return a new PathList instance', () => {
      const { ptrList } = datasets.default()

      const result = ptrList.filter(() => true)

      strictEqual(result instanceof PathList, true)
      notStrictEqual(result, ptrList)
    })

    it('should return a PathList with all ptrs the callback returned true', () => {
      const { ptrList } = datasets.filter()

      const result = ptrList.filter(ptrList => ptrList.term.equals(ns.ex.start2))

      grapoiEqual(result.ptrs[0], ptrList.ptrs[1])
    })
  })

  describe('.hasIn', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.hasIn, 'function')
    })

    it('should return all nodes matching O->S for all given predicates', () => {
      const { expectedPtrList, ptrList, predicates } = datasets.hasIn()

      const result = ptrList.hasIn(predicates)

      grapoiEqual(result, expectedPtrList)
    })

    it('should return all nodes matching O->S for all given predicates and subjects', () => {
      const { expectedPtrList, ptrList, predicates, subjects } = datasets.hasInSubject()

      const result = ptrList.hasIn(predicates, subjects)

      grapoiEqual(result, expectedPtrList)
    })
  })

  describe('.hasOut', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.hasOut, 'function')
    })

    it('should return all nodes matching S->O for all given predicates', () => {
      const { expectedPtrList, ptrList, predicates } = datasets.hasOut()

      const result = ptrList.hasOut(predicates)

      grapoiEqual(result, expectedPtrList)
    })

    it('should return all nodes matching S->O for all given predicates and subjects', () => {
      const { expectedPtrList, ptrList, predicates, objects } = datasets.hasOutObjects()

      const result = ptrList.hasOut(predicates, objects)

      grapoiEqual(result, expectedPtrList)
    })
  })

  describe('.in', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.in, 'function')
    })

    it('should return all nodes traversing O->S for all given predicates', () => {
      const { expectedPtrList, ptrList, predicates } = datasets.in()

      const result = ptrList.in(predicates)

      grapoiEqual(result, expectedPtrList)
    })

    it('should return all nodes traversing O->S for all given predicates and subjects', () => {
      const { expectedPtrList, ptrList, predicates, subjects } = datasets.inSubjects()

      const result = ptrList.in(predicates, subjects)

      grapoiEqual(result, expectedPtrList)
    })
  })

  describe('.isAny', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.isAny, 'function')
    })

    it('should return false if ptrs is empty', () => {
      const { dataset } = datasets.any()
      const ptrList = new PathList({ dataset, factory, ptrs: [] })

      strictEqual(ptrList.isAny(), false)
    })

    it('should return true if any ptr call to isAny() returns true', () => {
      const ptrs = [{ isAny: () => false }, { isAny: () => true }]
      const ptrList = new PathList({ factory, ptrs })

      strictEqual(ptrList.isAny(), true)
    })

    it('should return false if all ptr calls to isAny() return false', () => {
      const ptrs = [{ isAny: () => false }, { isAny: () => false }]
      const ptrList = new PathList({ factory, ptrs })

      strictEqual(ptrList.isAny(), false)
    })
  })

  describe('.isList', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.isList, 'function')
    })

    it('should return false if ptrs is empty', () => {
      const { ptrList } = datasets.empty()

      strictEqual(ptrList.isList(), false)
    })

    it('should return false if ptrs length is not equal 1', () => {
      const { ptrList } = datasets.default()

      strictEqual(ptrList.isList(), false)
    })

    it('should return false if the ptr call to isList returns false', () => {
      const ptrs = [{ isList: () => false }]
      const ptrList = new PathList({ factory, ptrs })

      strictEqual(ptrList.isList(), false)
    })

    it('should return true if the ptr call to isList returns true', () => {
      const ptrs = [{ isList: () => true }]
      const ptrList = new PathList({ factory, ptrs })

      strictEqual(ptrList.isList(), true)
    })
  })

  describe('.list', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.list, 'function')
    })

    it('should return undefined is the ptr is not a list', () => {
      const { ptrList } = datasets.default()

      strictEqual(ptrList.list(), undefined)
    })

    it('should return an iterator that loops over all items of the list', () => {
      const { items, ptrList } = datasets.list()

      const result = ptrList.list()

      strictEqual(typeof result[Symbol.iterator], 'function')

      const resultItems = [...result]

      strictEqual(resultItems.length, items.length)

      for (let index = 0; index < items.length; index++) {
        strictEqual(resultItems[index] instanceof PathList, true)
        strictEqual(resultItems[index].term.equals(items[index]), true)
      }
    })
  })

  describe('.map', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.map, 'function')
    })

    it('should return an array', () => {
      const { ptrList } = datasets.default()

      const result = ptrList.map(() => false)

      strictEqual(Array.isArray(result), true)
    })

    it('should call the callback function with a PathList, index, and an array of all PathList objects for each ptr', () => {
      const args = []
      const { ptrList } = datasets.map()

      ptrList.map((ptrList, index, all) => args.push({ ptrList, index, all }))

      strictEqual(args.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(args[index].ptrList instanceof PathList, true)
        strictEqual(args[index].ptrList.term.equals(ptrList.ptrs[index].term), true)
        strictEqual(args[index].index, index)
        strictEqual(Array.isArray(args[index].all), true)
        strictEqual(args[index].all.length, ptrList.ptrs.length)
      }
    })

    it('should return an array of return values of the callback function', () => {
      const { ptrList } = datasets.map()

      const result = ptrList.map(ptrList => ptrList.term)

      strictEqual(result.length, ptrList.ptrs.length)

      for (let index = 0; index < ptrList.ptrs.length; index++) {
        strictEqual(result[index].equals(ptrList.ptrs[index].term), true)
      }
    })
  })

  describe('.node', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.node, 'function')
    })

    it('should create a PathList object with the given terms wrapped in Path objects', () => {
      const { ptrList } = datasets.default()
      const terms = [factory.blankNode(), factory.literal('test'), ns.ex.start]

      const result = ptrList.node(terms)

      strictEqual(result instanceof PathList, true)
      strictEqual(result.ptrs.length, terms.length)

      for (let index = 0; index < terms.length; index++) {
        strictEqual(result.ptrs[index] instanceof Path, true)
        strictEqual(result.ptrs[index].term, terms[index])
      }
    })

    it('should create the Path objects with the factory of the PathList object', () => {
      const { ptrList } = datasets.default()
      const terms = [factory.blankNode(), factory.literal('test'), ns.ex.start]

      const result = ptrList.node(terms)

      for (let index = 0; index < terms.length; index++) {
        strictEqual(result.ptrs[index].factory, ptrList.factory)
      }
    })
  })

  describe('.out', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.out, 'function')
    })

    it('should return all nodes traversing S->O for all given predicates', () => {
      const { expectedPtrList, ptrList, predicates } = datasets.out()

      const result = ptrList.out(predicates)

      grapoiEqual(result, expectedPtrList)
    })

    it('should return all nodes traversing S->O for all given predicates and subjects', () => {
      const { expectedPtrList, objects, ptrList, predicates } = datasets.outObjects()

      const result = ptrList.out(predicates, objects)

      grapoiEqual(result, expectedPtrList)
    })
  })

  describe('.quads', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.quads, 'function')
    })

    it('should return an iterator', () => {
      const { ptrList } = datasets.default()

      const result = ptrList.quads()

      strictEqual(typeof result[Symbol.iterator], 'function')
    })

    it('should loop over all quads', () => {
      const { expectedQuads, ptrList } = datasets.quads()

      datasetEqual(ptrList.quads(), expectedQuads)
    })

    it('should return an empty iterator if there are no edges', () => {
      const { ptrList } = datasets.default()

      const result = [...ptrList.quads()]

      strictEqual(result.length, 0)
    })
  })

  describe('.trim', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList.trim, 'function')
    })

    it('should trim the edges from all ptrs and keep only the term', () => {
      const { expectedPtrList, ptrList } = datasets.trim()

      const result = ptrList.trim()

      grapoiEqual(result, expectedPtrList)
    })
  })

  describe('[Symbol.iterator]', () => {
    it('should be a method', () => {
      const { ptrList } = datasets.default()

      strictEqual(typeof ptrList[Symbol.iterator], 'function')
    })

    it('should return an iterator that loops over all ptrs wrapped into a PathList object', () => {
      const { expectedPtrLists, ptrList } = datasets.iterator()

      const result = [...ptrList]

      grapoiEqual(result, expectedPtrLists)
    })
  })
})
