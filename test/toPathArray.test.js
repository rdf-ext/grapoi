import { strictEqual, throws } from 'assert'
import { describe, it } from 'mocha'
import toPathArray from '../lib/toPathArray.js'
import Path from '../Path.js'
import factory from './support/factory.js'
import * as ns from './support/namespaces.js'
import { grapoiEqual } from './support/toJSON.js'

describe('toPathArray', () => {
  it('should be a function', () => {
    strictEqual(typeof toPathArray, 'function')
  })

  it('should wrap a single Path into an array', () => {
    const dataset = factory.dataset()
    const ptr = new Path({ dataset, factory, term: ns.ex.start })

    const result = toPathArray(ptr, {})

    grapoiEqual(result, [ptr])
  })

  it('should wrap a single Term into an Path array', () => {
    const dataset = factory.dataset()
    const ptr = new Path({ dataset, factory, term: ns.ex.start })

    const result = toPathArray(ptr.term, { dataset, factory })

    grapoiEqual(result, [ptr])
  })

  it('should forward Paths into a new Path array', () => {
    const dataset = factory.dataset()
    const ptr1 = new Path({ dataset, factory, term: ns.ex.start1 })
    const ptr2 = new Path({ dataset, factory, term: ns.ex.start2 })

    const result = toPathArray([ptr1, ptr2], { dataset, factory })

    strictEqual(Array.isArray(result), true)
    strictEqual(result.length, 2)
    strictEqual(result[0], ptr1)
    strictEqual(result[1], ptr2)
  })

  it('should handle Sets', () => {
    const dataset = factory.dataset()
    const ptr1 = new Path({ dataset, factory, term: ns.ex.start1 })
    const ptr2 = new Path({ dataset, factory, term: ns.ex.start2 })

    const result = toPathArray(new Set([ptr1, ptr2]), { dataset, factory })

    grapoiEqual(result, [ptr1, ptr2])
  })

  it('should wrap Terms given in an array into a Path array', () => {
    const dataset = factory.dataset()
    const ptr1 = new Path({ dataset, factory, term: ns.ex.start1 })
    const ptr2 = new Path({ dataset, factory, term: ns.ex.start2 })

    const result = toPathArray([ptr1.term, ptr2.term], { dataset, factory })

    grapoiEqual(result, [ptr1, ptr2])
  })

  it('should throw an error if the value can\'t be converted', () => {
    throws(() => {
      toPathArray(/.*/, {})
    })
  })

  it('should throw an error if a value can\'t be converted', () => {
    throws(() => {
      toPathArray([/.*/], {})
    })
  })
})
