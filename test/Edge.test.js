import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import Edge from '../Edge.js'
import factory from './support/factory.js'
import * as ns from './support/namespaces.js'

describe('Edge', () => {
  it('should be a constructor', () => {
    strictEqual(typeof Edge, 'function')
  })

  it('should assign the given dataset to .dataset', () => {
    const dataset = factory.dataset()
    const edge = new Edge({ dataset })

    strictEqual(edge.dataset, dataset)
  })

  it('should assign the given end to .end', () => {
    const end = 'subject'
    const edge = new Edge({ end })

    strictEqual(edge.end, end)
  })

  it('should assign the given quad to .quad', () => {
    const quad = factory.quad(ns.ex.subject, ns.ex.predicate, ns.ex.object)
    const edge = new Edge({ quad })

    strictEqual(edge.quad, quad)
  })

  it('should assign the given end to .start', () => {
    const start = 'subject'
    const edge = new Edge({ start })

    strictEqual(edge.start, start)
  })

  describe('.term', () => {
    it('should be the term at the end position of the given quad', () => {
      const quad = factory.quad(ns.ex.subject, ns.ex.predicate, ns.ex.object)
      const edge = new Edge({ end: 'object', quad })

      strictEqual(ns.ex.object.equals(edge.term), true)
    })
  })

  describe('.graph', () => {
    it('should be the graph term of the given quad', () => {
      const quad = factory.quad(ns.ex.subject, ns.ex.predicate, ns.ex.object, ns.ex.graph)
      const edge = new Edge({ quad })

      strictEqual(ns.ex.graph.equals(edge.graph), true)
    })
  })

  describe('.startTerm', () => {
    it('should be the term at the start position of the given quad', () => {
      const quad = factory.quad(ns.ex.subject, ns.ex.predicate, ns.ex.object)
      const edge = new Edge({ quad, start: 'subject' })

      strictEqual(ns.ex.subject.equals(edge.startTerm), true)
    })
  })
})
