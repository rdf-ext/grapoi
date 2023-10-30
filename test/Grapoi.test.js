import { notStrictEqual, strictEqual, throws } from 'assert'
import { describe, it } from 'mocha'
import { datasetEqual } from 'rdf-test/assert.js'
import Grapoi from '../Grapoi.js'
import Path from '../Path.js'
import datasets from './support/datasets.multi.js'
import factory from './support/factory.js'
import { grapoiEqual } from './support/toJSON.js'

describe('Grapoi', () => {
  it('should be a constructor', () => {
    strictEqual(typeof Grapoi, 'function')
  })

  it('should assign the given factory', () => {
    const dataset = factory.dataset()

    const nodeList = new Grapoi({ dataset, factory })

    strictEqual(nodeList.factory, factory)
  })

  it('should use an any Path ptr if no ptrs are given', () => {
    const dataset = factory.dataset()

    const nodeList = new Grapoi({ dataset })

    strictEqual(nodeList.ptrs.length, 1)
    strictEqual(nodeList.ptrs[0] instanceof Path, true)
    strictEqual(nodeList.ptrs[0].term, null)
  })

  it('should use the given ptrs', () => {
    const { ptrs } = datasets.constructorPtrs()

    const grapoi = new Grapoi({ ptrs })

    strictEqual(grapoi.ptrs.length, ptrs.length)

    for (let index = 0; index < ptrs.length; index++) {
      strictEqual(grapoi.ptrs[index], ptrs[index])
    }
  })

  it('should create a Path ptr for the given term', () => {
    const { dataset, terms } = datasets.default()
    const term = terms[0]

    const grapoi = new Grapoi({ dataset, term })

    strictEqual(grapoi.ptrs.length, 1)

    strictEqual(grapoi.ptrs[0] instanceof Path, true)
    strictEqual(grapoi.ptrs[0].term.equals(term), true)
  })

  it('should create a Path ptr for each of the given terms', () => {
    const { dataset, terms } = datasets.default()

    const grapoi = new Grapoi({ dataset, terms })

    strictEqual(grapoi.ptrs.length, terms.length)

    for (let index = 0; index < terms.length; index++) {
      strictEqual(grapoi.ptrs[index] instanceof Path, true)
      strictEqual(grapoi.ptrs[index].term.equals(terms[index]), true)
    }
  })

  it('should create a Path ptr for the given term and graph', () => {
    const { dataset, graphs, terms } = datasets.constructorGraphs()
    const graph = graphs[0]
    const term = terms[0]

    const grapoi = new Grapoi({ dataset, graph, term })

    strictEqual(grapoi.ptrs.length, 1)

    strictEqual(grapoi.ptrs[0].term.equals(term), true)
    strictEqual(grapoi.ptrs[0].graph.equals(graph), true)
  })

  it('should create a Path ptr for each of the given terms and graphs', () => {
    const { dataset, graphs, terms } = datasets.constructorGraphs()

    const grapoi = new Grapoi({ dataset, graphs, terms })

    strictEqual(grapoi.ptrs.length, terms.length * graphs.length)

    for (let index = 0; index < terms.length * graphs.length; index++) {
      strictEqual(grapoi.ptrs[index].term.equals(terms[Math.floor(index / 2)]), true)
      strictEqual(grapoi.ptrs[index].graph.equals(graphs[index % 2]), true)
    }
  })

  it('should create a Path ptr for each of the given terms with the given factory', () => {
    const { dataset, terms } = datasets.default()

    const grapoi = new Grapoi({ dataset, factory, terms })

    strictEqual(grapoi.ptrs.length, terms.length)

    for (let index = 0; index < terms.length; index++) {
      strictEqual(grapoi.ptrs[index].factory, factory)
    }
  })

  it('should prioritize ptrs over terms', () => {
    const { dataset, ptrList, terms } = datasets.constructorPtrsVsTerms()

    const result = new Grapoi({ dataset, factory, ptrs: ptrList.ptrs, terms })

    grapoiEqual(result, ptrList)
  })

  describe('.addIn', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.addIn, 'function')
    })

    it('should return itself', () => {
      const { grapoi, objects, predicates } = datasets.addIn()

      const result = grapoi.addIn(predicates, objects)

      strictEqual(result, grapoi)
    })

    it('should add quads for the given predicates and blank node if no subject is given', () => {
      const { expectedQuads, grapoi, predicates } = datasets.addInNoSubject()

      grapoi.addIn(predicates)

      datasetEqual(grapoi.dataset, expectedQuads)
    })

    it('should add quads for the given predicates and subjects', () => {
      const { expectedQuads, grapoi, predicates, subjects } = datasets.addIn()

      grapoi.addIn(predicates, subjects)

      datasetEqual(grapoi.dataset, expectedQuads)
    })

    it('should add quads for the given predicates, subjects, and graphs', () => {
      const { expectedQuads, grapoi, predicates, subjects } = datasets.addInGraphs()

      grapoi.addIn(predicates, subjects)

      datasetEqual(grapoi.dataset, expectedQuads)
    })

    it('should call the callback function with a grapoi object for the new path', () => {
      const result = []
      const { expectedGrapois, grapoi, predicates, subjects } = datasets.addInPath()

      grapoi.addIn(predicates, subjects, item => result.push(item))

      grapoiEqual(result, expectedGrapois)
    })

    it('should call the callback function as second argument with a grapoi object for the new path', () => {
      const result = []
      const { expectedGrapois, grapoi, predicates } = datasets.addInNoSubject()

      grapoi.addIn(predicates, item => result.push(item))

      grapoiEqual(result, expectedGrapois)
    })
  })

  describe('.addList', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.addList, 'function')
    })

    it('should return itself', () => {
      const { grapoi, predicates, items } = datasets.addList()

      const result = grapoi.addList(predicates, items)

      strictEqual(result, grapoi)
    })

    it('should create an empty list if an empty item list is given', () => {
      const { expectedQuads, grapoi, predicates, items } = datasets.addListEmpty()

      grapoi.addList(predicates, items)

      datasetEqual(grapoi.dataset, expectedQuads)
    })

    it('should add the given items to the list', () => {
      const { expectedQuads, items, grapoi, predicates } = datasets.addList()

      grapoi.addList(predicates, items)

      datasetEqual(grapoi.dataset, expectedQuads)
    })

    it('should add the given items in the defined graphs to the list', () => {
      const { expectedQuads, items, grapoi, predicates } = datasets.addListGraphs()

      grapoi.addList(predicates, items)

      datasetEqual(grapoi.dataset, expectedQuads)
    })

    it('should throw an error if the ptr is an any ptr', () => {
      const { items, grapoi, predicates } = datasets.any()

      throws(() => {
        grapoi.addList(predicates, items)
      })
    })
  })

  describe('.addOut', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.addOut, 'function')
    })

    it('should return itself', () => {
      const { objects, grapoi, predicates } = datasets.addOut()

      const result = grapoi.addOut(predicates, objects)

      strictEqual(result, grapoi)
    })

    it('should add quads for the given predicates and objects', () => {
      const { expectedQuads, objects, grapoi, predicates } = datasets.addOut()

      grapoi.addOut(predicates, objects)

      datasetEqual(grapoi.dataset, expectedQuads)
    })

    it('should add quads for the given predicates and blank node if no object is given', () => {
      const { expectedQuads, grapoi, predicates } = datasets.addOutNoObject()

      grapoi.addOut(predicates)

      datasetEqual(grapoi.dataset, expectedQuads)
    })

    it('should add quads for the given predicates, objects, and graphs', () => {
      const { expectedQuads, objects, grapoi, predicates } = datasets.addOutGraphs()

      grapoi.addOut(predicates, objects)

      datasetEqual(grapoi.dataset, expectedQuads)
    })

    it('should call the callback function with a path object for the new path', () => {
      const result = []
      const { expectedGrapois, objects, grapoi, predicates } = datasets.addOutPath()

      grapoi.addOut(predicates, objects, item => result.push(item))

      grapoiEqual(result, expectedGrapois)
    })

    it('should call the callback function as second argument with a grapoi object for the new path', () => {
      const result = []
      const { expectedGrapois, grapoi, predicates } = datasets.addOutNoObject()

      grapoi.addOut(predicates, item => result.push(item))

      grapoiEqual(result, expectedGrapois)
    })
  })

  describe('.base', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.base, 'function')
    })

    it('should throw an error if no base is given', () => {
      const { grapoi } = datasets.default()

      throws(() => {
        grapoi.base()
      }, {
        message: 'base parameter is required'
      })
    })

    it('should return a new Grapoi object', () => {
      const { expectedTerm, grapoi } = datasets.base()

      const result = grapoi.base(expectedTerm)

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })

    it('should base the dateset', () => {
      const { expectedGrapoi, expectedTerm, grapoi } = datasets.base()

      const result = grapoi.base(expectedTerm)

      grapoiEqual(result, expectedGrapoi)
      datasetEqual(result.dataset, expectedGrapoi.dataset)
    })

    it('should support base argument given as ptr', () => {
      const { expectedGrapoi, grapoi } = datasets.base()

      const result = grapoi.base(expectedGrapoi)

      grapoiEqual(result, expectedGrapoi)
      datasetEqual(result.dataset, expectedGrapoi.dataset)
    })
  })

  describe('.best', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.best, 'function')
    })

    it('should return a new Grapoi instance', () => {
      const { grapoi } = datasets.best()

      const result = grapoi.best(obj => {
        return obj.ptrs.map(ptr => {
          return {
            dataset: ptr.dataset,
            score: parseInt(ptr.term.value.match(/(\d+)/)[1]),
            term: ptr.term
          }
        })
      })

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })

    it('should contain a single Path for the ptr with the highest score', () => {
      const { expectedGrapoi, grapoi } = datasets.best()

      const result = grapoi.best(obj => {
        return obj.ptrs.map(ptr => {
          return {
            dataset: ptr.dataset,
            score: parseInt(ptr.term.value.match(/(\d+)/)[1]),
            term: ptr.term
          }
        })
      })

      grapoiEqual(result, expectedGrapoi)
    })
  })

  describe('.deleteIn', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.deleteIn, 'function')
    })

    it('should return itself', () => {
      const { grapoi, predicates } = datasets.deleteIn()

      const result = grapoi.deleteIn(predicates)

      strictEqual(result, grapoi)
    })

    it('should delete the quads matching O->S for all given predicates', () => {
      const { dataset, expectedQuads, grapoi, predicates } = datasets.deleteIn()

      grapoi.deleteIn(predicates)

      datasetEqual(dataset, expectedQuads)
    })

    it('should delete the quads matching O->S for all given predicates and subjects', () => {
      const { dataset, expectedQuads, grapoi, predicates, subjects } = datasets.deleteInSubjects()

      grapoi.deleteIn(predicates, subjects)

      datasetEqual(dataset, expectedQuads)
    })
  })

  describe('.deleteList', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.deleteList, 'function')
    })

    it('should return itself', () => {
      const { grapoi } = datasets.deleteList()

      const result = grapoi.deleteList([null])

      strictEqual(result, grapoi)
    })

    it('should delete all quads related to the list', () => {
      const { dataset, expectedQuads, grapoi, predicates } = datasets.deleteList()

      grapoi.deleteList(predicates)

      datasetEqual(dataset, expectedQuads)
    })
  })

  describe('.deleteOut', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.deleteOut, 'function')
    })

    it('should return itself', () => {
      const { grapoi, predicates } = datasets.deleteOut()

      const result = grapoi.deleteOut(predicates)

      strictEqual(result, grapoi)
    })

    it('should delete the quads matching S->O for all given predicates', () => {
      const { dataset, expectedQuads, grapoi, predicates } = datasets.deleteOut()

      grapoi.deleteOut(predicates)

      datasetEqual(dataset, expectedQuads)
    })

    it('should delete the quads matching S->O for all given predicates and objects', () => {
      const { dataset, expectedQuads, objects, grapoi, predicates } = datasets.deleteOutObjects()

      grapoi.deleteOut(predicates, objects)

      datasetEqual(dataset, expectedQuads)
    })
  })

  describe('.execute', () => {
    it('should return a new Grapoi instance', () => {
      const { grapoi } = datasets.default()

      const result = grapoi.execute({})

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })
  })

  describe('.executeAll', () => {
    it('should return a new Grapoi instance', () => {
      const { instructions, grapoi } = datasets.executeAll()

      const result = grapoi.executeAll(instructions)

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })
  })

  describe('.filter', () => {
    it('should return a new Grapoi instance', () => {
      const { grapoi } = datasets.default()

      const result = grapoi.filter(() => true)

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })
  })

  describe('.hasIn', () => {
    it('should return a new Grapoi instance', () => {
      const { grapoi } = datasets.default()

      const result = grapoi.hasIn()

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })
  })

  describe('.hasOut', () => {
    it('should return a new Grapoi instance', () => {
      const { grapoi } = datasets.default()

      const result = grapoi.hasOut()

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })
  })

  describe('.in', () => {
    it('should return a new Grapoi instance', () => {
      const { grapoi } = datasets.default()

      const result = grapoi.in()

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })
  })

  describe('.list', () => {
    it('should return an iterator that loops over all items of the list', () => {
      const { items, grapoi } = datasets.list()

      const result = grapoi.list()

      strictEqual(typeof result[Symbol.iterator], 'function')

      const resultItems = [...result]

      strictEqual(resultItems.length, items.length)

      for (let index = 0; index < items.length; index++) {
        strictEqual(resultItems[index] instanceof Grapoi, true)
        strictEqual(resultItems[index].term.equals(items[index]), true)
      }
    })
  })

  describe('.node', () => {
    it('should return a new Grapoi instance', () => {
      const { grapoi } = datasets.default()

      const result = grapoi.node()

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })
  })

  describe('.rebase', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.rebase, 'function')
    })

    it('should throw an error if no base is given', () => {
      const { grapoi } = datasets.default()

      throws(() => {
        grapoi.rebase()
      }, {
        message: 'base parameter is required'
      })
    })

    it('should return a new Grapoi object', () => {
      const { expectedTerm, grapoi } = datasets.rebase()

      const result = grapoi.rebase(expectedTerm)

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })

    it('should rebase the dateset', () => {
      const { expectedGrapoi, expectedTerm, grapoi } = datasets.rebase()

      const result = grapoi.rebase(expectedTerm)

      grapoiEqual(result, expectedGrapoi)
      datasetEqual(result.dataset, expectedGrapoi.dataset)
    })

    it('should support base argument given as ptr', () => {
      const { expectedGrapoi, grapoi } = datasets.rebase()

      const result = grapoi.rebase(expectedGrapoi)

      grapoiEqual(result, expectedGrapoi)
      datasetEqual(result.dataset, expectedGrapoi.dataset)
    })
  })

  describe('.replace', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.replace, 'function')
    })

    it('should throw an error if no base is given', () => {
      const { grapoi } = datasets.default()

      throws(() => {
        grapoi.replace()
      }, {
        message: 'replacement parameter is required'
      })
    })

    it('should return a new Grapoi object', () => {
      const { expectedTerm, grapoi } = datasets.replace()

      const result = grapoi.replace(expectedTerm)

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })

    it('should replace the given term in the dateset', () => {
      const { expectedGrapoi, expectedTerm, grapoi } = datasets.replace()

      const result = grapoi.replace(expectedTerm)

      grapoiEqual(result, expectedGrapoi)
      datasetEqual(result.dataset, expectedGrapoi.dataset)
    })

    it('should support replacement argument given as ptr', () => {
      const { expectedGrapoi, grapoi } = datasets.replace()

      const result = grapoi.replace(expectedGrapoi)

      grapoiEqual(result, expectedGrapoi)
      datasetEqual(result.dataset, expectedGrapoi.dataset)
    })
  })

  describe('.out', () => {
    it('should return a new Grapoi instance', () => {
      const { grapoi } = datasets.default()

      const result = grapoi.out()

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })
  })

  describe('.score', () => {
    it('should be a method', () => {
      const { grapoi } = datasets.default()

      strictEqual(typeof grapoi.score, 'function')
    })

    it('should return a new Grapoi instance', () => {
      const { grapoi } = datasets.score()

      const result = grapoi.score(obj => {
        return obj.ptrs.map(ptr => {
          return {
            dataset: ptr.dataset,
            score: parseInt(ptr.term.value.match(/(\d+)/)[1]),
            term: ptr.term
          }
        })
      })

      strictEqual(result instanceof Grapoi, true)
      notStrictEqual(result, grapoi)
    })

    it('should contain a Paths sorted by score', () => {
      const { expectedGrapoi, grapoi } = datasets.score()

      const result = grapoi.score(obj => {
        return obj.ptrs.map(ptr => {
          return {
            dataset: ptr.dataset,
            score: parseInt(ptr.term.value.match(/(\d+)/)[1]),
            term: ptr.term
          }
        })
      })

      grapoiEqual(result, expectedGrapoi)
    })
  })

  describe('[Symbol.iterator]', () => {
    it('should return an iterator that loops over all ptrs wrapped into a Grapoi object', () => {
      const { expectedGrapois, grapoi } = datasets.iterator()

      const result = [...grapoi]

      for (const item of result) {
        strictEqual(item instanceof Grapoi, true)
      }

      grapoiEqual(result, expectedGrapois)
    })
  })
})
