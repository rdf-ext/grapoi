import { deepStrictEqual, strictEqual, throws } from 'assert'
import { describe, it } from 'mocha'
import toTermArray from '../lib/toTermArray.js'
import factory from './support/factory.js'
import * as ns from './support/namespaces.js'

describe('toTermArray', () => {
  it('should be a function', () => {
    strictEqual(typeof toTermArray, 'function')
  })

  it('should wrap the given Term into an Array', () => {
    const term = ns.ex.start

    const result = toTermArray(term, { factory })

    deepStrictEqual(result, [term])
  })

  it('should use the Term of the given ptr and wrap it into an Array', () => {
    const ptr = { term: ns.ex.start }

    const result = toTermArray(ptr, { factory })

    deepStrictEqual(result, [ptr.term])
  })

  it('should convert the given string to a Literal and wrap it into an Array', () => {
    const term = factory.literal('test')

    const result = toTermArray(term.value, { factory })

    deepStrictEqual(result, [term])
  })

  it('should forward the Terms given in an array', () => {
    const terms = [ns.ex.start1, ns.ex.start2]

    const result = toTermArray(terms, { factory })

    deepStrictEqual(result, terms)
  })

  it('should forward the Terms given in a set', () => {
    const terms = [ns.ex.start1, ns.ex.start2]

    const result = toTermArray(new Set(terms), { factory })

    deepStrictEqual(result, terms)
  })

  it('should use the Terms of the ptrs given as an array', () => {
    const ptrs = [{ term: ns.ex.start1 }, { term: ns.ex.start2 }]

    const result = toTermArray(ptrs, { factory })

    deepStrictEqual(result, [ptrs[0].term, ptrs[1].term])
  })

  it('should throw an error if the value can\'t be converted', () => {
    throws(() => {
      toTermArray(/.*/, { factory })
    })
  })

  it('should throw an error if a value can\'t be converted', () => {
    throws(() => {
      toTermArray([/.*/], { factory })
    })
  })
})
