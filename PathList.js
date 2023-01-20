import TermSet from '@rdfjs/term-set'
import ptrIsEqual from './lib/ptrIsEqual.js'
import Path from './Path.js'

function createExtendCallback (ptrList, callback) {
  if (!callback) {
    return () => {}
  }

  return ptr => {
    return callback(new ptrList.constructor({
      factory: ptrList.factory,
      ptrs: [ptr]
    }))
  }
}

class PathList {
  constructor ({ dataset, factory, ptrs, terms, graphs }) {
    this.factory = factory

    if (ptrs) {
      this.ptrs = [...ptrs]
    } else {
      this.ptrs = []

      for (const term of (terms || [null])) {
        for (const graph of (graphs || [null])) {
          this.ptrs.push(new Path({ dataset, factory, graph, term }))
        }
      }
    }
  }

  get dataset () {
    const datasets = new Set(this.datasets)

    if (datasets.size !== 1) {
      return null
    }

    return datasets[Symbol.iterator]().next().value
  }

  get datasets () {
    return this.ptrs.map(ptr => ptr.dataset)
  }

  get term () {
    const terms = new TermSet(this.terms)

    if (terms.size !== 1) {
      return undefined
    }

    return terms[Symbol.iterator]().next().value
  }

  get terms () {
    return this.ptrs.map(ptr => ptr.term)
  }

  get value () {
    const term = this.term

    return (term === undefined || term === null) ? undefined : term.value
  }

  get values () {
    return this.ptrs.map(ptr => ptr.value)
  }

  addIn (predicates, subjects, callback) {
    const extendCallback = createExtendCallback(this, callback)

    for (const ptr of this.ptrs) {
      ptr.addIn(predicates, subjects, extendCallback)
    }

    return this
  }

  addList (predicates, items) {
    if (this.isAny()) {
      throw new Error('can\'t attach a list to an any ptr')
    }

    for (const ptr of this.ptrs) {
      ptr.addList(predicates, items)
    }

    return this
  }

  addOut (predicates, objects, callback) {
    const extendCallback = createExtendCallback(this, callback)

    for (const ptr of this.ptrs) {
      ptr.addOut(predicates, objects, extendCallback)
    }

    return this
  }

  clone (args) {
    return new this.constructor({ factory: this.factory, ptrs: this.ptrs, ...args })
  }

  deleteIn (predicates, subjects) {
    for (const ptr of this.ptrs) {
      ptr.deleteIn(predicates, subjects)
    }

    return this
  }

  deleteList (predicates) {
    for (const ptr of this.ptrs) {
      ptr.deleteList(predicates)
    }

    return this
  }

  deleteOut (predicates, objects) {
    for (const ptr of this.ptrs) {
      ptr.deleteOut(predicates, objects)
    }

    return this
  }

  distinct () {
    const ptrs = this.ptrs.reduce((unique, ptr) => {
      if (!unique.some(uPtr => ptrIsEqual(uPtr, ptr))) {
        unique.push(ptr.trim())
      }

      return unique
    }, [])

    return this.clone({ ptrs })
  }

  execute (instruction) {
    return this.clone({ ptrs: this.ptrs.flatMap(ptr => ptr.execute(instruction)) })
  }

  executeAll (instructions) {
    let output = this

    for (const instruction of instructions) {
      output = output.execute(instruction)
    }

    return output
  }

  filter (callback) {
    return this.clone({ ptrs: [...this].filter(callback).map(ptr => ptr.ptrs[0]) })
  }

  hasIn (predicates, subjects) {
    return this.clone({ ptrs: this.ptrs.flatMap(ptr => ptr.hasIn(predicates, subjects)) })
  }

  hasOut (predicates, objects) {
    return this.clone({ ptrs: this.ptrs.flatMap(ptr => ptr.hasOut(predicates, objects)) })
  }

  in (predicates, subjects) {
    return this.clone({ ptrs: this.ptrs.flatMap(ptr => ptr.in(predicates, subjects)) })
  }

  isAny () {
    return this.ptrs.length > 0 && this.ptrs.some(ptr => ptr.isAny())
  }

  isList () {
    if (this.ptrs.length !== 1) {
      return false
    }

    return this.ptrs[0].isList()
  }

  list () {
    if (!this.isList()) {
      return undefined
    }

    const iterator = this.ptrs[0].list()[Symbol.iterator]()

    const next = () => {
      const { done, value } = iterator.next()

      if (done) {
        return { done: true }
      }

      return { done: false, value: this.clone({ ptrs: [value] }) }
    }

    return {
      [Symbol.iterator]: () => {
        return { next }
      }
    }
  }

  map (callback) {
    return [...this].map(callback)
  }

  node (terms) {
    const ptrs = [...terms].map(term => new Path({ dataset: this.dataset, factory: this.factory, term }))

    return this.clone({ ptrs })
  }

  out (predicates, objects) {
    return this.clone({ ptrs: this.ptrs.flatMap(ptr => ptr.out(predicates, objects)) })
  }

  quads () {
    const pathList = this

    return {
      * [Symbol.iterator] () {
        for (const path of pathList.ptrs) {
          for (const edge of path.edges) {
            yield edge.quad
          }
        }
      }
    }
  }

  trim () {
    return this.clone({
      ptrs: this.ptrs.map(ptr => ptr.trim())
    })
  }

  * [Symbol.iterator] () {
    for (const ptr of this.ptrs) {
      yield this.clone({ ptrs: [ptr] })
    }
  }
}

export default PathList
