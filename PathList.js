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

/**
 * List of paths
 * @property {Array} ptrs All paths of this list
 */
class PathList {
  /**
   * Create a new instance
   * @param {DatasetCore} dataset Dataset for the pointers
   * @param {Environment} factory Factory for new quads
   * @param {Path[]} ptrs Use existing pointers
   * @param {Term[]} terms Terms for the pointers
   * @param {Term[]} graphs Graphs for the pointers
   */
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

  /**
   * Dataset of the pointer or null if there is no unique dataset.
   * @returns {DatasetCore|null} Unique dataset or null
   */
  get dataset () {
    const datasets = new Set(this.datasets)

    if (datasets.size !== 1) {
      return null
    }

    return datasets[Symbol.iterator]().next().value
  }

  /**
   * An array of all datasets of all pointers.
   * @returns {DatasetCore[]} Array of datasets.
   */
  get datasets () {
    return this.ptrs.map(ptr => ptr.dataset)
  }

  /**
   * The term of the pointers if all pointers refer to a unique term.
   * @returns {Term|undefined} Term of undefined
   */
  get term () {
    const terms = new TermSet(this.terms)

    if (terms.size !== 1) {
      return undefined
    }

    return terms[Symbol.iterator]().next().value
  }

  /**
   * An array of all terms of all pointers.
   * @returns {Term[]} Array of all terms
   */
  get terms () {
    return this.ptrs.map(ptr => ptr.term)
  }

  /**
   * The value of the pointers if all pointers refer to a unique term.
   * @returns {String|undefined} Value or undefined
   */
  get value () {
    const term = this.term

    return (term === undefined || term === null) ? undefined : term.value
  }

  /**
   * An array of all values of all pointers.
   * @returns {String[]} Array of all values
   */
  get values () {
    return this.ptrs.map(ptr => ptr.value)
  }

  /**
   * Add quads with the current terms as the object
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @param {function} [callback] Function called for each subject as a pointer argument
   * @returns {PathList} this
   */
  addIn (predicates, subjects, callback) {
    const extendCallback = createExtendCallback(this, callback)

    for (const ptr of this.ptrs) {
      ptr.addIn(predicates, subjects, extendCallback)
    }

    return this
  }

  /**
   * Add lists with the given items
   * @param {Term[]} predicates Predicates of the lists
   * @param {Term[]} items List items
   * @returns {PathList} this
   */
  addList (predicates, items) {
    if (this.isAny()) {
      throw new Error('can\'t attach a list to an any ptr')
    }

    for (const ptr of this.ptrs) {
      ptr.addList(predicates, items)
    }

    return this
  }

  /**
   * Add quads with the current terms as the subject
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @param {function} [callback] Function called for each subject as a pointer argument
   * @returns {PathList} this
   */
  addOut (predicates, objects, callback) {
    const extendCallback = createExtendCallback(this, callback)

    for (const ptr of this.ptrs) {
      ptr.addOut(predicates, objects, extendCallback)
    }

    return this
  }

  /**
   * Create a new instance of the Constructor with a cloned list of pointers.
   * @param args Additional arguments for the constructor
   * @returns {Constructor} Cloned instance
   */
  clone (args) {
    return new this.constructor({ factory: this.factory, ptrs: this.ptrs, ...args })
  }

  /**
   * Delete quads with the current terms as the object.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @returns {PathList} this
   */
  deleteIn (predicates, subjects) {
    for (const ptr of this.ptrs) {
      ptr.deleteIn(predicates, subjects)
    }

    return this
  }

  /**
   * Delete lists.
   * @param {Term[]} predicates Predicates of the lists
   * @returns {PathList} this
   */
  deleteList (predicates) {
    for (const ptr of this.ptrs) {
      ptr.deleteList(predicates)
    }

    return this
  }

  /**
   * Delete quads with the current terms as the subject.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @returns {PathList} this
   */
  deleteOut (predicates, objects) {
    for (const ptr of this.ptrs) {
      ptr.deleteOut(predicates, objects)
    }

    return this
  }

  /**
   * Create a new instance with a unique set of pointers.
   * The path of the pointers is trimmed.
   * @returns {Constructor} Instance with unique pointers
   */
  distinct () {
    const ptrs = this.ptrs.reduce((unique, ptr) => {
      if (!unique.some(uPtr => ptrIsEqual(uPtr, ptr))) {
        unique.push(ptr.trim())
      }

      return unique
    }, [])

    return this.clone({ ptrs })
  }

  /**
   * Executes a single instruction.
   * @param instruction The instruction to execute
   * @returns {Constructor} Instance with the result pointers.
   */
  execute (instruction) {
    return this.clone({ ptrs: this.ptrs.flatMap(ptr => ptr.execute(instruction)) })
  }

  /**
   * Executes an array of instructions.
   * @param instruction The instructions to execute
   * @returns {Constructor} Instance with the result pointers.
   */
  executeAll (instructions) {
    let output = this

    for (const instruction of instructions) {
      output = output.execute(instruction)
    }

    return output
  }

  /**
   * Filter the pointers based on the result of the given callback function.
   * @param callback
   * @returns {Constructor} Instance with the filtered pointers.
   */
  filter (callback) {
    return this.clone({ ptrs: [...this].filter(callback).map(ptr => ptr.ptrs[0]) })
  }

  /**
   * Filter the pointers based on matching quad(s) with the current terms as the object.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @returns {Constructor} Instance that contains only the filtered pointers
   */
  hasIn (predicates, subjects) {
    return this.clone({ ptrs: this.ptrs.flatMap(ptr => ptr.hasIn(predicates, subjects)) })
  }

  /**
   * Filter the pointers based on matching quad(s) with the current terms as the subject.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @returns {Constructor} Instance that contains only the filtered pointers
   */
  hasOut (predicates, objects) {
    return this.clone({ ptrs: this.ptrs.flatMap(ptr => ptr.hasOut(predicates, objects)) })
  }

  /**
   * Traverse the graph with the current terms as the object.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @returns {Constructor} Instance with pointers of the traversed target terms
   */
  in (predicates, subjects) {
    return this.clone({ ptrs: this.ptrs.flatMap(ptr => ptr.in(predicates, subjects)) })
  }

  /**
   * Check if any pointer is an any-pointer.
   * @returns {boolean} True if any any-pointer was found
   */
  isAny () {
    return this.ptrs.length > 0 && this.ptrs.some(ptr => ptr.isAny())
  }

  /**
   * Check if there is only one pointer and whether that pointer is a list.
   * @returns {boolean} True if the pointer is a list
   */
  isList () {
    if (this.ptrs.length !== 1) {
      return false
    }

    return this.ptrs[0].isList()
  }

  /**
   * Create an iterator for the list if the instance is a list; otherwise, return undefined.
   * @returns {Iterator<Constructor>|undefined} Iterator or undefined
   */
  list () {
    if (!this.isList()) {
      return undefined
    }

    const iterator = this.ptrs[0].list()

    return (function* () {
      for (const ptr of iterator) {
        yield this.clone({ ptrs: [ptr] })
      }
    })();
  }

  /**
   * Map each pointer using the given callback function.
   * @param callback
   * @returns {Array} Array of mapped results
   */
  map (callback) {
    return [...this].map(callback)
  }

  /**
   * Create a new instance with pointers using the given terms.
   * @param terms Array of terms for the pointers
   * @returns {Constructor} Instance with pointers of the given terms
   */
  node (terms) {
    const dataset = this.dataset
    const ptrs = [...terms].map(term => new Path({ dataset, factory: this.factory, term }))

    return this.clone({ ptrs })
  }

  /**
   * Traverse the graph with the current terms as the subject.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @returns {Constructor} Instance with pointers of the traversed target terms
   */
  out (predicates, objects) {
    return this.clone({ ptrs: this.ptrs.flatMap(ptr => ptr.out(predicates, objects)) })
  }

  /**
   * Create an iterator of all quads of all pointer paths.
   * @returns {Iterator<Quad>} Iterator for the quads
   */
  *quads () {
    for (const path of this.ptrs) {
      for (const edge of path.edges) {
        yield edge.quad
      }
    }
  }

  /**
   * Trim the path of all pointers and create a new instance for the result.
   * @returns {Constructor} Instance of the trimmed pointers
   */
  trim () {
    return this.clone({
      ptrs: this.ptrs.map(ptr => ptr.trim())
    })
  }

  /**
   * Iterator for each pointer wrapped into a new instance.
   * @returns {Iterator<Constructor>}} Iterator for the wrapped pointers
   */
  * [Symbol.iterator] () {
    for (const ptr of this.ptrs) {
      yield this.clone({ ptrs: [ptr] })
    }
  }
}

export default PathList
