import { strictEqual, throws } from 'assert'
import { describe, it } from 'mocha'
import toPath from '../lib/toPath.js'
import Path from '../Path.js'
import factory from './support/factory.js'
import * as ns from './support/namespaces.js'
import { grapoiEqual } from './support/toJSON.js'

describe('toPath', () => {
  it('should be a function', () => {
    strictEqual(typeof toPath, 'function')
  })

  it('should return null if null is given', () => {
    strictEqual(toPath(null, {}), null)
  })

  it('should return undefined if undefined is given', () => {
    strictEqual(toPath(undefined, {}), undefined)
  })

  it('should create a Path with a Literal term if a string is given', () => {
    const dataset = factory.dataset()
    const ptr = new Path({ dataset, factory, term: factory.literal('test') })

    const result = toPath('test', { dataset, factory })

    grapoiEqual(result, ptr)
  })

  it('should create a Path with a NamedNode term if a URL is given', () => {
    const dataset = factory.dataset()
    const ptr = new Path({ dataset, factory, term: ns.ex.start })

    const result = toPath(new URL(ns.ex.start.value), { dataset, factory })

    grapoiEqual(result, ptr)
  })

  it('should wrap the given Term into a Path object', () => {
    const dataset = factory.dataset()
    const term = ns.ex.start
    const ptr = new Path({ dataset, factory, term })

    const result = toPath(term, { dataset, factory })

    grapoiEqual(result, ptr)
  })

  it('should forward the given Path object', () => {
    const dataset = factory.dataset()
    const ptr = new Path({ dataset, factory, term: ns.ex.start })

    const result = toPath(ptr, { dataset, factory })

    strictEqual(result, ptr)
  })

  it('should wrap the given ptr into a Path object', () => {
    const dataset = factory.dataset()
    const ptr = new Path({ dataset, factory, term: ns.ex.start })

    const result = toPath({ dataset, term: ptr.term }, { dataset, factory })

    grapoiEqual(result, ptr)
  })

  it('should handle any ptrs', () => {
    const dataset = factory.dataset()
    const ptr = new Path({ dataset, factory, term: null })

    const result = toPath({ dataset, term: ptr.term }, { dataset, factory })

    grapoiEqual(result, ptr)
  })

  it('should throw an error if the object can\'t be converted to a Path', () => {
    throws(() => {
      toPath(/.*/)
    })
  })
})
