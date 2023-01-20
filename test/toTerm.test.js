import { strictEqual, throws } from 'assert'
import { describe, it } from 'mocha'
import toTerm from '../lib/toTerm.js'
import factory from './support/factory.js'
import * as ns from './support/namespaces.js'

describe('toTerm', () => {
  it('should be a function', () => {
    strictEqual(typeof toTerm, 'function')
  })

  it('should return null if null is given', () => {
    strictEqual(toTerm(null, { factory }), null)
  })

  it('should return undefined if undefined is given', () => {
    strictEqual(toTerm(undefined, { factory }), undefined)
  })

  it('should create a Literal if a string is given', () => {
    strictEqual(factory.literal('test').equals(toTerm('test', { factory })), true)
  })

  it('should create a NamedNode if a URL is given', () => {
    strictEqual(ns.ex.start.equals(toTerm(new URL(ns.ex.start.value), { factory })), true)
  })

  it('should return the given term', () => {
    const term = ns.ex.start

    strictEqual(toTerm(term, { factory }), term)
  })

  it('should return term of a ptr object', () => {
    const ptr = { term: ns.ex.start }

    strictEqual(toTerm(ptr, { factory }), ptr.term)
  })

  it('should return null if the term of a ptr object is null', () => {
    strictEqual(toTerm({ term: null }, { factory }), null)
  })

  it('should throw an error if the object can\'t be converted to a term', () => {
    throws(() => {
      toTerm(/.*/, { factory })
    })
  })
})
