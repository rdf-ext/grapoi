import Edge from './Edge.js'
import * as ns from './lib/namespaces.js'

class Processor {
  static add ({ ptr, start, end, subjects = [null], predicates = [null], objects = [null], graphs, callback } = {}) {
    if (!ptr.factory) {
      throw new Error('add operation requires a factory')
    }

    let edgeCallback = () => {}

    if (callback) {
      edgeCallback = quad => {
        callback(new Edge({ dataset: ptr.dataset, start, end, quad }))
      }
    }

    for (const subject of subjects) {
      for (const predicate of predicates) {
        for (const object of objects) {
          for (const graph of graphs) {
            const pattern = { subject, predicate, object, graph }

            pattern[start] = ptr.term

            const quad = ptr.factory.quad(
              pattern.subject,
              pattern.predicate,
              pattern.object,
              pattern.graph
            )

            ptr.dataset.add(quad)

            edgeCallback(quad)
          }
        }
      }
    }

    return ptr
  }

  static addList ({ ptr, predicates, items, graphs }) {
    if (ptr.isAny()) {
      throw new Error('can\'t attach a list to an any ptr')
    }

    for (const predicate of predicates) {
      for (const graph of graphs) {
        const nodes = items.map(() => ptr.factory.blankNode())

        ptr.dataset.add(ptr.factory.quad(ptr.term, predicate, nodes[0] || ns.rdf.nil, graph))

        for (let index = 0; index < nodes.length; index++) {
          ptr.dataset.add(ptr.factory.quad(nodes[index], ns.rdf.first, items[index], graph))
          ptr.dataset.add(ptr.factory.quad(nodes[index], ns.rdf.rest, nodes[index + 1] || ns.rdf.nil, graph))
        }
      }
    }

    return ptr
  }

  static delete ({
    ptr,
    start,
    subjects = [null],
    predicates = [null],
    objects = [null]
  }) {
    for (const subject of subjects) {
      for (const predicate of predicates) {
        for (const object of objects) {
          const pattern = { subject, predicate, object }

          pattern[start] = ptr.term

          const matches = ptr.dataset.match(pattern.subject, pattern.predicate, pattern.object)

          for (const quad of matches) {
            ptr.dataset.delete(quad)
          }
        }
      }
    }

    return ptr
  }

  static deleteList ({ ptr, predicates }) {
    const toDelete = []

    for (const predicate of predicates) {
      for (const quad of ptr.dataset.match(ptr.term, predicate)) {
        let link = quad.object

        toDelete.push(quad)

        while (!ns.rdf.nil.equals(link)) {
          link = toDelete[toDelete.length - 1].object

          const matches = ptr.dataset.match(link)

          if (matches.size === 0) {
            break
          }

          for (const quad of matches) {
            toDelete.push(quad)
          }
        }
      }
    }

    for (const quad of toDelete) {
      ptr.dataset.delete(quad)
    }

    return ptr
  }

  static execute ({
    ptr,
    operation = 'traverse',
    quantifier,
    start,
    end,
    subjects,
    predicates,
    objects,
    graphs,
    items,
    callback
  } = {}) {
    if (operation === 'add') {
      return Processor.add({ ptr, start, end, subjects, predicates, objects, graphs, callback })
    }

    if (operation === 'addList') {
      return Processor.addList({ ptr, predicates, items, graphs })
    }

    if (operation === 'delete') {
      return Processor.delete({ ptr, start, subjects, predicates, objects })
    }

    if (operation === 'deleteList') {
      return Processor.deleteList({ ptr, predicates })
    }

    if (operation === 'isList') {
      return Processor.isList({ ptr })
    }

    if (operation === 'list') {
      return Processor.list({ ptr })
    }

    if (operation === 'traverse') {
      return Processor.traverse({ ptr, quantifier, start, end, subjects, predicates, objects, graphs })
    }

    throw new Error(`unknown operation ${operation}`)
  }

  static isList ({ ptr }) {
    // only test if there is a term
    if (ptr.isAny()) {
      return false
    }

    // test if it's an empty list
    if (ns.rdf.nil.equals(ptr.term)) {
      return true
    }

    // test if there is a linked item
    const item = Processor.traverse({ ptr, predicates: [ns.rdf.first] })

    if (item.length === 1) {
      return true
    }

    return false
  }

  static list ({ ptr }) {
    if (!ptr.isList()) {
      return undefined
    }

    return {
      * [Symbol.iterator] () {
        while (ptr && !ptr.term.equals(ns.rdf.nil)) {
          const value = ptr.out([ns.rdf.first])

          if (value.length !== 1) {
            throw new Error(`Invalid list: rdf:first count not equals one on ${ptr.value}`)
          }

          const rest = ptr.out([ns.rdf.rest])

          if (rest.length !== 1) {
            throw new Error(`Invalid list: rdf:rest count not equals one on ${ptr.value}`)
          }

          yield value[0]

          ptr = rest[0]
        }
      }
    }
  }

  static traverse ({
    ptr,
    quantifier = 'one',
    start = 'subject',
    end = 'object',
    subjects = [null],
    predicates = [null],
    objects = [null],
    graphs = [null],
    callback
  }) {
    if (quantifier === 'one') {
      return Processor.traverseOne({ ptr, start, end, subjects, predicates, objects, graphs, callback })
    }

    if (quantifier === 'oneOrMore') {
      const ptrs = Processor.traverse({ ptr, end, start, subjects, predicates, objects, graphs, callback })

      return Processor.traverseMore({ ptrs, end, start, subjects, predicates, objects, graphs, callback })
    }

    if (quantifier === 'zeroOrMore') {
      return Processor.traverseMore({ ptrs: [ptr], end, start, subjects, predicates, objects, graphs, callback })
    }

    if (quantifier === 'zeroOrOne') {
      return [ptr, ...Processor.traverse({ ptr, end, start, subjects, predicates, objects, graphs, callback })]
    }

    throw new Error(`unknown quantifier ${quantifier}`)
  }

  static traverseMore ({ ptrs, end, start, subjects, predicates, objects, graphs, callback } = {}) {
    let result = [...ptrs]
    let current

    do {
      current = []

      for (const ptr of ptrs) {
        current = [
          ...current,
          ...Processor.traverseOne({ ptr, end, start, subjects, predicates, objects, graphs, callback })
        ]
      }

      ptrs = current
      result = [...result, ...current]
    } while (current.length > 0)

    return result
  }

  static traverseOne ({ ptr, start, end, subjects, predicates, objects, graphs, callback = (edge, ptr) => ptr.extend(edge) } = {}) {
    const results = []

    for (const subject of subjects) {
      for (const predicate of predicates) {
        for (const object of objects) {
          for (const graph of graphs) {
            const pattern = { subject, predicate, object, graph }

            pattern[start] = ptr.term

            for (const quad of ptr.dataset.match(pattern.subject, pattern.predicate, pattern.object, pattern.graph)) {
              results.push(callback(new Edge({ dataset: ptr.dataset, end, quad, start }), ptr))
            }
          }
        }
      }
    }

    return results
  }
}

export default Processor
